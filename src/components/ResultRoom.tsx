import { useEffect, useState } from "react";
import { archiveRoom } from "../painting/artworkStore";
import type { RoomView } from "../../shared/contracts";
export default function ResultRoom({
  room,
  onHome,
}: {
  room: RoomView;
  onHome: () => void;
}) {
  const [stored, setStored] = useState<"saving" | "saved" | "error">("saving"),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (room.phase !== "revealed") return;
    let live = true;
    setStored("saving");
    void archiveRoom(room).then(
      () => {
        if (live) setStored("saved");
      },
      () => {
        if (live) setStored("error");
      },
    );
    return () => {
      live = false;
    };
  }, [room.phase, room.baseId, retry]);
  if (room.phase === "composing")
    return (
      <section className="room-content generation-room" role="status">
        <div className="waiting-flower turn" aria-hidden="true">
          ✳
        </div>
        <p className="eyebrow">Both halves are saved</p>
        <h1>
          One last <em>little moment.</em>
        </h1>
        <p>We’re bringing your colors together. You can safely reload.</p>
      </section>
    );
  return (
    <section className="result-room">
      <p className="eyebrow">Two imaginations, one of a kind</p>
      <h1>
        Better <em>together.</em>
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
      <img
        src={`/api/room/result?base=${room.baseId}`}
        alt="Your complete shared artwork"
        className="result-art"
      />
      <div className="result-caption">
        <p>One drawing. Both of you.</p>
        <a
          className="button"
          href={`/api/room/download?base=${room.baseId}`}
          download="half-and-half.png"
        >
          Download your artwork ↓
        </a>
      </div>
      <p className="quiet-note" role="status">
        {stored === "saved"
          ? "Kept with your last three drawings on this browser."
          : stored === "saving"
            ? "Keeping a local copy of your finished drawing…"
            : "We couldn’t keep a local copy. You can still download the PNG."}
      </p>
      {stored === "error" && (
        <button className="text-button" onClick={() => setRetry((x) => x + 1)}>
          Try keeping it again
        </button>
      )}
      <button className="button secondary back-home" onClick={onHome}>
        Back to home →
      </button>
    </section>
  );
}
