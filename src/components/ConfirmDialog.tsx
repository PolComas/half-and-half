import { useEffect, useRef } from "react";
export default function ConfirmDialog({
  idea,
  onCancel,
  onConfirm,
  busy,
}: {
  idea: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => {
      if (d.open) d.close();
    };
  }, []);
  return (
    <dialog ref={ref} onCancel={onCancel} aria-labelledby="confirm-title">
      <p className="eyebrow">A little spark</p>
      <h2 id="confirm-title">Ready to share this idea?</h2>
      <p className="idea-quote">“{idea}”</p>
      <p>You can edit it until your drawing starts generating.</p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onCancel} disabled={busy}>
          Keep editing
        </button>
        <button className="button" onClick={onConfirm} disabled={busy}>
          {busy ? "Confirming…" : "Yes, confirm idea"}
        </button>
      </div>
    </dialog>
  );
}
