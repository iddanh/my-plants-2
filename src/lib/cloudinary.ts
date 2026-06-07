const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadedImage {
  url: string;
  publicId: string;
}

/** Upload a (cropped) image blob to Cloudinary using an unsigned preset. */
export async function uploadImage(blob: Blob): Promise<UploadedImage> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.',
    );
  }

  const form = new FormData();
  form.append('file', blob);
  form.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Image upload failed (${res.status}). ${text}`);
  }

  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}

/**
 * Build a transformed Cloudinary URL (resized, auto format/quality) from a
 * stored secure_url. Falls back to the original URL if it isn't a Cloudinary URL.
 */
export function thumbUrl(url: string, size = 400): string {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const transform = `c_fill,g_auto,w_${size},h_${size},f_auto,q_auto`;
  return `${url.slice(0, idx + marker.length)}${transform}/${url.slice(idx + marker.length)}`;
}
