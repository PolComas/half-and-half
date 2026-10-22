import sharp from "sharp";
import type { PrivateStorage } from "../../server/storage.js";
// Synthetic fixture. It is NOT evidence of a live AI generation.
export async function fixtureImage() {
  return sharp(
    Buffer.from(
      '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="white"/><circle cx="320" cy="420" r="180" fill="none" stroke="black" stroke-width="8"/><rect x="450" y="300" width="400" height="360" rx="30" fill="none" stroke="black" stroke-width="8"/></svg>',
    ),
  )
    .png()
    .toBuffer();
}
export class TestStorage implements PrivateStorage {
  private data = new Map<string, Buffer>();
  async put(path: string, bytes: Buffer) {
    const old = this.data.get(path);
    if (old && !old.equals(bytes)) throw new Error("Immutable object changed.");
    this.data.set(path, bytes);
  }
  async get(path: string) {
    return this.data.get(path) ?? null;
  }
}
