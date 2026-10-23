import type { CSSProperties } from "react";

// Fixed paths and timings avoid random jumps on rerender or viewport changes.
const figures = [
  [3, 76, -14, 12, 0], [94, 88, -57, -9, 1],
  [16, 96, -39, 8, 2], [81, 68, -7, -12, 3],
  [29, 108, -81, -15, 4], [68, 84, -31, 14, 0],
  [7, 102, -86, 10, 3], [90, 114, -46, -7, 2],
  [44, 92, -65, -16, 1], [59, 104, -5, 18, 4],
  [22, 80, -61, 8, 0], [76, 98, -72, -12, 2],
  [12, 110, -25, 15, 4], [86, 90, -82, -10, 1],
  [38, 118, -47, -18, 3], [65, 106, -94, 14, 0],
];
const outlines = [
  <circle cx="50" cy="50" r="31" />,
  <path d="M50 12L87 78H13ZM50 12V78" />,
  <path d="M50 9L91 50L50 91L9 50ZM9 50H91" />,
  <path d="M50 11C50 36 36 50 11 50C36 50 50 64 50 89C50 64 64 50 89 50C64 50 50 36 50 11Z" />,
  <path d="M18 69C18 44 36 25 60 25C76 25 84 37 78 49C71 65 41 78 24 68M21 39C36 29 70 44 81 65" />,
];

export default function Atmosphere({ paused = false }: { paused?: boolean }) {
  return (
    <div className="atmosphere" aria-hidden="true" data-paused={paused}>
      <div className="ambient-wash wash-one" />
      <div className="ambient-wash wash-two" />
      {figures.map(([x, duration, delay, drift, shape], i) => (
        <div
          className="ambient-figure"
          key={i}
          style={{
            left: `${x}%`,
            "--flight-duration": `${duration}s`,
            "--flight-delay": `${delay}s`,
            "--drift-x": `${drift}vw`,
            "--turn": `${i % 2 ? -110 : 140}deg`,
            animationDirection: i % 2 ? "reverse" : "normal",
          } as CSSProperties}
        >
          <svg viewBox="0 0 100 100" fill="none" focusable="false">
            {outlines[shape]}
          </svg>
        </div>
      ))}
      <svg
        className="ambient-sketch sketch-one"
        viewBox="0 0 500 850"
        fill="none"
      >
        <g className="network-cluster">
          <path d="M-30 170L110 85L215 190L88 320L-30 170M110 85L65-15M215 190L365 100L470 235L300 375L215 190M88 320L160 490L300 375M160 490L30 625L130 790M300 375L430 540L320 710L160 490" />
          <g>
            {[
              [110, 85],
              [215, 190],
              [88, 320],
              [365, 100],
              [470, 235],
              [300, 375],
              [160, 490],
              [30, 625],
              [130, 790],
              [430, 540],
              [320, 710],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3.5 : 2} />
            ))}
          </g>
        </g>
      </svg>
      <svg
        className="ambient-sketch sketch-two"
        viewBox="0 0 500 850"
        fill="none"
      >
        <g className="network-cluster">
          <path d="M530 80L380 130L275 20M380 130L240 300L415 350L530 230M240 300L100 205L15 360L170 475L240 300M415 350L340 540L170 475M340 540L470 690L320 825L210 670L340 540M170 475L80 655" />
          <g>
            {[
              [380, 130],
              [275, 20],
              [240, 300],
              [415, 350],
              [100, 205],
              [15, 360],
              [170, 475],
              [340, 540],
              [470, 690],
              [320, 825],
              [210, 670],
              [80, 655],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3.5 : 2} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
