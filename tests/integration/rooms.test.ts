import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { testDatabase, PgGateway } from "../support/database.js";
import { RoomService } from "../../server/roomService.js";
import { tokenHash } from "../../server/session.js";
import { GenerationService } from "../../server/generationService.js";
import { fixtureImage, TestStorage } from "../support/fixture.js";
import { originalPath } from "../../server/storage.js";
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
async function pair() {
  const a = tokenHash(randomUUID()),
    b = tokenHash(randomUUID());
  const r = await rooms.command(a, "create", { code: rooms.code() });
  await rooms.command(b, "join", { code: r.code });
  return { a, b };
}
async function command(
  hash: string,
  action: string,
  extra: Record<string, unknown> = {},
) {
  const state = await rooms.state(hash);
  return rooms.command(hash, action, {
    expectedVersion: state!.version,
    operationId: randomUUID(),
    ...extra,
  });
}
test("two seats only, idempotent reconnect, ideas hidden until base is published", async () => {
  const { a, b } = await pair();
  const r = await rooms.state(a);
  assert.equal(r!.side, "left");
  assert.equal((await rooms.state(b))!.side, "right");
  assert.equal(r!.ideas, null);
  await assert.rejects(
    rooms.command(tokenHash(randomUUID()), "join", { code: r!.code }),
    /two people/,
  );
  const same = await rooms.command(a, "create", { code: rooms.code() });
  assert.equal(same.roomId, r!.roomId);
  await assert.rejects(command(a, "confirm"), /write an idea/);
});
test("concurrent confirmation yields one attempt; claim and publish are idempotent", async () => {
  const { a, b } = await pair();
  await command(a, "save", { text: "dragon" });
  await command(b, "save", { text: "moon" });
  const version = (await rooms.state(a))!.version;
  const confirmations = await Promise.allSettled([
    rooms.command(a, "confirm", {
      expectedVersion: version,
      operationId: randomUUID(),
    }),
    rooms.command(b, "confirm", {
      expectedVersion: version,
      operationId: randomUUID(),
    }),
  ]);
  assert.equal(confirmations.filter((r) => r.status === "fulfilled").length, 1);
  const pending = (await rooms.state(a))!.confirmed ? b : a;
  await command(pending, "confirm");
  const r = (await rooms.state(a))!;
  assert.equal(r.phase, "generating");
  assert.equal(r.attemptsUsed, 1);
  assert.equal(r.ideas, null);
  await assert.rejects(command(a, "edit"), /moved on/);
  const attempts = await gateway.attempts(r.roomId);
  const attempt = attempts[0]!;
  const claims = await Promise.all([
    gateway.rpc("hh_claim_attempt", {
      p_attempt_id: attempt.id,
      p_executor: randomUUID(),
    }),
    gateway.rpc("hh_claim_attempt", {
      p_attempt_id: attempt.id,
      p_executor: randomUUID(),
    }),
  ]);
  assert.equal(claims.filter(Boolean).length, 1);
  const args = {
    p_attempt_id: attempt.id,
    p_manifest: { width: 1024, height: 1024, baseHash: "a".repeat(64) },
    p_usage: null,
  };
  await gateway.rpc("hh_publish_base", args);
  await gateway.rpc("hh_publish_base", args);
  assert.deepEqual((await rooms.state(a))!.ideas, {
    left: "dragon",
    right: "moon",
  });
});
test("retries and idea edits do not reset the shared three-attempt maximum", async () => {
  const { a, b } = await pair();
  await command(a, "save", { text: "cat" });
  await command(b, "save", { text: "plant" });
  await command(a, "confirm");
  await command(b, "confirm");
  for (let i = 1; i <= 3; i++) {
    const r = (await rooms.state(a))!;
    assert.equal(r.attemptsUsed, i);
    const attempt = (await gateway.attempts(r.roomId))[0]!;
    await gateway.rpc("hh_fail_attempt", {
      p_attempt_id: attempt.id,
      p_uncertain: false,
      p_error_code: "test_rejected",
    });
    if (i < 3) {
      await command(a, "edit");
      await command(a, "save", { text: "cat " + i });
      await command(a, "confirm");
    }
  }
  assert.equal((await rooms.state(a))!.phase, "generation_exhausted");
  await assert.rejects(command(a, "retry"));
});
test("global quota is atomic across rooms and survives new room creation", async () => {
  await db.owner.query(
    "update public.demo_budget set max_requests=requests_used+1 where id=1",
  );
  const x = await pair(),
    y = await pair();
  for (const pair of [x, y]) {
    await command(pair.a, "save", { text: "one" });
    await command(pair.b, "save", { text: "two" });
    await command(pair.a, "confirm");
  }
  await Promise.all([command(x.b, "confirm"), command(y.b, "confirm")]);
  const phases = [
    (await rooms.state(x.a))!.phase,
    (await rooms.state(y.a))!.phase,
  ];
  assert.deepEqual(phases.sort(), ["budget_blocked", "generating"]);
  await db.owner.query(
    "update public.demo_budget set max_requests=20 where id=1",
  );
});
test("a lost provider response is not retried when the server recovers", async () => {
  const { a, b } = await pair();
  await command(a, "save", { text: "x" });
  await command(b, "save", { text: "y" });
  await command(a, "confirm");
  await command(b, "confirm");
  const r = (await rooms.state(a))!;
  const attempt = (await gateway.attempts(r.roomId))[0]!;
  await gateway.rpc("hh_claim_attempt", {
    p_attempt_id: attempt.id,
    p_executor: randomUUID(),
  });
  let paidCalls = 0;
  const service = new GenerationService(
    gateway,
    new TestStorage(),
    async () => {
      paidCalls++;
      return {
        bytes: await fixtureImage(),
        usage: null,
        promptVersion: "test",
      };
    },
  );
  await service.kick(r.roomId, true);
  for (let i = 0; i < 30 && (await rooms.state(a))!.phase === "generating"; i++)
    await new Promise((r) => setTimeout(r, 20));
  assert.equal((await rooms.state(a))!.phase, "generation_uncertain");
  assert.equal(paidCalls, 0);
  await assert.rejects(command(a, "retry"));
});
test("browser roles have no table or function access, even without a policy", async () => {
  const client = await db.owner.connect();
  try {
    await client.query("set role anon");
    await assert.rejects(client.query("select * from public.participants"));
    await assert.rejects(
      client.query("select public.hh_state($1)", ["0".repeat(64)]),
    );
  } finally {
    await client.query("reset role");
    client.release();
  }
});
test("a saved original recovers an uncertain attempt without another provider call", async () => {
  const { a, b } = await pair();
  await command(a, "save", { text: "x" });
  await command(b, "save", { text: "y" });
  await command(a, "confirm");
  await command(b, "confirm");
  const room = (await rooms.state(a))!;
  const attempt = (await gateway.attempts(room.roomId))[0]!;
  await gateway.rpc("hh_claim_attempt", {
    p_attempt_id: attempt.id,
    p_executor: randomUUID(),
  });
  await gateway.rpc("hh_fail_attempt", {
    p_attempt_id: attempt.id,
    p_uncertain: true,
    p_error_code: "test_interrupted",
  });
  const storage = new TestStorage();
  await storage.put(originalPath(attempt.id), await fixtureImage());
  let calls = 0;
  const service = new GenerationService(gateway, storage, async () => {
    calls++;
    throw new Error("Must not call provider");
  });
  await service.kick(room.roomId);
  for (let i = 0; i < 60 && (await rooms.state(a))!.phase !== "painting"; i++)
    await new Promise((r) => setTimeout(r, 30));
  assert.equal((await rooms.state(a))!.phase, "painting");
  assert.equal((await rooms.state(a))!.attemptsUsed, 1);
  assert.equal(calls, 0);
});

test("disabled generation leaves reserved attempts untouched even during restart recovery", async () => {
  await db.owner.query(
    "update public.demo_budget set requests_used=0,max_requests=20 where id=1",
  );
  const { a, b } = await pair();
  await command(a, "save", { text: "panda" });
  await command(b, "save", { text: "dragon" });
  await command(a, "confirm");
  await command(b, "confirm");
  const state = (await rooms.state(a))!;
  let calls = 0;
  const service = new GenerationService(
    gateway,
    new TestStorage(),
    async () => {
      calls++;
      return {
        bytes: await fixtureImage(),
        usage: null,
        promptVersion: "fixture",
      };
    },
    false,
  );
  await service.kick(state.roomId, true);
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(calls, 0);
  assert.equal((await gateway.attempts(state.roomId))[0]!.state, "reserved");
});
