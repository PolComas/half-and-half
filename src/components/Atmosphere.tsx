// Fresh SVG composition inspired by the requested slow network motion.
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="ambient-wash wash-one" />
      <div className="ambient-wash wash-two" />
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
