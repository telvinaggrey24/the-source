/** iPhone camera shots are often HEIC and too large for a direct Cloudinary post. */

const MAX_EDGE = 1920;
const REENCODE_BYTES = 2.5 * 1024 * 1024;

function isHeicLike(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    type.includes('heic') ||
    type.includes('heif') ||
    /\.hei[cf]$/.test(name)
  );
}

function isImageLike(file: File): boolean {
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  if (type.startsWith('image/') || isHeicLike(file)) return true;
  if (/\.(jpe?g|png|gif|webp|avif|hei[cf]|bmp|tiff?)$/.test(name)) return true;
  return !type && /^img_/i.test(file.name);
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to <img> — older iOS builds can decode HEIC there.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read this photo. Try JPEG or PNG.'));
      el.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function dimensionsOf(image: ImageBitmap | HTMLImageElement): { width: number; height: number } {
  if ('naturalWidth' in image) {
    return {
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    };
  }
  return { width: image.width, height: image.height };
}

/**
 * Turn iPhone HEIC / huge camera JPEGs into a web JPEG that Cloudinary accepts.
 * Non-photos are returned unchanged.
 */
export async function prepareNewsPhoto(file: File): Promise<File> {
  if (!isImageLike(file)) return file;

  const needsEncode =
    isHeicLike(file) ||
    !file.type ||
    file.size > REENCODE_BYTES;

  if (!needsEncode && /jpeg|jpg|png|webp|gif/i.test(file.type)) {
    return file;
  }

  try {
    const image = await decodeImage(file);
    const { width, height } = dimensionsOf(image);
    if (!width || !height) return file;

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if ('close' in image && typeof image.close === 'function') {
      image.close();
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        next => (next ? resolve(next) : reject(new Error('Could not encode photo'))),
        'image/jpeg',
        0.85
      );
    });

    const stem = file.name.replace(/\.[^.]+$/, '') || 'news-photo';
    return new File([blob], `${stem}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}
