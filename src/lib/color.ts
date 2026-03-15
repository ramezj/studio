import type { ColorStop } from "@/types/tools";

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Linearly interpolate between two hex colors. */
export function lerpColor(c1: string, c2: string, t: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  if (!a || !b) return c1;
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

/** Sample a sorted gradient at a given position [0,1]. */
export function getColorAtPosition(stops: ColorStop[], position: number): string {
  if (stops.length === 0) return "#000000";
  if (stops.length === 1) return stops[0].color;

  const sorted = [...stops].sort((a, b) => a.position - b.position);

  if (position <= sorted[0].position) return sorted[0].color;
  if (position >= sorted[sorted.length - 1].position)
    return sorted[sorted.length - 1].color;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (position >= sorted[i].position && position <= sorted[i + 1].position) {
      const t =
        (position - sorted[i].position) /
        (sorted[i + 1].position - sorted[i].position);
      return lerpColor(sorted[i].color, sorted[i + 1].color, t);
    }
  }

  return sorted[sorted.length - 1].color;
}

export function randomHexColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}
