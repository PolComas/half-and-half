import { useState } from "react";
import type { RoomView } from "../../shared/contracts";
import RecentArtworks from "./RecentArtworks";
import HomeArt from "./HomeArt";
export default function Home({
  ready,
  busy,
  onCreate,
  room,
  onResume,
  onJoin,
}: {
  room: RoomView | null;
  onResume: () => void;
  ready: boolean;
  busy: boolean;
  onCreate: () => void;
  onJoin: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  const active = !!room && room.phase !== "revealed";
  return (
    <>
      <main className="home-hero">
        <section className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-flower">✳</span> A shared creative moment,
            wherever you are
          </p>
          <h1>
            Two ideas.
            <br />
            One <em>unexpected</em>
            <br />
            creation.
          </h1>
          <p className="hero-description">
            Bring an idea each. Color your own half.
            <br />
            Reveal what you made together.
          </p>
          <button
            className="button create-button"
            disabled={!ready || busy}
            onClick={onCreate}
          >
            {busy
              ? "One moment…"
              : active
                ? "Resume your room"
                : room
                  ? "Create a new room"
                  : "Create a room"}
            <span aria-hidden="true">↗</span>
          </button>
          {room?.phase === "revealed" && (
            <button className="text-button resume-artwork" onClick={onResume}>
              View current artwork →
            </button>
          )}
          <p className="no-account">Just you two. No accounts needed.</p>
          <form
            className="join-form"
            onSubmit={(e) => {
              e.preventDefault();
              onJoin(code);
            }}
          >
            <label htmlFor="room-code">Already have a room code?</label>
            <div className="join-line">
              <input
                id="room-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="ABC123"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                required
                aria-label="Room code"
              />
              <button
                disabled={!ready || busy || active || code.length !== 6}
                type="submit"
                aria-label="Join room"
              >
                Join <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
          {active && (
            <p className="setup-note">
              Your shared drawing is still in progress. Finish it together
              before starting a new room.
            </p>
          )}
          {!ready && (
            <p className="setup-note" role="status">
              We’re getting the rooms ready. Please come back shortly.
            </p>
          )}
        </section>
        <HomeArt />
      </main>
      <RecentArtworks />
      <section id="how-it-works" className="how">
        <div>
          <p className="eyebrow">A surprise you make together</p>
          <h2>
            A little less scrolling.
            <br />A little more creating.
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Bring two ideas</h3>
              <p>
                A moon and a teapot? A garden and a dragon? Anything that sparks
                your imagination.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Make your half your own</h3>
              <p>
                One shared drawing. Your own colors. Your partner’s half stays a
                surprise.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Meet in the middle</h3>
              <p>
                When you both finish, see the whole picture—and keep a little
                piece of your time together.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
}
