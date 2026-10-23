// Public example from a development generation; never a participant's private round.
export default function HomeArt() {
  return (
    <figure className="art-wrap hero-atelier">
      <div className="art-caption">
        <span>From two ideas</span>
        <span aria-hidden="true">↙</span>
      </div>
      <div className="example-stage">
        <div className="paper-back paper-back-one" />
        <div className="paper-back paper-back-two" />
        <div className="example-sheet">
          <div className="example-sheet-heading">
            <span>Panda</span>
            <em>&</em>
            <span>Ice dragon</span>
          </div>
          <img
            src="/half-and-half-example.png"
            width="1024"
            height="1024"
            alt="Example: a single panda and ice-dragon hybrid, ready to color"
            fetchPriority="high"
          />
          <div className="example-sheet-footer">
            <span>One unexpected creation</span>
            <span aria-hidden="true">✳</span>
          </div>
        </div>
        <span className="studio-mark" aria-hidden="true">
          made
          <br />
          <em>together.</em>
        </span>
      </div>
      <figcaption className="art-note">
        Example illustration · your own drawing starts with your ideas.
      </figcaption>
    </figure>
  );
}
