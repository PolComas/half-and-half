import { getConfig } from "./config.js";
import { createDatabase } from "./supabase.js";
import { SupabaseGateway, RoomService } from "./roomService.js";
import { SupabaseStorage } from "./storage.js";
import { GenerationService } from "./generationService.js";
import { generateImage } from "./openaiImages.js";
import { createApp } from "./routes.js";
const config = getConfig();
const db = createDatabase(config);
const enabled = Boolean(
  config.openaiKey && config.billingVerified && config.generationEnabled,
);
const gateway = db ? new SupabaseGateway(db) : null;
const rooms = gateway ? new RoomService(gateway, enabled) : null;
const storage = db ? new SupabaseStorage(db) : null;
const generation =
  gateway && storage
    ? new GenerationService(
        gateway,
        storage,
        (ideas) => generateImage(config.openaiKey, ideas),
        enabled,
      )
    : null;
const app = createApp(config, rooms, storage, generation);
const server = app.listen(config.port, "127.0.0.1", () => {
  console.log(
    `Half & Half API: http://localhost:${config.port} — live generation ${enabled ? "enabled" : "disabled"}`,
  );
  void app.locals.finals
    ?.recover()
    .catch(() => console.error("composition_pending"));
  void generation
    ?.kick(undefined, true)
    .catch(() => console.error("room_connection_unavailable"));
});
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => {
    server.close();
  });
