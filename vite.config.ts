import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export const privateFileDenylist = [
  ".env", ".env.*", "*.{crt,pem,key}",
  "**/.git/**", "**/.local/**", "**/.agents/**", "**/.claude/**",
  "**/.codex/**", "**/.aws/**", "**/agent/**", "**/context/**", "**/devpost/**",
];
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist/client" },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    fs: { strict: true, deny: privateFileDenylist },
    proxy: { "/api": "http://127.0.0.1:3001" },
  },
});
