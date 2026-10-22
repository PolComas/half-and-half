export const IMAGE_MODEL = "gpt-image-2.5-flare-2026-09-08";
export const IMAGE_SIZE = 1024;
export const HALF_WIDTH = 512;
export const PROMPT_VERSION = "hybrid-coloring-v2";
export function getConfig() {
  const port = Number(process.env.PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error("Invalid PORT.");
  const origin = process.env.APP_ORIGIN ?? "http://localhost:5173";
  const parsed = new URL(origin);
  if (parsed.origin !== origin)
    throw new Error("APP_ORIGIN must contain only an origin.");
  return {
    port,
    origin,
    secureCookies: parsed.protocol === "https:",
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseSecret: process.env.SUPABASE_SECRET_KEY ?? "",
    openaiKey: process.env.OPENAI_API_KEY ?? "",
    billingVerified: process.env.OPENAI_BILLING_VERIFIED === "true",
    generationEnabled: process.env.OPENAI_GENERATION_ENABLED === "true",
  };
}
export type Config = ReturnType<typeof getConfig>;
