import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateImage,
  imagePrompt,
  UncertainGeneration,
} from "../../server/openaiImages.js";
test("one explicit request sends both ideas with fixed model, size and quality", async () => {
  let calls = 0;
  const transport: typeof fetch = async (_url, init) => {
    calls++;
    const p = JSON.parse(init!.body as string);
    assert.equal(p.n, 1);
    assert.equal(p.size, "1024x1024");
    assert.equal(p.quality, "low");
    assert.ok(p.prompt.includes("dragon"));
    assert.ok(p.prompt.includes("moon"));
    return Response.json({
      data: [{ b64_json: Buffer.from("test").toString("base64") }],
      usage: { output_tokens: 1 },
    });
  };
  const r = await generateImage(
    "test-key-not-real",
    { left: "dragon", right: "moon" },
    transport,
  );
  assert.equal(calls, 1);
  assert.equal(r.bytes.toString(), "test");
});
test("network ambiguity never silently retries the paid request", async () => {
  let calls = 0;
  await assert.rejects(
    generateImage("not-real", { left: "x", right: "y" }, async () => {
      calls++;
      throw new Error("connection lost");
    }),
    UncertainGeneration,
  );
  assert.equal(calls, 1);
});
test("server errors are treated as uncertain, explicit rejections as failures", async () => {
  await assert.rejects(
    generateImage(
      "not-real",
      { left: "x", right: "y" },
      async () => new Response("", { status: 503 }),
    ),
    UncertainGeneration,
  );
  await assert.rejects(
    generateImage(
      "not-real",
      { left: "x", right: "y" },
      async () => new Response("", { status: 400 }),
    ),
    (e: any) => e.code === "generation_failed",
  );
});
test("gibberish stays as supplied and creative fallback is in the prompt", () => {
  const p = imagePrompt("asjdfoasfn", "flower");
  assert.ok(p.includes("asjdfoasfn"));
  assert.ok(p.includes("incomprehensible"));
  assert.ok(p.includes("SINGLE creature or object"));
  assert.ok(p.includes("Never draw the two ideas as separate"));
  assert.ok(p.length <= 2000);
});
