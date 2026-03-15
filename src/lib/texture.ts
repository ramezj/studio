/**
 * Apply pixel noise grain to a canvas context.
 * amount: 0–100 controls noise intensity.
 */
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
): void {
  if (amount <= 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensity = amount / 100;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply a multi-scale hash noise texture overlay.
 * amount: 0–100 controls opacity.
 */
export function applyCanvasTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
): void {
  if (amount <= 0) return;
  const alpha = amount / 100;

  ctx.save();
  ctx.globalAlpha = alpha * 0.15;
  ctx.globalCompositeOperation = "overlay";

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Multi-scale hash noise
      const fine = hash(x * 374761393 + y * 668265263) & 255;
      const coarse = hash((x >> 2) * 1274126177 + (y >> 2) * 1911520717) & 255;
      const v = (fine + coarse) >> 1;
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
}

/** Simple integer hash for noise generation. */
function hash(n: number): number {
  let x = n;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = (x >> 16) ^ x;
  return x;
}
