import { test } from "node:test";
import assert from "node:assert/strict";
import { PaintingModel, initialSettings } from "../../src/painting/model.js";
import { DraftSaver, type Draft } from "../../src/painting/draftStore.js";
test("bucket uses immutable base regions, including the clipped center edge; brush stays under outlines", () => {
  const white = Uint8Array.from([1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]);
  const m = new PaintingModel(white, 4, 3);
  assert.equal(m.fill(0, 0, "#ff0000"), true);
  assert.equal(m.pixels[3 * 4 + 3], 0);
  assert.equal(m.fill(2, 0, "#ff0000"), false);
  m.begin();
  m.stroke({ x: -20, y: 0 }, { x: 30, y: 3 }, 12, "#0000ff");
  assert.equal(m.pixels.length, 48);
  const display = m.composite();
  assert.deepEqual([...display.slice(8, 12)], [0, 0, 0, 255]);
  m.fill(0, 0, "#00ff00");
  assert.equal(m.pixels[1], 255);
  assert.equal(m.pixels[9], 0);
  assert.deepEqual([...white], [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]);
});
test("one undo restores a stroke, fill and clear; new actions replace its snapshot", () => {
  const m = new PaintingModel(new Uint8Array(16).fill(1), 4, 4);
  m.fill(0, 0, "#ff0000");
  const red = m.pixels.slice();
  m.begin();
  m.stroke({ x: 0, y: 0 }, { x: 4, y: 4 }, 2, "#0000ff");
  m.undoAction();
  assert.deepEqual(m.pixels, red);
  assert.equal(m.undo, null);
  m.clear();
  assert.ok(m.pixels.every((x) => x === 0));
  m.undoAction();
  assert.deepEqual(m.pixels, red);
  m.fill(0, 0, "#00ff00");
  m.undoAction();
  assert.deepEqual(m.pixels, red);
});
function draft(revision: number): Draft {
  return {
    key: "test",
    revision,
    pixels: new Uint8ClampedArray(4),
    undo: null,
    settings: initialSettings,
  };
}
test("slow serialized saves cannot resurrect an old revision or claim saved before newest write", async () => {
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  const writes: number[] = [],
    states: string[] = [];
  const saver = new DraftSaver(
    async (d) => {
      if (d.revision === 1) await gate;
      writes.push(d.revision);
    },
    (s, r) => states.push(`${s}:${r}`),
  );
  const a = saver.save(draft(1)),
    b = saver.save(draft(2));
  await new Promise((r) => setTimeout(r, 5));
  assert.deepEqual(writes, []);
  assert.ok(!states.includes("saved:1"));
  release();
  await Promise.all([a, b]);
  assert.deepEqual(writes, [1, 2]);
  assert.equal(states.at(-1), "saved:2");
  assert.ok(!states.includes("saved:1"));
});
test("failed writes never report success and a retry saves the current snapshot", async () => {
  let fail = true;
  const states: string[] = [];
  const saver = new DraftSaver(
    async () => {
      if (fail) throw Error("disk");
    },
    (s) => states.push(s),
  );
  await assert.rejects(saver.save(draft(1)));
  assert.equal(states.at(-1), "error");
  fail = false;
  await saver.save(draft(2));
  assert.equal(states.at(-1), "saved");
});
