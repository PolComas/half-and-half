import pg from "pg";
import { randomUUID } from "node:crypto";
import { userInfo } from "node:os";
import { readFile, readdir } from "node:fs/promises";
import {
  databaseError,
  type Attempt,
  type Gateway,
} from "../../server/roomService.js";
export async function testDatabase() {
  // Dedicated throwaway PostgreSQL cluster. Never reads .env or production URLs.
  const user = userInfo().username;
  const admin = new pg.Pool({
    host: "127.0.0.1",
    port: 5548,
    user,
    database: "postgres",
  });
  await admin.query(
    `do $$ begin create role anon; exception when duplicate_object then null; end $$; do $$ begin create role authenticated; exception when duplicate_object then null; end $$; do $$ begin create role service_role bypassrls; exception when duplicate_object then null; end $$;`,
  );
  const name = "hh_test_" + randomUUID().replaceAll("-", "");
  await admin.query(`create database "${name}"`);
  const owner = new pg.Pool({
    host: "127.0.0.1",
    port: 5548,
    user,
    database: name,
  });
  for (const file of (await readdir("supabase/migrations")).sort()) {
    if (file.endsWith(".sql") && !file.endsWith("_private_bucket.sql"))
      await owner.query(await readFile(`supabase/migrations/${file}`, "utf8"));
  }
  await owner.query("grant usage on schema public to service_role");
  const pool = new pg.Pool({
    host: "127.0.0.1",
    port: 5548,
    user,
    database: name,
    options: "-c role=service_role",
  });
  return {
    owner,
    pool,
    close: async () => {
      await pool.end();
      await owner.end();
      await admin.query(`drop database "${name}"`);
      await admin.end();
    },
  };
}
export class PgGateway implements Gateway {
  constructor(private pool: pg.Pool) {}
  async rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
    if (!/^hh_[a-z_]+$/.test(name)) throw new Error("Invalid test RPC.");
    const keys = Object.keys(args);
    const values = Object.values(args);
    try {
      const result = await this.pool.query(
        `select public.${name}(${keys.map((key, i) => `${key} => $${i + 1}`).join(",")}) as value`,
        values,
      );
      return result.rows[0]?.value as T;
    } catch (e) {
      throw databaseError((e as Error).message);
    }
  }
  async attempts(roomId?: string): Promise<Attempt[]> {
    return (
      await this.pool.query(
        `select id,room_id,state,ideas,executor from public.generation_attempts where state in ('reserved','sending','preparing','uncertain')${roomId ? " and room_id=$1" : ""}`,
        roomId ? [roomId] : [],
      )
    ).rows;
  }
  async manifest(roomId: string) {
    return (
      (
        await this.pool.query(
          "select base_id,base_manifest from public.rooms where id=$1",
          [roomId],
        )
      ).rows[0] ?? null
    );
  }
}
