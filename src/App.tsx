import { useEffect, useRef, useState } from "react";
import type { RoomView } from "../shared/contracts";
import { api, ApiError, ensureSession, loadRoom, operation } from "./lib/api";
import ResultRoom from "./components/ResultRoom";
import PaintWorkspace from "./components/PaintWorkspace";
import Atmosphere from "./components/Atmosphere";
import Home from "./components/Home";
import IdeaRoom from "./components/IdeaRoom";
import GenerationStatus from "./components/GenerationStatus";
export default function App() {
  const [room, setRoom] = useState<RoomView | null>(null),
    [ready, setReady] = useState(false),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const roomRef = useRef(room);
  roomRef.current = room;
  const [copied, setCopied] = useState(false),
    [testFixture, setTestFixture] = useState(false);
  function explain(e: unknown) {
    setError(
      e instanceof ApiError
        ? e.message
        : "We couldn’t reconnect. Please try again.",
    );
  }
  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        await ensureSession();
        const health = await api<{
          roomsReady: boolean;
          testFixture?: boolean;
        }>("/health");
        if (!live) return;
        setTestFixture(health.testFixture === true);
        setReady(health.roomsReady);
        if (health.roomsReady) {
          const view = await loadRoom();
          if (live) setRoom(view);
        }
      } catch (e) {
        if (live) explain(e);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    let inFlight = false,
      live = true;
    async function refresh() {
      if (!live || inFlight || document.hidden || busy) return;
      inFlight = true;
      try {
        const view = await loadRoom();
        if (live)
          setRoom((prev) =>
            !prev || !view || view.version >= prev.version ? view : prev,
          );
      } catch (e) {
        if (live && roomRef.current) explain(e);
      } finally {
        inFlight = false;
      }
    }
    const timer = setInterval(() => void refresh(), 2000);
    const visible = () => void refresh();
    document.addEventListener("visibilitychange", visible);
    return () => {
      live = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [ready, busy]);
  async function mutate(path: string, method = "POST", body?: unknown) {
    if (busy) return false;
    setBusy(true);
    setError("");
    try {
      // A partner may have changed the shared version since the last poll.
      // Refresh before a mutation; a remaining race still yields a real 409.
      if (path.startsWith("/room/") && body && typeof body === "object") {
        const latest = await loadRoom();
        if (latest) {
          if (
            latest.idea !== roomRef.current?.idea ||
            latest.confirmed !== roomRef.current?.confirmed
          ) {
            roomRef.current = latest;
            setRoom(latest);
            throw new ApiError(
              {
                code: "version_conflict",
                message:
                  "Your idea changed. Please review it before confirming.",
                retryable: true,
              },
              409,
            );
          }
          body = { ...body, expectedVersion: latest.version };
        }
      }
      const view = await api<RoomView>(path, method, body);
      roomRef.current = view;
      setRoom(view);
      return true;
    } catch (e) {
      explain(e);
      if (e instanceof ApiError && e.status === 409) {
        try {
          const view = await loadRoom();
          roomRef.current = view;
          setRoom(view);
        } catch {}
      }
      return false;
    } finally {
      setBusy(false);
    }
  }
  const action = (path: string) =>
    mutate(path, "POST", operation(roomRef.current!.version));
  return (
    <div className="app-shell">
      <Atmosphere />
      {testFixture && (
        <div className="notice" role="status">
          Test fixture — no AI was called.
        </div>
      )}
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Half and Half home">
          half <span>&</span> half<span className="brand-dot">.</span>
        </a>
        {room ? (
          <div className="room-details">
            <span className="side-tag">Your side · {room.side}</span>
            <button
              className="code-button"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(room.code)
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => {});
              }}
              aria-label={`Copy room code ${room.code}`}
            >
              {copied ? "Copied!" : room.code}
              <span aria-hidden="true"> ⧉</span>
            </button>
          </div>
        ) : (
          <a href="#how-it-works" className="nav-link">
            How it works <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>
      {error && (
        <div className="notice" role="alert">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
      {loading ? (
        <main className="loading">
          <span className="waiting-flower rotating">✳</span>
          <p>Finding your place…</p>
        </main>
      ) : !room ? (
        <Home
          ready={ready}
          busy={busy}
          onCreate={() =>
            void mutate("/rooms", "POST", { operationId: crypto.randomUUID() })
          }
          onJoin={(code) =>
            void mutate("/rooms/join", "POST", {
              code,
              operationId: crypto.randomUUID(),
            })
          }
        />
      ) : (
        <main className="room-main">
          {["waiting_partner", "ideas"].includes(room.phase) ? (
            <IdeaRoom
              room={room}
              busy={busy}
              onSave={(text) =>
                mutate("/room/idea", "PUT", {
                  ...operation(roomRef.current!.version),
                  text,
                })
              }
              onEdit={() => void action("/room/idea/edit")}
              onConfirm={() => action("/room/idea/confirm")}
            />
          ) : ["composing", "revealed"].includes(room.phase) ? (
            <ResultRoom room={room} />
          ) : room.phase === "painting" ? (
            <PaintWorkspace
              key={room.baseId}
              room={room}
              onState={(view) => {
                roomRef.current = view;
                setRoom(view);
              }}
            />
          ) : (
            <GenerationStatus
              room={room}
              busy={busy}
              onRetry={() => void action("/room/generation/retry")}
              onEdit={() => void action("/room/idea/edit")}
            />
          )}
        </main>
      )}
      <footer className="site-footer">
        <span>A little color. A little connection.</span>
        <span>
          Made for two <span aria-hidden="true">✳</span>
        </span>
      </footer>
    </div>
  );
}
