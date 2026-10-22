import type { RoomView } from "../../shared/contracts";
export default function ResultRoom({ room }: { room: RoomView }) {
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
        src="/api/room/result"
        alt="Your complete shared artwork"
        className="result-art"
      />
      <div className="result-caption">
        <p>One drawing. Both of you.</p>
        <a
          className="button"
          href="/api/room/download"
          download="half-and-half.png"
        >
          Download your artwork ↓
        </a>
      </div>
      <p className="quiet-note">
        Your colors are saved. Come back in this browser for up to 14 days.
      </p>
    </section>
  );
}
