import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { testDatabase, PgGateway } from "../support/database.js";
import { RoomService, type Gateway } from "../../server/roomService.js";
import { FinalService, normalizeColors } from "../../server/finalService.js";
import { tokenHash } from "../../server/session.js";
import { prepareImage } from "../../server/imageService.js";
import { fixtureImage, TestStorage } from "../support/fixture.js";
let db: Awaited<ReturnType<typeof testDatabase>>,
  gateway: PgGateway,
  rooms: RoomService;
before(async () => {
  db = await testDatabase();
  gateway = new PgGateway(db.pool);
  rooms = new RoomService(gateway, true);
});
after(async () => {
  await db?.close();
});
class Storage extends TestStorage {
  failFinal = false;
  failResult = false;
  override async put(path: string, bytes: Buffer) {
    if (
      (this.failFinal && path.startsWith("finals/")) ||
      (this.failResult && path.startsWith("results/"))
    )
      throw Error("Simulated upload failure");
    return super.put(path, bytes);
  }
}
async function round() {
  const a = tokenHash(randomUUID()),
    b = tokenHash(randomUUID());
  const r = await rooms.command(a, "create", { code: rooms.code() });
  await rooms.command(b, "join", { code: r.code });
  for (const h of [a, b]) {
    let v = (await rooms.state(h))!;
    await rooms.command(h, "save", {
      text: "creative idea",
      operationId: randomUUID(),
      expectedVersion: v.version,
    });
    v = (await rooms.state(h))!;
    await rooms.command(h, "confirm", {
      operationId: randomUUID(),
      expectedVersion: v.version,
    });
  }
  const attempt = (await gateway.attempts(r.roomId))[0]!;
  await gateway.rpc("hh_claim_attempt", {
    p_attempt_id: attempt.id,
    p_executor: randomUUID(),
  });
  const prepared = await prepareImage(await fixtureImage()),
    storage = new Storage();
  for (const [file, bytes] of [
    ["base", prepared.base],
    ["left", prepared.left],
    ["right", prepared.right],
  ] as const)
    await storage.put(`bases/${attempt.id}/${file}.png`, bytes);
  await gateway.rpc("hh_publish_base", {
    p_attempt_id: attempt.id,
    p_manifest: { baseHash: prepared.baseHash, width: 1024, height: 1024 },
    p_usage: null,
  });
  return {
    a,
    b,
    roomId: r.roomId,
    baseId: attempt.id,
    storage,
    service: new FinalService(rooms, gateway, storage),
  };
}
async function input(baseId: string, color = "red") {
  return {
    baseId,
    commitId: randomUUID(),
    revision: 3,
    bytes: await sharp({
      create: { width: 512, height: 1024, channels: 4, background: color },
    })
      .png()
      .toBuffer(),
  };
}
test("one valid saved finish remains private; identical retries never count as a second person", async () => {
  const r = await round(),
    data = await input(r.baseId);
  const first = await r.service.finish(r.a, data);
  assert.equal(first.finished, true);
  assert.equal(first.partnerFinished, false);
  assert.equal(first.phase, "painting");
  const again = await r.service.finish(r.a, data);
  assert.equal(again.version, first.version);
  await assert.rejects(r.service.result(first), /both finished/);
  assert.deepEqual(
    await r.service.ownFinal(first),
    await normalizeColors(data.bytes),
  );
  assert.equal((await rooms.state(r.b))!.finished, false);
  await assert.rejects(
    r.service.finish(r.a, { ...data, commitId: randomUUID() }),
    /already finished/,
  );
  await assert.rejects(
    r.service.finish(r.a, {
      ...data,
      bytes: (await input(r.baseId, "blue")).bytes,
    }),
    /already finished/,
  );
});
test("invalid PNG, wrong base, failed upload and failed commit never mark a participant done", async () => {
  const r = await round(),
    data = await input(r.baseId);
  await assert.rejects(
    r.service.finish(r.a, { ...data, bytes: Buffer.from("not png") }),
  );
  const wrongSize = await sharp({
    create: { width: 1, height: 1, channels: 4, background: "red" },
  })
    .png()
    .toBuffer();
  await assert.rejects(r.service.finish(r.a, { ...data, bytes: wrongSize }));
  await assert.rejects(
    r.service.finish(r.a, { ...data, baseId: randomUUID() }),
  );
  await assert.rejects(r.service.finish(tokenHash(randomUUID()), data));
  r.storage.failFinal = true;
  await assert.rejects(r.service.finish(r.a, data));
  r.storage.failFinal = false;
  assert.equal((await rooms.state(r.a))!.finished, false);
  const faulty: Gateway = {
    rpc: async <T>(name: string, args: Record<string, unknown>) => {
      if (name === "hh_commit_final") throw Error("Simulated commit failure");
      return gateway.rpc<T>(name, args);
    },
    attempts: (id) => gateway.attempts(id),
    manifest: (id) => gateway.manifest(id),
  };
  await assert.rejects(
    new FinalService(rooms, faulty, r.storage).finish(r.a, data),
  );
  assert.equal((await rooms.state(r.a))!.finished, false);
  assert.equal((await r.service.finish(r.a, data)).finished, true);
});
test("lost commit response is recoverable by state and retrying the exact immutable commit", async () => {
  const r = await round(),
    data = await input(r.baseId);
  let lose = true;
  const flaky: Gateway = {
    rpc: async <T>(name: string, args: Record<string, unknown>) => {
      const value = await gateway.rpc<T>(name, args);
      if (name === "hh_commit_final" && lose) {
        lose = false;
        throw Error("Response lost after transaction");
      }
      return value;
    },
    attempts: (id) => gateway.attempts(id),
    manifest: (id) => gateway.manifest(id),
  };
  const service = new FinalService(rooms, flaky, r.storage);
  await assert.rejects(service.finish(r.a, data));
  assert.equal((await rooms.state(r.a))!.finished, true);
  const resumed = await service.finish(r.a, data);
  assert.equal(resumed.finished, true);
  assert.equal(resumed.partnerFinished, false);
});
test("concurrent finishes, composition recovery and exhausted generation budget yield one identical result", async () => {
  const r = await round(),
    red = await input(r.baseId),
    blue = await input(r.baseId, "blue");
  r.storage.failResult = true;
  await db.owner.query(
    "update public.demo_budget set requests_used=max_requests where id=1",
  );
  const both = await Promise.all([
    r.service.finish(r.a, red),
    r.service.finish(r.b, blue),
  ]);
  assert.ok(both.every((x) => x.finished));
  assert.equal((await rooms.state(r.a))!.phase, "composing");
  await assert.rejects(r.service.compose(r.roomId));
  await assert.rejects(r.service.result((await rooms.state(r.a))!));
  r.storage.failResult = false;
  await Promise.all([r.service.compose(r.roomId), r.service.compose(r.roomId)]);
  const a = (await rooms.state(r.a))!,
    b = (await rooms.state(r.b))!;
  assert.equal(a.phase, "revealed");
  assert.equal(a.partnerFinished, true);
  const left = await r.service.result(a),
    right = await r.service.result(b);
  assert.deepEqual(left, right);
  const { data, info } = await sharp(left)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1024);
  assert.equal(info.height, 1024);
  const pixel = (x: number, y: number) => [
    ...data.slice((y * 1024 + x) * 4, (y * 1024 + x) * 4 + 4),
  ];
  assert.deepEqual(pixel(511, 10), [255, 0, 0, 255]);
  assert.deepEqual(pixel(512, 10), [0, 0, 255, 255]);
  assert.deepEqual(pixel(320, 240), [0, 0, 0, 255]);
  assert.equal((await r.service.finish(r.a, red)).phase, "revealed");
  await assert.rejects(
    r.service.finish(r.a, { ...red, commitId: randomUUID() }),
  );
});
