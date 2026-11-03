export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

const MAX_BYTES = 5 * 1024 * 1024;

export function isCloudinaryConfigured(): boolean {
  // Server holds the API secret; client only needs cloud name (or can always hit /api/upload).
  return Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim()) || true;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read image file'));
    };
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image via our signed /api/upload → Cloudinary.
 * API secret never leaves the server.
 */
export async function uploadImageToCloudinary(
  file: File,
  options?: { tags?: string[] }
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed (JPEG, PNG, WebP, GIF).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  const dataUrl = await fileToDataUrl(file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: dataUrl,
      tags: options?.tags || [],
    }),
  });

  const raw = await res.text();
  let data: CloudinaryUploadResult & { error?: string } = { url: '', publicId: '' };
  try {
    data = raw ? JSON.parse(raw) : data;
  } catch {
    throw new Error(res.ok ? 'Invalid upload response' : `Upload failed (${res.status})`);
  }

  if (!res.ok || !data.url) {
    throw new Error(data.error || `Cloudinary upload failed (${res.status})`);
  }

  return {
    url: data.url,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

/** Optional transform helper for display sizing. */
export function cloudinaryThumb(url: string, width = 800): string {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/c_fill,f_auto,q_auto,w_${width}/`);
}
