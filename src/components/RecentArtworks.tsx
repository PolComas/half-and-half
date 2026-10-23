import { useEffect, useState } from "react";
import { recentArtworks, type Artwork } from "../painting/artworkStore";
export default function RecentArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]),
    [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    const refresh = () => {
      void recentArtworks().then(
        (items) => {
          if (live) {
            setArtworks(items);
            setError(false);
          }
        },
        () => {
          if (live) setError(true);
        },
      );
    };
    refresh();
    window.addEventListener("hh-artworks-changed", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      live = false;
      window.removeEventListener("hh-artworks-changed", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  if (!artworks.length && !error) return null;
  return (
    <section className="recent-artworks" aria-labelledby="recent-title">
      <div className="recent-heading">
        <div>
          <p className="eyebrow">Little moments worth keeping</p>
          <h2 id="recent-title">
            Recent on <em>this device.</em>
          </h2>
        </div>
        <p>
          Your last three finished drawings.
          <br />
          Stored in this browser only.
        </p>
      </div>
      {error ? (
        <p role="status">
          We couldn’t open your local drawings. Your current room is still
          available.
        </p>
      ) : (
        <div className="recent-grid">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </section>
  );
}
function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const local = URL.createObjectURL(artwork.png);
    setUrl(local);
    return () => URL.revokeObjectURL(local);
  }, [artwork.png]);
  return (
    <article className="artwork-card">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`View drawing: ${artwork.ideas.left} and ${artwork.ideas.right}`}
        >
          <img
            src={url}
            alt={`${artwork.ideas.left} combined with ${artwork.ideas.right}`}
          />
        </a>
      )}
      <div className="artwork-caption">
        <p>
          {artwork.ideas.left} <em>&</em> {artwork.ideas.right}
        </p>
        <a
          href={url || undefined}
          download="half-and-half.png"
          aria-label={`Download drawing: ${artwork.ideas.left} and ${artwork.ideas.right}`}
        >
          Download ↓
        </a>
      </div>
    </article>
  );
}
