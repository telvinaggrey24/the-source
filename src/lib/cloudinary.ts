export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

const MAX_BYTES = 5 * 1024 * 1024;

function getConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
  const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || 'the-source';
  return { cloudName, uploadPreset, folder };
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, uploadPreset } = getConfig();
  return Boolean(cloudName && uploadPreset);
}

/**
 * Upload an image to Cloudinary (unsigned preset).
 * Returns a HTTPS delivery URL suitable for article/media fields.
 */
export async function uploadImageToCloudinary(
  file: File,
  options?: { folder?: string; tags?: string[] }
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed (JPEG, PNG, WebP, GIF).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  const { cloudName, uploadPreset, folder } = getConfig();
  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);
  // Folder/tags must be allowed by the unsigned preset; folder is usually set on the preset itself.
  const targetFolder = options?.folder || folder;
  if (targetFolder) form.append('folder', targetFolder);
  if (options?.tags?.length) form.append('tags', options.tags.join(','));

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const res = await fetch(endpoint, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (typeof data?.error?.message === 'string' && data.error.message) ||
      `Cloudinary upload failed (${res.status})`;
    throw new Error(msg);
  }

  const url = data.secure_url || data.url;
  if (!url) {
    throw new Error('Cloudinary response missing image URL');
  }

  return {
    url,
    publicId: data.public_id,
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
