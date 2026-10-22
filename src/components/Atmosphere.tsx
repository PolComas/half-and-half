export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <svg
        className="ambient-sketch sketch-one"
        viewBox="0 0 400 600"
        fill="none"
      >
        <path d="M-80 530C240 570 330 260 105 220S70 10 305-30" />
        <path d="M-60 552C260 592 350 282 125 242S90 32 325-8" />
        <ellipse
          cx="89"
          cy="141"
          rx="68"
          ry="110"
          transform="rotate(-30 89 141)"
        />
      </svg>
      <svg
        className="ambient-sketch sketch-two"
        viewBox="0 0 400 600"
        fill="none"
      >
        <path d="M400 65C60-30 30 290 242 255S440 540 90 640" />
        <path d="M414 83C74-12 44 308 256 273S454 558 104 658" />
        <path d="M280 350L298 390L340 400L300 418L289 460L271 420L230 408L270 390Z" />
        <circle cx="80" cy="185" r="12" />
      </svg>
    </div>
  );
}
