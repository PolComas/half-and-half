import { randomUUID } from "node:crypto";
import { AppError } from "./errors.js";
import { prepareImage } from "./imageService.js";
import { UncertainGeneration, type GeneratedImage } from "./openaiImages.js";
import type { Attempt, Gateway } from "./roomService.js";
import { originalPath, basePath, type PrivateStorage } from "./storage.js";
export class GenerationService {
  readonly executor = randomUUID();
  private active = new Set<string>();
  constructor(
    private gateway: Gateway,
    private storage: PrivateStorage,
    private generate: (ideas: Attempt["ideas"]) => Promise<GeneratedImage>,
  ) {}
  async kick(roomId?: string, recover = false) {
    const attempts = await this.gateway.attempts(roomId);
    for (const attempt of attempts) {
      if (this.active.has(attempt.id)) continue;
      if (
        attempt.state !== "reserved" &&
        attempt.state !== "uncertain" &&
        !recover
      )
        continue;
      this.active.add(attempt.id);
      void this.run(attempt, recover)
        .catch(() => {
          // Do not log provider payloads, ideas, cookies, keys or image bytes.
          console.error("generation_recovery_pending");
        })
        .finally(() => this.active.delete(attempt.id));
    }
  }
  private async run(attempt: Attempt, recover: boolean) {
    let usage: unknown = null;
    try {
      let bytes: Buffer | null;
      if (attempt.state === "reserved") {
        const claimed = await this.gateway.rpc<Attempt | null>(
          "hh_claim_attempt",
          { p_attempt_id: attempt.id, p_executor: this.executor },
        );
        if (!claimed) return;
        const result = await this.generate(claimed.ideas);
        bytes = result.bytes;
        usage = result.usage;
        await this.storage.put(originalPath(attempt.id), bytes);
      } else if (recover || attempt.state === "uncertain") {
        bytes = await this.storage.get(originalPath(attempt.id));
        if (!bytes) {
          if (attempt.state === "uncertain") return;
          throw new UncertainGeneration("No recoverable artifact.");
        }
      } else return;
      const prepared = await prepareImage(bytes);
      await this.storage.put(`bases/${attempt.id}/base.png`, prepared.base);
      await this.storage.put(basePath(attempt.id, "left"), prepared.left);
      await this.storage.put(basePath(attempt.id, "right"), prepared.right);
      await this.gateway.rpc("hh_publish_base", {
        p_attempt_id: attempt.id,
        p_manifest: {
          baseHash: prepared.baseHash,
          width: prepared.width,
          height: prepared.height,
          preprocessVersion: prepared.preprocessVersion,
        },
        p_usage: usage,
      });
    } catch (error) {
      const definitive =
        error instanceof AppError && error.code === "generation_failed";
      await this.gateway.rpc("hh_fail_attempt", {
        p_attempt_id: attempt.id,
        p_uncertain: !definitive,
        p_error_code: definitive ? "provider_rejected" : "outcome_unknown",
      });
    }
  }
}
