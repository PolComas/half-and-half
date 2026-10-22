import { useEffect, useRef, useState } from "react";
import type { RoomView } from "../../shared/contracts";
import ConfirmDialog from "./ConfirmDialog";
export default function IdeaRoom({
  room,
  busy,
  onSave,
  onEdit,
  onConfirm,
}: {
  room: RoomView;
  busy: boolean;
  onSave: (text: string) => Promise<boolean>;
  onEdit: () => void;
  onConfirm: () => Promise<boolean>;
}) {
  const [text, setText] = useState(room.idea),
    [review, setReview] = useState(false);
  const localDirty = useRef(false);
  useEffect(() => {
    if (!localDirty.current || room.confirmed) {
      setText(room.idea);
      localDirty.current = false;
    }
  }, [room.idea, room.confirmed]);
  async function prepare() {
    if (!text.trim()) return;
    if (await onSave(text.trim())) {
      localDirty.current = false;
      setReview(true);
    }
  }
  return (
    <section className="room-content ideas-room">
      <p className="eyebrow">Step 01 · A spark each</p>
      <h1>
        What’s on
        <br />
        your <em>mind?</em>
      </h1>
      <p className="room-intro">
        One little idea can become something unexpected.
        <br />
        Add yours. Your partner is bringing the other half.
      </p>
      <div className="idea-form">
        <label htmlFor="idea">Your idea</label>
        <textarea
          id="idea"
          maxLength={300}
          rows={3}
          placeholder="A sleepy dragon in a flower garden…"
          value={text}
          readOnly={room.confirmed}
          disabled={busy || review}
          onChange={(e) => {
            localDirty.current = true;
            setText(e.target.value);
          }}
        />
        <div className="idea-meta">
          <span>
            {room.confirmed
              ? "✓ Your idea is confirmed"
              : "Keep it simple, or wonderfully strange."}
          </span>
          <span>{[...text].length}/300</span>
        </div>
        {room.confirmed ? (
          <button className="button secondary" disabled={busy} onClick={onEdit}>
            Edit idea
          </button>
        ) : (
          <button
            className="button"
            disabled={busy || !text.trim()}
            onClick={() => void prepare()}
          >
            {busy ? "Saving…" : "Confirm idea"}
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      <p className="partner-note" role="status">
        <span
          className={room.partnerPresent ? "status-dot present" : "status-dot"}
        />
        {!room.partnerPresent
          ? "Waiting for your partner to join."
          : room.partnerConfirmed
            ? "Your partner’s idea is ready."
            : "Your partner is thinking of an idea."}
      </p>
      {!room.generationAvailable && (
        <p className="setup-note">
          Drawing generation is unavailable right now. Your room will stay here.
        </p>
      )}
      {review && (
        <ConfirmDialog
          idea={text.trim()}
          busy={busy}
          onCancel={() => setReview(false)}
          onConfirm={() => {
            void onConfirm().then((ok) => {
              if (ok) setReview(false);
            });
          }}
        />
      )}
    </section>
  );
}
