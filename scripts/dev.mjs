import { spawn } from "node:child_process";
const grouped = process.platform !== "win32";
const commands = [
  [
    "--env-file-if-exists=.env",
    "--import",
    "tsx",
    "--watch",
    "server/index.ts",
  ],
  ["node_modules/vite/bin/vite.js"],
];
const children = commands.map((args) =>
  spawn(process.execPath, args, { stdio: "inherit", detached: grouped }),
);
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const p of children) {
    try {
      if (grouped && p.pid) process.kill(-p.pid, "SIGTERM");
      else p.kill("SIGTERM");
    } catch {}
  }
  process.exitCode = code;
}
for (const p of children) {
  p.on("exit", (code) => stop(code ?? 0));
  p.on("error", () => stop(1));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
