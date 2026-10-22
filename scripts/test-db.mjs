import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const bin = execFileSync("pg_config", ["--bindir"], {
  encoding: "utf8",
}).trim();
const cluster = join(tmpdir(), "half-and-half-test-pg");
if (process.argv.includes("--stop")) {
  if (existsSync(join(cluster, "postmaster.pid")))
    execFileSync(join(bin, "pg_ctl"), ["-D", cluster, "stop", "-m", "fast"], {
      stdio: "inherit",
    });
} else {
  if (!existsSync(join(cluster, "PG_VERSION")))
    execFileSync(
      join(bin, "initdb"),
      [
        "-D",
        cluster,
        "--auth-local=trust",
        "--auth-host=trust",
        "--encoding=UTF8",
        "--no-locale",
      ],
      { stdio: "inherit" },
    );
  if (!existsSync(join(cluster, "postmaster.pid")))
    execFileSync(
      join(bin, "pg_ctl"),
      [
        "-D",
        cluster,
        "-l",
        join(cluster, "test.log"),
        "-o",
        "-p 5548 -h 127.0.0.1 -k /tmp",
        "start",
      ],
      { stdio: "inherit" },
    );
  console.log(
    "Dedicated local PostgreSQL tests use 127.0.0.1:5548. No production data is used.",
  );
}
