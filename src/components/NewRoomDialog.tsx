import { useEffect, useRef, useState } from "react";
import type { RoomView } from "../../shared/contracts";
import { archiveRoom } from "../painting/artworkStore";
export default function NewRoomDialog({
  room,
  join,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  room: RoomView;
  join: boolean;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    [status, setStatus] = useState<"saving" | "saved" | "error">("saving"),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  useEffect(() => {
    let live = true;
    setStatus("saving");
    void archiveRoom(room).then(
      () => {
        if (live) setStatus("saved");
      },
      () => {
        if (live) setStatus("error");
      },
    );
    return () => {
      live = false;
    };
  }, [room.baseId, attempt]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        if (busy) e.preventDefault();
        else onCancel();
      }}
      aria-labelledby="new-room-title"
    >
      <p className="eyebrow">Another little adventure</p>
      <h2 id="new-room-title">
        {join ? "Join a new room?" : "Start a new room?"}
      </h2>
      <p>You’ll leave this room behind. Your partner keeps their own access.</p>
      <p role="status">
        {status === "saving"
          ? "Keeping your finished drawing…"
          : status === "saved"
            ? "Your finished PNG is kept with your last three drawings in this browser."
            : "We couldn’t keep a local copy. Download your PNG before continuing."}
      </p>
      {status === "error" && (
        <div className="dialog-save-options">
          <a
            href={`/api/room/download?base=${room.baseId}`}
            download="half-and-half.png"
          >
            Download current artwork ↓
          </a>
          <button
            className="text-button"
            onClick={() => setAttempt((x) => x + 1)}
          >
            Try keeping it again
          </button>
        </div>
      )}
      <p className="quiet-note">
        Local drawings stay on this browser. Clearing browser data removes them.
      </p>
      {error && (
        <p role="alert" className="finish-error">
          {error}
        </p>
      )}
      <div className="dialog-actions">
        <button className="button secondary" onClick={onCancel} disabled={busy}>
          Stay here
        </button>
        <button
          className="button"
          onClick={onConfirm}
          disabled={busy || status === "saving"}
        >
          {busy
            ? "One moment…"
            : status === "error"
              ? "Continue without local copy"
              : join
                ? "Yes, join new room"
                : "Yes, start new room"}
        </button>
      </div>
    </dialog>
  );
}
