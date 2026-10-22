import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5179",
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node --import tsx tests/support/e2e-server.ts",
    url: "http://localhost:5179/api/health",
    reuseExistingServer: false,
    timeout: 30000,
  },
  reporter: "list",
});
