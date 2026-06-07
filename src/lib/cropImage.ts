import type { Area } from 'react-easy-crop';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (e) => reject(e));
    img.src = src;
  });
}

/**
 * Produce a cropped JPEG blob from a source image and the pixel crop area
 * reported by react-easy-crop. Output is downscaled to at most `maxSize` px
 * on its longest edge to keep uploads small.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  maxSize = 1000,
  quality = 0.85,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const scale = Math.min(1, maxSize / Math.max(pixelCrop.width, pixelCrop.height));
  const outW = Math.round(pixelCrop.width * scale);
  const outH = Math.round(pixelCrop.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      },
      'image/jpeg',
      quality,
    );
  });
}
