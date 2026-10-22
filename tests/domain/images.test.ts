import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { prepareImage } from "../../server/imageService.js";
import { findRegions } from "../../src/painting/regions.js";
import { fixtureImage } from "../support/fixture.js";
test("crop halves reconstruct every normalized pixel without an overlap or gap", async () => {
  const raw = Buffer.alloc(1024 * 1024 * 3, 255);
  for (let y = 0; y < 1024; y++)
    for (let x = 0; x < 1024; x++)
      if (x % 37 < 7 || y % 89 < 3)
        raw.fill(0, (y * 1024 + x) * 3, (y * 1024 + x) * 3 + 3);
  const input = await sharp(raw, {
    raw: { width: 1024, height: 1024, channels: 3 },
  })
    .png()
    .toBuffer();
  const p = await prepareImage(input);
  const joined = await sharp({
    create: { width: 1024, height: 1024, channels: 3, background: "white" },
  })
    .composite([
      { input: p.left, left: 0, top: 0 },
      { input: p.right, left: 512, top: 0 },
    ])
    .removeAlpha()
    .raw()
    .toBuffer();
  const base = await sharp(p.base).removeAlpha().raw().toBuffer();
  assert.deepEqual(joined, base);
  assert.equal((await sharp(p.left).metadata()).width, 512);
  assert.equal((await sharp(p.right).metadata()).width, 512);
});
test("unexpected image dimensions are rejected", async () => {
  await assert.rejects(
    prepareImage(
      await sharp({
        create: { width: 512, height: 512, channels: 3, background: "white" },
      })
        .png()
        .toBuffer(),
    ),
  );
});
test("regions are clipped to the half and black outlines cannot be filled", () => {
  const white = Uint8Array.from([1, 0, 1, 1, 0, 1, 1, 0, 1]);
  const r = findRegions(white, 3, 3);
  assert.deepEqual(r.sizes, [3, 3]);
  assert.equal(r.labels[1], -1);
  assert.notEqual(r.labels[0], r.labels[2]);
});
test("small openings connect regions, explicitly exposing the coloring limitation", () => {
  const r = findRegions(Uint8Array.from([1, 0, 1, 1, 1, 1, 1, 0, 1]), 3, 3);
  assert.deepEqual(r.sizes, [7]);
});
test("synthetic base has usable enclosed regions in both halves", async () => {
  const p = await prepareImage(await fixtureImage());
  for (const bytes of [p.left, p.right]) {
    const raw = await sharp(bytes).greyscale().raw().toBuffer();
    const r = findRegions(
      Uint8Array.from(raw, (v) => (v === 255 ? 1 : 0)),
      512,
      1024,
    );
    assert.ok(r.sizes.length >= 2);
  }
});
