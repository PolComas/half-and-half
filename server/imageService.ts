import sharp from "sharp";
import { createHash } from "node:crypto";
import { HALF_WIDTH, IMAGE_SIZE } from "./config.js";
import { assert } from "./errors.js";
export const sha256 = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");
export async function prepareImage(original: Buffer) {
  const metadata = await sharp(original, {
    limitInputPixels: IMAGE_SIZE ** 2,
  }).metadata();
  assert(
    metadata.width === IMAGE_SIZE && metadata.height === IMAGE_SIZE,
    "wrong_image_size",
    "The drawing could not be prepared.",
  );
  const base = await sharp(original)
    .flatten({ background: "#FFFFFF" })
    .greyscale()
    .threshold(180)
    .png()
    .toBuffer();
  const [left, right] = await Promise.all(
    [0, HALF_WIDTH].map((x) =>
      sharp(base)
        .extract({ left: x, top: 0, width: HALF_WIDTH, height: IMAGE_SIZE })
        .png()
        .toBuffer(),
    ),
  );
  return {
    base,
    left: left!,
    right: right!,
    baseHash: sha256(base),
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    preprocessVersion: 1,
  };
}
