import { findRegions } from "./regions";
export type Tool = "brush" | "bucket";
export type Settings = { tool: Tool; color: string; width: number };
export const initialSettings: Settings = {
  tool: "bucket",
  color: "#E45756",
  width: 12,
};
export class PaintingModel {
  readonly regions;
  pixels: Uint8ClampedArray;
  undo: Uint8ClampedArray | null = null;
  constructor(
    readonly white: Uint8Array,
    readonly width: number,
    readonly height: number,
  ) {
    this.regions = findRegions(white, width, height);
    this.pixels = new Uint8ClampedArray(width * height * 4);
  }
  begin() {
    this.undo = this.pixels.slice();
  }
  clear() {
    this.begin();
    this.pixels.fill(0);
  }
  undoAction() {
    if (this.undo) {
      this.pixels = this.undo;
      this.undo = null;
    }
  }
  private colorAt(index: number, rgb: number[]) {
    this.pixels.set([rgb[0]!, rgb[1]!, rgb[2]!, 255], index * 4);
  }
  fill(x: number, y: number, color: string) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    const region = this.regions.labels[y * this.width + x]!;
    if (region < 0) return false;
    this.begin();
    const rgb = hexRgb(color);
    for (let i = 0; i < this.white.length; i++)
      if (this.regions.labels[i] === region) this.colorAt(i, rgb);
    return true;
  }
  stroke(
    from: { x: number; y: number },
    to: { x: number; y: number },
    width: number,
    color: string,
  ) {
    const radius = width / 2,
      rgb = hexRgb(color);
    const steps = Math.max(
      1,
      Math.ceil(
        Math.hypot(to.x - from.x, to.y - from.y) / Math.max(0.5, radius / 3),
      ),
    );
    for (let step = 0; step <= steps; step++) {
      const cx = from.x + ((to.x - from.x) * step) / steps,
        cy = from.y + ((to.y - from.y) * step) / steps;
      for (
        let y = Math.max(0, Math.floor(cy - radius));
        y < Math.min(this.height, Math.ceil(cy + radius));
        y++
      )
        for (
          let x = Math.max(0, Math.floor(cx - radius));
          x < Math.min(this.width, Math.ceil(cx + radius));
          x++
        )
          if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= radius ** 2)
            this.colorAt(y * this.width + x, rgb);
    }
  }
  composite() {
    const result = new Uint8ClampedArray(this.pixels.length);
    for (let i = 0; i < this.white.length; i++) {
      const p = i * 4;
      const alpha = this.pixels[p + 3]! / 255;
      for (let c = 0; c < 3; c++)
        result[p + c] = this.white[i]
          ? Math.round(255 * (1 - alpha) + this.pixels[p + c]! * alpha)
          : 0;
      result[p + 3] = 255;
    }
    return result;
  }
}
export function hexRgb(color: string) {
  if (!/^#[\da-f]{6}$/i.test(color)) throw new Error("Invalid color.");
  return [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
}
