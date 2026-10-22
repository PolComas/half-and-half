import { getConfig, IMAGE_MODEL } from "../server/config.js";
import { createDatabase, isServerKey } from "../server/supabase.js";
const c = getConfig();
console.log("Supabase URL:", Boolean(c.supabaseUrl));
console.log(
  "Supabase server secret:",
  isServerKey(c.supabaseSecret)
    ? "configured (not displayed)"
    : "missing or wrong key type",
);
console.log(
  "OpenAI key:",
  c.openaiKey ? "configured (not displayed)" : "missing",
);
console.log(
  "Billing verified:",
  c.billingVerified,
  "Live generation enabled:",
  c.generationEnabled,
);
console.log("Planned model:", IMAGE_MODEL);
const db = createDatabase(c);
if (db) {
  const { error } = await db.rpc("hh_state", { p_token_hash: "0".repeat(64) });
  console.log("Database function connection:", error ? "not ready" : "ready");
}
console.log(
  "No OpenAI request was made. Balance, recharge and provider hard limit require verification in your account.",
);
