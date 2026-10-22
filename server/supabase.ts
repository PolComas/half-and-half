import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Config } from "./config.js";
export function isServerKey(key: string) {
  if (key.startsWith("sb_secret_")) return true;
  // Compatibility with legacy service keys. Supabase verifies their signature;
  // this check merely rejects public anon keys used in the wrong env field.
  try {
    return (
      JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString())
        .role === "service_role"
    );
  } catch {
    return false;
  }
}
export function createDatabase(config: Config): SupabaseClient | null {
  if (!config.supabaseUrl || !isServerKey(config.supabaseSecret)) return null;
  return createClient(config.supabaseUrl, config.supabaseSecret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
