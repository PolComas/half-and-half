import { createServer } from "vite";
import { testDatabase, PgGateway } from "./database.js";
import { fixtureImage, TestStorage } from "./fixture.js";
import { getConfig } from "../../server/config.js";
import { RoomService } from "../../server/roomService.js";
import { GenerationService } from "../../server/generationService.js";
import { createApp } from "../../server/routes.js";
import { privateFileDenylist } from "../../vite.config.ts";
// Isolated test server: no .env, no Supabase cloud, no OpenAI calls.
const db = await testDatabase();
const gateway = new PgGateway(db.pool);
const rooms = new RoomService(gateway, true);
const storage = new TestStorage();
let calls = 0;
const generation = new GenerationService(gateway, storage, async () => {
  calls++;
  await new Promise((r) => setTimeout(r, 1200));
  return {
    bytes: await fixtureImage(),
    usage: null,
    promptVersion: "test-fixture",
  };
});
const app = createApp(
  { ...getConfig(), port: 3188, origin: "http://localhost:5179" },
  rooms,
  storage,
  generation,
);
app.locals.testFixture = true;
app.get("/__tests/calls", (_req, res) => res.json({ calls }));
const server = app.listen(3188, "127.0.0.1");
const vite = await createServer({
  configFile: false,
  root: process.cwd(),
  server: {
    host: "127.0.0.1",
    port: 5179,
    strictPort: true,
    fs: { strict: true, deny: privateFileDenylist },
    proxy: { "/api": "http://127.0.0.1:3188" },
  },
  plugins: [(await import("@vitejs/plugin-react")).default()],
});
await vite.listen();
console.log("TEST FIXTURE SERVER ready — no live AI or production database.");
async function shutdown() {
  await vite.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await db.close();
  process.exit(0);
}
process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());
