import sharp from "sharp";
import type { RoomView } from "../shared/contracts.js";
import type { Gateway, RoomService } from "./roomService.js";
import type { PrivateStorage } from "./storage.js";
import { sha256 } from "./imageService.js";
import { AppError, assert } from "./errors.js";
interface Final {
  participantId: string;
  side: "left" | "right";
  baseId: string;
  hash: string;
  path: string;
}
interface Manifest {
  baseId: string;
  phase: string;
  resultPath: string | null;
  resultHash: string | null;
  finals: Final[];
}
export async function normalizeColors(bytes: Buffer) {
  assert(
    bytes.length <= 8 * 1024 * 1024,
    "invalid_final",
    "Please use a smaller drawing.",
    413,
  );
  try {
    const info = await sharp(bytes, {
      limitInputPixels: 512 * 1024,
      animated: true,
    }).metadata();
    assert(
      info.format === "png" &&
        info.width === 512 &&
        info.height === 1024 &&
        (info.pages ?? 1) === 1,
      "invalid_final",
      "We couldn’t read your colors. Please try again.",
    );
    return await sharp(bytes, { limitInputPixels: 512 * 1024 })
      .toColourspace("srgb")
      .ensureAlpha()
      .png({ compressionLevel: 9 })
      .toBuffer();
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(
      "invalid_final",
      "We couldn’t read your colors. Please try again.",
      400,
    );
  }
}
export async function composeResult(base: Buffer, left: Buffer, right: Buffer) {
  const { data, info } = await sharp(base)
    .toColourspace("srgb")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert(
    info.width === 1024 && info.height === 1024 && info.channels === 4,
    "invalid_base",
    "The drawing couldn’t be prepared.",
    503,
  );
  for (let i = 0; i < data.length; i += 4) {
    const black = data[i]! < 180;
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = black ? 255 : 0;
  }
  return sharp({
    create: { width: 1024, height: 1024, channels: 4, background: "white" },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: 512, top: 0 },
      {
        input: data,
        raw: { width: 1024, height: 1024, channels: 4 },
        left: 0,
        top: 0,
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
export class FinalService {
  private active = new Set<string>();
  constructor(
    private rooms: RoomService,
    private gateway: Gateway,
    private storage: PrivateStorage,
  ) {}
  private manifest(roomId: string) {
    return this.gateway.rpc<Manifest | null>("hh_final_manifest", {
      p_room_id: roomId,
    });
  }
  async finish(
    hash: string,
    input: {
      baseId: string;
      commitId: string;
      revision: number;
      bytes: Buffer;
    },
  ) {
    const view = await this.rooms.state(hash);
    assert(
      view &&
        view.baseId === input.baseId &&
        ["painting", "composing", "revealed"].includes(view.phase),
      "phase_conflict",
      "Please refresh your room before finishing.",
      409,
    );
    const colors = await normalizeColors(input.bytes),
      digest = sha256(colors);
    const path = `finals/${view.roomId}/${view.participantId}/${input.commitId}-${digest}.png`;
    if (view.finished) {
      // Let the transaction confirm identical retries; never upload a replacement final.
      return this.gateway.rpc<RoomView>("hh_commit_final", {
        p_token_hash: hash,
        p_base_id: input.baseId,
        p_commit_id: input.commitId,
        p_hash: digest,
        p_revision: input.revision,
      });
    }
    await this.storage.put(path, colors);
    const result = await this.gateway.rpc<RoomView>("hh_commit_final", {
      p_token_hash: hash,
      p_base_id: input.baseId,
      p_commit_id: input.commitId,
      p_hash: digest,
      p_revision: input.revision,
    });
    this.kick(result.roomId);
    return result;
  }
  async ownFinal(view: RoomView) {
    assert(
      view.finished,
      "drawing_unavailable",
      "Your saved half isn’t ready yet.",
      409,
    );
    const manifest = await this.manifest(view.roomId),
      final = manifest?.finals.find(
        (f) =>
          f.participantId === view.participantId &&
          f.side === view.side &&
          f.baseId === view.baseId,
      );
    assert(
      final,
      "drawing_unavailable",
      "Your saved half isn’t ready yet.",
      409,
    );
    const bytes = await this.storage.get(final.path);
    assert(
      bytes && sha256(bytes) === final.hash,
      "storage_unavailable",
      "We couldn’t load your saved half. Please try again.",
      503,
    );
    return bytes;
  }
  async result(view: RoomView) {
    assert(
      view.phase === "revealed" && view.finished && view.partnerFinished,
      "result_unavailable",
      "The full drawing will appear when you have both finished.",
      409,
    );
    const manifest = await this.manifest(view.roomId);
    assert(
      manifest?.phase === "revealed" && manifest.resultPath,
      "result_unavailable",
      "The full drawing isn’t ready yet.",
      409,
    );
    const bytes = await this.storage.get(manifest.resultPath);
    assert(
      bytes && sha256(bytes) === manifest.resultHash,
      "storage_unavailable",
      "We couldn’t load your drawing. Please try again.",
      503,
    );
    return bytes;
  }
  kick(roomId: string) {
    if (this.active.has(roomId)) return;
    this.active.add(roomId);
    void this.compose(roomId)
      .catch(() => console.error("composition_pending"))
      .finally(() => this.active.delete(roomId));
  }
  async recover() {
    for (const id of await this.gateway.rpc<string[]>(
      "hh_pending_compositions",
      {},
    ))
      this.kick(id);
  }
  async compose(roomId: string) {
    const m = await this.manifest(roomId);
    if (!m || m.phase !== "composing") return;
    const left = m.finals.find((f) => f.side === "left"),
      right = m.finals.find((f) => f.side === "right");
    assert(
      left &&
        right &&
        left.participantId !== right.participantId &&
        left.baseId === m.baseId &&
        right.baseId === m.baseId,
      "invalid_final",
      "Both halves need to be saved.",
      409,
    );
    const [base, l, r] = await Promise.all([
      this.storage.get(`bases/${m.baseId}/base.png`),
      this.storage.get(left.path),
      this.storage.get(right.path),
    ]);
    assert(
      base && l && r && sha256(l) === left.hash && sha256(r) === right.hash,
      "storage_unavailable",
      "We’re still bringing your halves together.",
      503,
    );
    const original = await this.gateway.manifest(roomId);
    assert(
      original && sha256(base) === original.base_manifest.baseHash,
      "invalid_base",
      "The drawing couldn’t be prepared.",
      503,
    );
    const result = await composeResult(base, l, r),
      path = `results/${m.baseId}/${left.hash}-${right.hash}.png`;
    await this.storage.put(path, result);
    await this.gateway.rpc("hh_publish_result", {
      p_room_id: roomId,
      p_base_id: m.baseId,
      p_left_hash: left.hash,
      p_right_hash: right.hash,
      p_result_hash: sha256(result),
    });
  }
}
