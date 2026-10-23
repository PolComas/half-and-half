import { test } from "node:test";
import assert from "node:assert/strict";
import { replacementToken, tokenHash } from "../../server/session.js";
test("a room replacement is stable for retries and bound to its private source credential", () => {
  const source = "a".repeat(64),
    op = "00000000-0000-4000-8000-000000000001";
  const token = replacementToken(source, op);
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(replacementToken(source, op), token);
  assert.notEqual(token, source);
  assert.notEqual(tokenHash(token), tokenHash(source));
  assert.notEqual(replacementToken("b".repeat(64), op), token);
  assert.notEqual(
    replacementToken(source, "00000000-0000-4000-8000-000000000002"),
    token,
  );
});
