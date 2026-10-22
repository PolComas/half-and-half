import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { RoomView } from "../../shared/contracts";
import { PaintingModel, initialSettings } from "../painting/model";
import type { Settings } from "../painting/model";
import { loadRoom, ApiError } from "../lib/api";
import { readDraft, writeDraft, DraftSaver } from "../painting/draftStore";
const colors = [
  "#E45756",
  "#F28E2B",
  "#EDC948",
  "#59A14F",
  "#76B7B2",
  "#4E79A7",
  "#7B61A8",
  "#B07AA1",
  "#FF9DA7",
  "#9C755F",
  "#FFFFFF",
  "#333333",
];
const names = [
  "Coral",
  "Orange",
  "Yellow",
  "Green",
  "Teal",
  "Blue",
  "Purple",
  "Mauve",
  "Pink",
  "Brown",
  "White",
  "Charcoal",
];
export default function PaintWorkspace({
  room,
  onState,
}: {
  room: RoomView;
  onState: (view: RoomView) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    model = useRef<PaintingModel | null>(null),
    saver = useRef<DraftSaver | null>(null);
  const revision = useRef(0),
    settingsRef = useRef<Settings>({ ...initialSettings });
  const commitId = useRef<string | undefined>(undefined),
    finalRevision = useRef<number | undefined>(undefined),
    finishing = useRef(false),
    pendingRef = useRef(false);
  const [pending, setPending] = useState(false),
    [finishSending, setFinishSending] = useState(false),
    [finishConfirm, setFinishConfirm] = useState(false),
    [finishError, setFinishError] = useState("");
  const [settings, setSettings] = useState<Settings>({ ...initialSettings }),
    [ready, setReady] = useState(false),
    [hasUndo, setHasUndo] = useState(false);
  const [message, setMessage] = useState("Opening your colors…"),
    [saveState, setSaveState] = useState("saving"),
    [clear, setClear] = useState(false);
  const key = [room.roomId, room.participantId, room.baseId, room.side].join(
    ":",
  );
  const gesture = useRef<{
    id: number;
    point: { x: number; y: number };
    lastCheckpoint: number;
  } | null>(null);
  function render() {
    const m = model.current,
      ctx = canvas.current?.getContext("2d");
    if (m && ctx) {
      ctx.putImageData(new ImageData(m.composite(), m.width, m.height), 0, 0);
      setHasUndo(!!m.undo);
    }
  }
  function save() {
    const m = model.current;
    if (!m || !saver.current) return Promise.resolve();
    return saver.current.save({
      key,
      revision: ++revision.current,
      pixels: m.pixels.slice(),
      undo: m.undo?.slice() ?? null,
      settings: { ...settingsRef.current },
      commitId: commitId.current,
      finalRevision: finalRevision.current,
    });
  }
  function saveQuietly() {
    void save().catch(() => {});
  }
  useEffect(() => {
    let live = true,
      release: (() => void) | undefined;
    const abort = new AbortController();
    setReady(false);
    setMessage(
      room.finished
        ? "Loading your saved half…"
        : "This half can be edited in one tab. Close another tab if it is open.",
    );
    async function initialize() {
      if (!live) return;
      try {
        const response = await fetch(
          `/api/room/base?base=${encodeURIComponent(room.baseId!)}`,
          { cache: "no-store", signal: abort.signal },
        );
        if (!response.ok) throw Error("base");
        const bitmap = await createImageBitmap(await response.blob()),
          surface = document.createElement("canvas");
        surface.width = 512;
        surface.height = 1024;
        const ctx = surface.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const data = ctx.getImageData(0, 0, 512, 1024).data,
          white = new Uint8Array(512 * 1024);
        for (let i = 0; i < white.length; i++)
          white[i] = data[i * 4]! > 180 ? 1 : 0;
        const m = new PaintingModel(white, 512, 1024);
        if (room.finished) {
          const final = await fetch("/api/room/my-final", {
            cache: "no-store",
            signal: abort.signal,
          });
          if (!final.ok) throw Error("final");
          const image = await createImageBitmap(await final.blob());
          ctx.clearRect(0, 0, 512, 1024);
          ctx.drawImage(image, 0, 0);
          image.close();
          m.pixels = ctx.getImageData(0, 0, 512, 1024).data;
          if (!live) return;
          model.current = m;
          render();
          setMessage("✓ Your half is safely saved");
          setSaveState("saved");
          setPending(false);
          return;
        }
        const draft = await readDraft(key);
        if (!live) return;
        if (
          draft &&
          draft.pixels.length === m.pixels.length &&
          (!draft.undo || draft.undo.length === m.pixels.length)
        ) {
          m.pixels = new Uint8ClampedArray(draft.pixels);
          m.undo = draft.undo ? new Uint8ClampedArray(draft.undo) : null;
          revision.current = draft.revision;
          settingsRef.current = { ...initialSettings, ...draft.settings };
          setSettings(settingsRef.current);
          commitId.current = draft.commitId;
          finalRevision.current = draft.finalRevision;
        }
        model.current = m;
        saver.current = new DraftSaver(writeDraft, (state) => {
          if (live) setSaveState(state);
        });
        render();
        pendingRef.current = !!commitId.current;
        setPending(pendingRef.current);
        setReady(!pendingRef.current);
        setMessage(
          pendingRef.current
            ? "Your colors are frozen. Retry finishing to save this half."
            : "",
        );
        if (draft) setSaveState("saved");
        else saveQuietly();
        await new Promise<void>((resolve) => {
          release = resolve;
          if (!live) resolve();
        });
        await saver.current?.flush().catch(() => {});
      } catch {
        if (live) {
          setReady(false);
          setMessage(
            room.finished
              ? "We couldn’t load your saved half. Please reload to try again."
              : "We couldn’t open your saved drawing. Check this browser allows storage, then reload.",
          );
        }
      }
    }
    if (room.finished) void initialize();
    else if (navigator.locks)
      void navigator.locks
        .request(`hh-editor:${key}`, { signal: abort.signal }, initialize)
        .catch(() => {});
    else
      setMessage(
        "Please open this drawing in a recent Chrome, Firefox or Safari browser to save your colors safely.",
      );
    return () => {
      live = false;
      gesture.current = null;
      abort.abort();
      release?.();
    };
  }, [key, room.finished]);
  async function finishNow() {
    if (finishing.current || room.finished || !model.current || gesture.current)
      return;
    finishing.current = true;
    pendingRef.current = true;
    setPending(true);
    setReady(false);
    setFinishSending(true);
    setFinishConfirm(false);
    setFinishError("");
    setMessage("");
    if (!commitId.current) {
      commitId.current = crypto.randomUUID();
      finalRevision.current = revision.current + 1;
    }
    try {
      await save();
      const surface = document.createElement("canvas");
      surface.width = 512;
      surface.height = 1024;
      surface
        .getContext("2d")!
        .putImageData(
          new ImageData(model.current.pixels.slice(), 512, 1024),
          0,
          0,
        );
      const blob = await new Promise<Blob>((resolve, reject) =>
        surface.toBlob(
          (b) => (b ? resolve(b) : reject(Error("png"))),
          "image/png",
        ),
      );
      const response = await fetch("/api/room/finish", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "image/png",
          "X-Base-Id": room.baseId!,
          "X-Commit-Id": commitId.current!,
          "X-Revision": String(finalRevision.current),
        },
        body: blob,
      });
      const state = await response.json();
      if (!response.ok) throw new ApiError(state, response.status);
      onState(state as RoomView);
    } catch (e) {
      try {
        const latest = await loadRoom();
        if (latest?.finished) {
          onState(latest);
          return;
        }
      } catch {}
      setFinishError(
        e instanceof ApiError
          ? e.message
          : "We couldn’t finish yet. Your colors are still here. Please try again.",
      );
    } finally {
      finishing.current = false;
      setFinishSending(false);
    }
  }
  function updateSettings(next: Partial<Settings>) {
    if (!ready) return;
    settingsRef.current = { ...settingsRef.current, ...next };
    setSettings(settingsRef.current);
    saveQuietly();
  }
  function point(event: PointerEvent<HTMLCanvasElement>) {
    const r = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) * 512) / r.width,
      y: ((event.clientY - r.top) * 1024) / r.height,
    };
  }
  function down(event: PointerEvent<HTMLCanvasElement>) {
    if (
      !ready ||
      pendingRef.current ||
      room.finished ||
      gesture.current ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    const p = point(event),
      m = model.current!;
    if (settingsRef.current.tool === "bucket") {
      if (m.fill(p.x, p.y, settingsRef.current.color)) {
        render();
        saveQuietly();
      }
      return;
    }
    m.begin();
    m.stroke(p, p, settingsRef.current.width, settingsRef.current.color);
    render();
    gesture.current = {
      id: event.pointerId,
      point: p,
      lastCheckpoint: Date.now(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const p = point(event);
    model.current!.stroke(
      g.point,
      p,
      settingsRef.current.width,
      settingsRef.current.color,
    );
    g.point = p;
    render();
    if (Date.now() - g.lastCheckpoint >= 1000) {
      g.lastCheckpoint = Date.now();
      saveQuietly();
    }
  }
  function end(event: PointerEvent<HTMLCanvasElement>) {
    if (gesture.current?.id === event.pointerId) {
      gesture.current = null;
      saveQuietly();
    }
  }
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        gesture.current &&
        Date.now() - gesture.current.lastCheckpoint >= 1000
      ) {
        gesture.current.lastCheckpoint = Date.now();
        saveQuietly();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [key]);
  return (
    <section className="painting-room">
      <div className="paint-heading">
        <p className="eyebrow">Two ideas, one drawing</p>
        <h1>
          Here’s your <em>half.</em>
        </h1>
        <div className="shared-ideas">
          <p>
            <span>Left idea</span>
            {room.ideas?.left}
          </p>
          <span aria-hidden="true">&</span>
          <p>
            <span>Right idea</span>
            {room.ideas?.right}
          </p>
        </div>
      </div>
      <div className="paint-layout">
        <div className="canvas-column">
          <div className="canvas-paper">
            <canvas
              ref={canvas}
              width={512}
              height={1024}
              aria-label={`Your ${room.side} half — painting canvas`}
              role="img"
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
              onLostPointerCapture={end}
              data-ready={ready}
            />
          </div>
          <p className="quiet-note">Your partner’s half stays a surprise.</p>
        </div>
        <aside className="paint-tools" aria-label="Painting tools">
          <p className="eyebrow">Make it yours</p>
          <fieldset disabled={!ready}>
            <legend>01 · Your tools</legend>
            <div className="tool-switch">
              <button
                aria-pressed={settings.tool === "bucket"}
                onClick={() => updateSettings({ tool: "bucket" })}
              >
                <span aria-hidden="true">◩</span> Fill
              </button>
              <button
                aria-pressed={settings.tool === "brush"}
                onClick={() => updateSettings({ tool: "brush" })}
              >
                <span aria-hidden="true">╱</span> Brush
              </button>
            </div>
            <p className="tool-hint">
              {settings.tool === "bucket"
                ? "Tap a space. Gaps may join areas; Undo or brush to correct."
                : "Draw freely. The lines stay on top."}
            </p>
          </fieldset>
          <fieldset disabled={!ready}>
            <legend>02 · A little color</legend>
            <div className="swatches">
              {colors.map((color, i) => (
                <button
                  key={color}
                  aria-label={names[i]}
                  aria-pressed={settings.color.toUpperCase() === color}
                  style={{ background: color }}
                  onClick={() => updateSettings({ color })}
                />
              ))}
            </div>
            <label className="custom-color">
              <span className="color-wheel">
                <input
                  aria-label="Custom color"
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSettings({ color: e.target.value })}
                />
              </span>
              <span>
                Find your own shade{" "}
                <small>{settings.color.toUpperCase()}</small>
              </span>
            </label>
          </fieldset>
          <fieldset disabled={!ready || settings.tool !== "brush"}>
            <legend>03 · Brush size</legend>
            <label className="brush-size">
              <span className="brush-preview">
                <span
                  style={{
                    width: settings.width,
                    height: settings.width,
                    background: settings.color,
                  }}
                />
              </span>
              <input
                aria-label="Brush size"
                type="range"
                min="2"
                max="48"
                value={settings.width}
                onChange={(e) =>
                  updateSettings({ width: Number(e.target.value) })
                }
              />
              <output>{settings.width}</output>
            </label>
          </fieldset>
          <div className="paint-actions">
            <button
              className="text-button"
              disabled={!ready || !hasUndo}
              onClick={() => {
                model.current!.undoAction();
                render();
                saveQuietly();
              }}
            >
              ↶ Undo
            </button>
            <button
              className="text-button"
              disabled={!ready}
              onClick={() => setClear(true)}
            >
              Clear colors
            </button>
          </div>
          <div className={`save-status ${saveState}`} role="status">
            {message ||
              (saveState === "saved"
                ? "✓ Saved on this device"
                : saveState === "error"
                  ? "We couldn’t save on this device."
                  : "Saving…")}
          </div>
          {saveState === "error" && (
            <button className="text-button" onClick={saveQuietly}>
              Try saving again
            </button>
          )}
          {room.finished ? (
            <p className="waiting-partner" role="status">
              Your part is done.
              <br />
              Waiting for your partner’s finishing touch…
            </p>
          ) : (
            <>
              <p className="storage-note">
                Colors stay in this browser until you finish. Wait for “Saved”
                before closing.
              </p>
              {finishError && (
                <p className="finish-error" role="alert">
                  {finishError}
                </p>
              )}
              <button
                className="button finish-button"
                disabled={finishSending || (!ready && !pending)}
                onClick={() =>
                  pending ? void finishNow() : setFinishConfirm(true)
                }
              >
                {finishSending
                  ? "Saving your half…"
                  : pending
                    ? "Retry finishing"
                    : "I’m done →"}
              </button>
              <p className="storage-note">
                Finish when you’re happy. Your colors become final.
              </p>
            </>
          )}
        </aside>
      </div>
      {finishConfirm && (
        <FinishDialog
          onCancel={() => setFinishConfirm(false)}
          onConfirm={() => void finishNow()}
        />
      )}
      {clear && (
        <ClearDialog
          onCancel={() => setClear(false)}
          onConfirm={() => {
            model.current!.clear();
            render();
            saveQuietly();
            setClear(false);
          }}
        />
      )}
    </section>
  );
}
function ClearDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog ref={ref} onCancel={onCancel} aria-labelledby="clear-title">
      <p className="eyebrow">A fresh start</p>
      <h2 id="clear-title">Clear your colors?</h2>
      <p>The drawing stays. You can undo this once.</p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onCancel}>
          Keep painting
        </button>
        <button className="button" onClick={onConfirm}>
          Yes, clear colors
        </button>
      </div>
    </dialog>
  );
}

function FinishDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog ref={ref} onCancel={onCancel} aria-labelledby="finish-title">
      <p className="eyebrow">Your finishing touch</p>
      <h2 id="finish-title">Finished with your half?</h2>
      <p>
        Once saved, your colors are final. You’ll see the full drawing when
        you’ve both finished.
      </p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onCancel}>
          Keep painting
        </button>
        <button className="button" onClick={onConfirm}>
          Yes, finish my half
        </button>
      </div>
    </dialog>
  );
}
