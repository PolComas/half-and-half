import { useState } from "react";
import HomeArt from "./HomeArt";
export default function Home({
  ready,
  busy,
  onCreate,
  onJoin,
}: {
  ready: boolean;
  busy: boolean;
  onCreate: () => void;
  onJoin: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  return (
    <>
      <main className="home-hero">
        <section className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-flower">✳</span> A creative little date,
            wherever you are
          </p>
          <h1>
            Two imaginations.
            <br />
            One <em>happy little</em>
            <br />
            masterpiece.
          </h1>
          <p className="hero-description">
            Bring an idea each. Color your own half.
            <br />
            Discover what you made together.
          </p>
          <button
            className="button create-button"
            disabled={!ready || busy}
            onClick={onCreate}
          >
            {busy ? "One moment…" : "Create a room"}
            <span aria-hidden="true">↗</span>
          </button>
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
                disabled={!ready || busy || code.length !== 6}
                type="submit"
                aria-label="Join room"
              >
                Join <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
          {!ready && (
            <p className="setup-note" role="status">
              We’re getting the rooms ready. Please come back shortly.
            </p>
          )}
        </section>
        <HomeArt />
      </main>
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
