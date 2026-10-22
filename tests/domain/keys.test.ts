import { test } from "node:test";
import assert from "node:assert/strict";
import { isServerKey } from "../../server/supabase.js";
test("public anon keys cannot be used as the backend service key", () => {
  const jwt = (role: string) =>
    "eyJ." +
    Buffer.from(JSON.stringify({ role })).toString("base64url") +
    ".test-fixture";
  assert.equal(isServerKey(jwt("anon")), false);
  assert.equal(isServerKey(jwt("authenticated")), false);
  assert.equal(isServerKey("sb_publishable_example"), false);
  assert.equal(isServerKey(jwt("service_role")), true);
  assert.equal(isServerKey("sb_secret_example"), true);
  assert.equal(isServerKey(""), false);
});
