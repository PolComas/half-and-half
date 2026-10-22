import type { RoomView } from "../../shared/contracts";
export default function GenerationStatus({
  room,
  busy,
  onRetry,
  onEdit,
}: {
  room: RoomView;
  busy: boolean;
  onRetry: () => void;
  onEdit: () => void;
}) {
  const generating = room.phase === "generating";
  const failed = room.phase === "generation_failed";
  const uncertain = room.phase === "generation_uncertain";
  return (
    <section className="room-content generation-room">
      <div
        className={generating ? "waiting-flower rotating" : "waiting-flower"}
        aria-hidden="true"
      >
        ✳
      </div>
      <p className="eyebrow">
        {generating ? "A little imagination at work" : "A pause in the process"}
      </p>
      <h1>
        {generating ? (
          <>
            Something <em>yours,</em>
            <br />
            coming together.
          </>
        ) : (
          <>
            Let’s take
            <br />a <em>moment.</em>
          </>
        )}
      </h1>
      <p role="status" className="room-intro">
        {generating
          ? "Your drawing is being generated. Please wait."
          : uncertain
            ? "We couldn’t recover your drawing. This round can’t continue safely."
            : room.phase === "budget_blocked"
              ? "The demo has reached its drawing limit. New drawings are unavailable for now."
              : room.phase === "generation_exhausted"
                ? "There are no attempts left for this round."
                : "We couldn’t create your drawing. Try again or edit your ideas."}
      </p>
      {failed && (
        <>
          <p>{room.attemptsLeft} attempts left for this round.</p>
          <div className="dialog-actions">
            <button
              className="button"
              disabled={busy || !room.generationAvailable}
              onClick={onRetry}
            >
              Try again
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={onEdit}
            >
              Edit my idea
            </button>
          </div>
        </>
      )}
      <p className="quiet-note">
        {generating
          ? "You can refresh this page. We’ll keep your place."
          : "Your ideas and room are still saved."}
      </p>
    </section>
  );
}
