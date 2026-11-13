import { prepareNewsPhoto } from './prepareNewsPhoto';

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
const SERVER_FALLBACK_BYTES = 3.5 * 1024 * 1024;

export function isCloudinaryConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()) || true;
}

type MediaKind = 'image' | 'video' | 'audio';

function detectKind(file: File): MediaKind {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  if (type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/.test(name)) return 'video';
  if (type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|oga|flac)$/.test(name)) return 'audio';
  if (
    type.startsWith('image/') ||
    type.includes('heic') ||
    type.includes('heif') ||
    /\.(jpe?g|png|gif|webp|avif|hei[cf]|bmp|tiff?)$/.test(name) ||
    (!type && /^img_/i.test(file.name))
  ) {
    return 'image';
  }
  throw new Error('Unsupported file. Use a photo (JPEG/PNG/HEIC), video (MP4/WebM), or audio (MP3/WAV/M4A).');
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

function looksLikeRedirectPage(raw: string, status: number): boolean {
  return (
    status === 301 ||
    status === 302 ||
    status === 307 ||
    status === 308 ||
    /redirecting/i.test(raw) ||
    /^\s*</.test(raw)
  );
}

function uploadApiUrls(): string[] {
  const urls = ['/api/upload'];
  if (typeof window === 'undefined') return urls;
  const { protocol, hostname } = window.location;
  // Apex thesource.co.tz 308s POST /api/upload to www and iOS Safari drops the body.
  if (hostname === 'thesource.co.tz') {
    urls.push(`${protocol}//www.thesource.co.tz/api/upload`);
  }
  return urls;
}

async function postUploadApi(body: unknown): Promise<{
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}> {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };

  const urls = uploadApiUrls();
  let lastStatus = 0;
  let lastRaw = '';

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    try {
      const res = await fetch(url, init);
      const raw = await res.text();
      lastStatus = res.status;
      lastRaw = raw;
      if (looksLikeRedirectPage(raw, res.status) && i < urls.length - 1) continue;
      let data: Record<string, unknown> = {};
      try {
        data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      } catch {
        if (i < urls.length - 1) continue;
        throw new Error(
          looksLikeRedirectPage(raw, res.status)
            ? 'Open the site at www.thesource.co.tz, then upload the photo.'
            : res.ok
              ? 'Invalid upload response'
              : `Upload failed (${res.status})`
        );
      }
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      if (i === urls.length - 1) throw error;
    }
  }

  throw new Error(
    lastStatus === 308 || /redirecting/i.test(lastRaw)
      ? 'Open the site at www.thesource.co.tz, then upload the photo.'
      : `Could not reach the upload service (${lastStatus || 'network'}).`
  );
}

async function signUpload(
  resourceType: 'image' | 'video',
  tags: string[]
): Promise<{
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}> {
  const { ok, status, data } = await postUploadApi({ sign: true, resourceType, tags });
  const cloudName = typeof data.cloudName === 'string' ? data.cloudName : '';
  const apiKey = typeof data.apiKey === 'string' ? data.apiKey : '';
  const signature = typeof data.signature === 'string' ? data.signature : '';
  const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Number(data.timestamp);
  const folder = typeof data.folder === 'string' ? data.folder : 'the-source';
  if (!ok || !cloudName || !apiKey || !signature || !timestamp) {
    throw new Error(
      (typeof data.error === 'string' && data.error) || `Could not start upload (${status})`
    );
  }
  return { cloudName, apiKey, timestamp, signature, folder };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read this photo.'));
    reader.readAsDataURL(file);
  });
}

async function uploadImageViaApi(
  file: File,
  tags: string[]
): Promise<CloudinaryUploadResult & { kind: 'image' }> {
  const dataUrl = await fileToDataUrl(file);
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Could not read this photo. Try JPEG or PNG.');
  }
  const { ok, status, data } = await postUploadApi({ file: dataUrl, tags });
  const url = typeof data.url === 'string' ? data.url : '';
  if (!ok || !url) {
    throw new Error(
      (typeof data.error === 'string' && data.error) || `Photo upload failed (${status})`
    );
  }
  return {
    url,
    publicId: typeof data.publicId === 'string' ? data.publicId : '',
    width: typeof data.width === 'number' ? data.width : undefined,
    height: typeof data.height === 'number' ? data.height : undefined,
    format: typeof data.format === 'string' ? data.format : undefined,
    bytes: typeof data.bytes === 'number' ? data.bytes : file.size,
    resourceType: 'image',
    kind: 'image',
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
  let working = file;
  let kind = detectKind(working);
  if (kind === 'image') {
    working = await prepareNewsPhoto(working);
    kind = 'image';
  }

  const limit = maxBytesFor(kind);
  if (working.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw new Error(
      `${kind === 'image' ? 'Photo' : kind === 'video' ? 'Video' : 'Audio'} must be ${mb}MB or smaller.`
    );
  }

  const resourceType = cloudinaryResourceType(kind);
  const tags = options?.tags || [];
  const signed = await signUpload(resourceType, tags);

  const form = new FormData();
  form.append('file', working);
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
    if (kind === 'image' && working.size <= SERVER_FALLBACK_BYTES) {
      try {
        return await uploadImageViaApi(working, tags);
      } catch {
        // Keep the Cloudinary error — it is usually more specific.
      }
    }
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
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  const isImage =
    type.startsWith('image/') ||
    type.includes('heic') ||
    type.includes('heif') ||
    /\.(jpe?g|png|gif|webp|avif|hei[cf])$/i.test(name) ||
    (!type && /^img_/i.test(file.name));
  if (!isImage) {
    throw new Error('Only image files are allowed (JPEG, PNG, WebP, HEIC).');
  }
  return uploadMediaToCloudinary(file, options);
}

export function cloudinaryThumb(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,f_auto,q_auto,w_${width}/`);
}
