import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "./errors.js";
import { sha256 } from "./imageService.js";
export interface PrivateStorage {
  put(path: string, bytes: Buffer): Promise<void>;
  get(path: string): Promise<Buffer | null>;
}
export class SupabaseStorage implements PrivateStorage {
  constructor(private db: SupabaseClient) {}
  private bucket() {
    return this.db.storage.from("half-and-half-private");
  }
  async put(path: string, bytes: Buffer) {
    const { error } = await this.bucket().upload(path, bytes, {
      contentType: "image/png",
      upsert: false,
    });
    if (!error) return;
    const existing = await this.get(path);
    if (!existing || sha256(existing) !== sha256(bytes))
      throw new AppError(
        "storage_unavailable",
        "We couldn’t save the drawing yet.",
        503,
        true,
      );
  }
  async get(path: string) {
    const { data, error } = await this.bucket().download(path);
    if (error) {
      if (
        String((error as { statusCode?: string }).statusCode) === "404" ||
        error.message === "Object not found"
      )
        return null;
      throw new AppError(
        "storage_unavailable",
        "We couldn’t load the drawing yet.",
        503,
        true,
      );
    }
    return Buffer.from(await data.arrayBuffer());
  }
}
export const originalPath = (attemptId: string) =>
  `attempts/${attemptId}/original.png`;
export const basePath = (attemptId: string, side: "left" | "right") =>
  `bases/${attemptId}/${side}.png`;
