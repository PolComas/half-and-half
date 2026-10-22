import type { SupabaseClient } from "@supabase/supabase-js";
import type { RoomView } from "../shared/contracts.js";
import { AppError } from "./errors.js";
import { randomBytes } from "node:crypto";
export interface Attempt {
  id: string;
  room_id: string;
  state: string;
  ideas: { left: string; right: string };
  executor: string | null;
}
export interface Gateway {
  rpc<T>(name: string, args: Record<string, unknown>): Promise<T>;
  attempts(roomId?: string): Promise<Attempt[]>;
  manifest(
    roomId: string,
  ): Promise<{ base_id: string; base_manifest: { baseHash: string } } | null>;
}
const problems: Record<string, [string, number]> = {
  room_missing: ["Please create a room or enter your partner’s code.", 404],
  room_unavailable: ["We couldn’t find an available room with that code.", 404],
  room_full: ["This room already has two people.", 409],
  room_expired: ["This room has expired.", 410],
  version_conflict: ["The room changed. Please review it and try again.", 409],
  phase_conflict: ["The room has moved on. Please refresh its status.", 409],
  idea_confirmed: ["Choose Edit before changing your idea.", 409],
  empty_idea: ["Please write an idea before confirming.", 400],
  invalid_idea: ["Keep your idea within 300 characters.", 400],
  generation_disabled: [
    "Drawing generation isn’t available yet. Please try again later.",
    503,
  ],
};
export function databaseError(message: string): AppError {
  const p = problems[message];
  return p
    ? new AppError(message, p[0], p[1], p[1] === 409)
    : new AppError(
        "connection_unavailable",
        "We couldn’t reach your room. Please try again.",
        503,
        true,
      );
}
export class SupabaseGateway implements Gateway {
  constructor(private db: SupabaseClient) {}
  async rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.db.rpc(name, args);
    if (error) throw databaseError(error.message);
    return data as T;
  }
  async attempts(roomId?: string) {
    let query = this.db
      .from("generation_attempts")
      .select("id,room_id,state,ideas,executor")
      .in("state", ["reserved", "sending", "preparing", "uncertain"]);
    if (roomId) query = query.eq("room_id", roomId);
    const { data, error } = await query;
    if (error) throw databaseError(error.message);
    return data as Attempt[];
  }
  async manifest(roomId: string) {
    const { data, error } = await this.db
      .from("rooms")
      .select("base_id,base_manifest")
      .eq("id", roomId)
      .maybeSingle();
    if (error) throw databaseError(error.message);
    return data as {
      base_id: string;
      base_manifest: { baseHash: string };
    } | null;
  }
}
export class RoomService {
  constructor(
    public gateway: Gateway,
    public generationEnabled: boolean,
  ) {}
  async state(hash: string) {
    const view = await this.gateway.rpc<RoomView | null>("hh_state", {
      p_token_hash: hash,
    });
    return view
      ? {
          ...view,
          generationAvailable:
            view.generationAvailable && this.generationEnabled,
        }
      : null;
  }
  async command(
    hash: string,
    action: string,
    payload: Record<string, unknown>,
  ) {
    const view = await this.gateway.rpc<RoomView>("hh_room_command", {
      p_token_hash: hash,
      p_action: action,
      p_payload: payload,
      p_allow_generation: this.generationEnabled,
    });
    return {
      ...view,
      generationAvailable: view.generationAvailable && this.generationEnabled,
    };
  }
  code() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from(
      randomBytes(6),
      (b) => alphabet[b % alphabet.length],
    ).join("");
  }
}
