import { useEffect, useRef, useState } from "react";
import type { RoomView } from "../shared/contracts";
import { api, ApiError, ensureSession, loadRoom, operation } from "./lib/api";
import NewRoomDialog from "./components/NewRoomDialog";
import ResultRoom from "./components/ResultRoom";
import PaintWorkspace from "./components/PaintWorkspace";
import Atmosphere from "./components/Atmosphere";
import Home from "./components/Home";
import IdeaRoom from "./components/IdeaRoom";
import GenerationStatus from "./components/GenerationStatus";
import { useBackgroundMotion } from "./lib/useBackgroundMotion";
export default function App() {
  const motion = useBackgroundMotion();
  const [room, setRoom] = useState<RoomView | null>(null),
    [ready, setReady] = useState(false),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [showHome, setShowHome] = useState(() => location.hash === "#home");
  const [entry, setEntry] = useState<{
      room: RoomView;
      code?: string;
      operationId: string;
    } | null>(null),
    [entryError, setEntryError] = useState("");
  const identityEpoch = useRef(0);
  function goToRoom() {
    setShowHome(false);
    location.hash = "room";
  }
  useEffect(() => {
    const changed = () => setShowHome(location.hash === "#home");
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
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
      const epoch = identityEpoch.current;
      try {
        const view = await loadRoom();
        if (live && epoch === identityEpoch.current)
          setRoom((prev) =>
            !prev ||
            !view ||
            view.roomId !== prev.roomId ||
            view.version >= prev.version
              ? view
              : prev,
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
  async function enterRoom(code?: string) {
    const current = roomRef.current;
    if (current) {
      if (current.phase !== "revealed") {
        goToRoom();
        return;
      }
      setEntryError("");
      setEntry({ room: current, code, operationId: crypto.randomUUID() });
      return;
    }
    const ok = await mutate(code ? "/rooms/join" : "/rooms", "POST", {
      operationId: crypto.randomUUID(),
      ...(code ? { code } : {}),
    });
    if (ok) goToRoom();
  }
  async function confirmEntry() {
    if (!entry || busy) return;
    setBusy(true);
    setEntryError("");
    identityEpoch.current++;
    const apply = (view: RoomView) => {
      identityEpoch.current++;
      roomRef.current = view;
      setRoom(view);
      setEntry(null);
      goToRoom();
    };
    try {
      apply(
        await api<RoomView>("/rooms/restart", "POST", {
          previousRoomId: entry.room.roomId,
          operationId: entry.operationId,
          ...(entry.code ? { code: entry.code } : {}),
        }),
      );
    } catch (e) {
      try {
        const latest = await loadRoom();
        if (latest && latest.roomId !== entry.room.roomId) {
          apply(latest);
          return;
        }
      } catch {}
      setEntryError(
        e instanceof ApiError
          ? e.message
          : "We couldn’t open the new room. Your current artwork is still here. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const action = (path: string) =>
    mutate(path, "POST", operation(roomRef.current!.version));
  return (
    <div className="app-shell">
      <Atmosphere paused={motion.paused} />
      {testFixture && (
        <div className="notice" role="status">
          Test fixture — no AI was called.
        </div>
      )}
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Half and Half home">
          half <span>&</span> half<span className="brand-dot">.</span>
        </a>
        <div className="header-actions">
          {room ? (
            <div className="room-details">
              <a className="header-home" href={showHome ? "#room" : "#home"}>
                {showHome ? "Back to room" : "Home"}
              </a>
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
          <button
            className="motion-control"
            aria-label={motion.paused ? "Enable background motion" : "Pause background motion"}
            aria-pressed={!motion.paused}
            title={motion.followsSystem && motion.reduced
              ? "Your device prefers reduced motion. You can enable background motion here."
              : motion.paused ? "Enable background motion" : "Pause background motion"}
            onClick={motion.toggle}
          >
            <span aria-hidden="true">{motion.paused ? "▷" : "Ⅱ"}</span>
            <span className="motion-label">Motion {motion.paused ? "off" : "on"}</span>
          </button>
        </div>
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
      ) : !room || showHome ? (
        <Home
          ready={ready}
          busy={busy}
          room={room}
          onResume={goToRoom}
          onCreate={() => void enterRoom()}
          onJoin={(code) => void enterRoom(code)}
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
            <ResultRoom
              room={room}
              onHome={() => {
                setShowHome(true);
                location.hash = "home";
              }}
            />
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
      {entry && (
        <NewRoomDialog
          room={entry.room}
          join={!!entry.code}
          busy={busy}
          error={entryError}
          onCancel={() => setEntry(null)}
          onConfirm={() => void confirmEntry()}
        />
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
