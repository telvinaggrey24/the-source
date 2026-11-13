export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: string;
}

const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
const AUDIO_MAX_BYTES = 20 * 1024 * 1024;
const VIDEO_MAX_BYTES = 80 * 1024 * 1024;

export function isCloudinaryConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()) || true;
}

type MediaKind = 'image' | 'video' | 'audio';

function detectKind(file: File): MediaKind {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('image/')) return 'image';
  const name = file.name.toLowerCase();
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(name)) return 'video';
  if (/\.(mp3|wav|m4a|aac|ogg|oga|flac)$/.test(name)) return 'audio';
  if (/\.(jpe?g|png|gif|webp|avif)$/.test(name)) return 'image';
  throw new Error('Unsupported file. Use a photo (JPEG/PNG/WebP), video (MP4/WebM), or audio (MP3/WAV/M4A).');
}

function maxBytesFor(kind: MediaKind): number {
  if (kind === 'video') return VIDEO_MAX_BYTES;
  if (kind === 'audio') return AUDIO_MAX_BYTES;
  return IMAGE_MAX_BYTES;
}

/** Cloudinary treats audio as resource_type=video. */
function cloudinaryResourceType(kind: MediaKind): 'image' | 'video' {
  return kind === 'image' ? 'image' : 'video';
}

async function signUpload(resourceType: 'image' | 'video', tags: string[]): Promise<{
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sign: true, resourceType, tags }),
  });
  const raw = await res.text();
  let data: {
    error?: string;
    cloudName?: string;
    apiKey?: string;
    timestamp?: number;
    signature?: string;
    folder?: string;
  } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(res.ok ? 'Invalid upload signature' : `Upload failed (${res.status})`);
  }
  if (!res.ok || !data.cloudName || !data.apiKey || !data.signature || !data.timestamp) {
    throw new Error(data.error || `Could not start upload (${res.status})`);
  }
  return {
    cloudName: data.cloudName,
    apiKey: data.apiKey,
    timestamp: data.timestamp,
    signature: data.signature,
    folder: data.folder || 'the-source',
  };
}

/**
 * Upload photo, video, or audio straight to Cloudinary (signed).
 * The returned HTTPS URL is stored on the article so media plays in-app.
 */
export async function uploadMediaToCloudinary(
  file: File,
  options?: { tags?: string[] }
): Promise<CloudinaryUploadResult & { kind: MediaKind }> {
  const kind = detectKind(file);
  const limit = maxBytesFor(kind);
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw new Error(`${kind === 'image' ? 'Photo' : kind === 'video' ? 'Video' : 'Audio'} must be ${mb}MB or smaller.`);
  }

  const resourceType = cloudinaryResourceType(kind);
  const tags = options?.tags || [];
  const signed = await signUpload(resourceType, tags);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signed.apiKey);
  form.append('timestamp', String(signed.timestamp));
  form.append('signature', signed.signature);
  form.append('folder', signed.folder);
  if (tags.length) form.append('tags', tags.join(','));

  const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`;
  const upstream = await fetch(endpoint, { method: 'POST', body: form });
  const data = (await upstream.json().catch(() => ({}))) as {
    error?: { message?: string };
    secure_url?: string;
    url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    resource_type?: string;
  };

  if (!upstream.ok) {
    throw new Error(data.error?.message || `Upload failed (${upstream.status})`);
  }

  const url = data.secure_url || data.url;
  if (!url) throw new Error('Upload succeeded but no media URL was returned.');

  return {
    url,
    publicId: data.public_id || '',
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    resourceType: data.resource_type,
    kind,
  };
}

/** @deprecated use uploadMediaToCloudinary — kept for existing image call sites */
export async function uploadImageToCloudinary(
  file: File,
  options?: { tags?: string[] }
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith('image/') && !/\.(jpe?g|png|gif|webp|avif)$/i.test(file.name)) {
    throw new Error('Only image files are allowed (JPEG, PNG, WebP, GIF).');
  }
  return uploadMediaToCloudinary(file, options);
}

export function cloudinaryThumb(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,f_auto,q_auto,w_${width}/`);
}
