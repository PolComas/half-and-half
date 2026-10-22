import express from "express";
import { randomUUID } from "node:crypto";
import { assert, AppError } from "./errors.js";
import { establishSession, identity } from "./session.js";
import { basePath, type PrivateStorage } from "./storage.js";
import type { RoomService } from "./roomService.js";
import type { GenerationService } from "./generationService.js";
import type { Config } from "./config.js";

export function createApp(
  config: Config,
  rooms: RoomService | null,
  storage: PrivateStorage | null,
  generation: GenerationService | null,
) {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("X-Content-Type-Options", "nosniff");
    next();
  });
  const rate = new Map<string, { since: number; count: number }>();
  app.use("/api", (req, _res, next) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      if (req.headers.origin !== config.origin)
        return next(
          new AppError(
            "origin_denied",
            "Please use the app’s original address.",
            403,
          ),
        );
      if (!req.is("application/json"))
        return next(
          new AppError("invalid_request", "Please refresh and try again.", 415),
        );
    }
    if (req.method === "POST" && ["/rooms", "/rooms/join"].includes(req.path)) {
      if (rate.size > 5000) {
        const now = Date.now();
        for (const [k, v] of rate) if (now - v.since > 60_000) rate.delete(k);
      }
      const key = `${req.ip}:${req.path}`;
      const old = rate.get(key);
      const v =
        old && Date.now() - old.since < 60_000
          ? old
          : { since: Date.now(), count: 0 };
      rate.set(key, v);
      if (++v.count > (req.path === "/rooms" ? 5 : 10))
        return next(
          new AppError(
            "too_many_requests",
            "Please wait a minute before trying again.",
            429,
            true,
          ),
        );
    }
    next();
  });
  app.use(express.json({ limit: "16kb" }));
  app.get("/api/health", (_req, res) =>
    res.json({
      roomsReady: Boolean(rooms),
      generationReady: rooms?.generationEnabled ?? false,
      testFixture: app.locals.testFixture === true,
    }),
  );
  app.post("/api/session", (req, res) => {
    establishSession(req, res, config.secureCookies);
    res.json({ ok: true });
  });
  app.use("/api", (_req, _res, next) =>
    next(
      rooms
        ? undefined
        : new AppError(
            "setup_required",
            "Room connections aren’t ready yet. Please try again later.",
            503,
            true,
          ),
    ),
  );
  app.get("/api/room", async (req, res) => {
    const view = await rooms!.state(identity(req));
    if (view) await generation?.kick(view.roomId);
    res.json(view);
  });
  app.post("/api/rooms", async (req, res) => {
    assert(
      typeof req.body?.operationId === "string",
      "invalid_request",
      "Please try creating your room again.",
    );
    const view = await rooms!.command(identity(req), "create", {
      operationId: req.body.operationId,
      code: rooms!.code(),
    });
    res.status(201).json(view);
  });
  app.post("/api/rooms/join", async (req, res) => {
    const code =
      typeof req.body?.code === "string"
        ? req.body.code.trim().toUpperCase()
        : "";
    assert(
      /^[A-HJ-NP-Z2-9]{6}$/.test(code),
      "invalid_code",
      "Enter the six-character room code.",
    );
    res.json(
      await rooms!.command(identity(req), "join", {
        code,
        operationId: req.body.operationId,
      }),
    );
  });
  for (const [path, action, method] of [
    ["/api/room/idea", "save", "put"],
    ["/api/room/idea/confirm", "confirm", "post"],
    ["/api/room/idea/edit", "edit", "post"],
    ["/api/room/generation/retry", "retry", "post"],
  ] as const) {
    app[method](path, async (req, res) => {
      const body = req.body;
      assert(
        body &&
          Number.isInteger(body.expectedVersion) &&
          typeof body.operationId === "string" &&
          /^[a-f0-9-]{36}$/i.test(body.operationId),
        "invalid_request",
        "Please refresh the room and try again.",
      );
      if (action === "save")
        assert(
          typeof body.text === "string" && [...body.text.trim()].length <= 300,
          "invalid_idea",
          "Keep your idea within 300 characters.",
        );
      const payload = {
        expectedVersion: body.expectedVersion,
        operationId: body.operationId,
        ...(action === "save" ? { text: body.text } : {}),
      };
      const view = await rooms!.command(identity(req), action, payload);
      await generation?.kick(view.roomId);
      res.json(view);
    });
  }
  app.get("/api/room/base", async (req, res) => {
    const view = await rooms!.state(identity(req));
    assert(
      view?.baseId && view.phase === "painting",
      "drawing_unavailable",
      "Your drawing isn’t ready yet.",
      409,
    );
    const bytes = await storage!.get(basePath(view.baseId, view.side));
    assert(
      bytes,
      "drawing_unavailable",
      "We couldn’t load your drawing. Please try again.",
      503,
    );
    res.type("png").send(bytes);
  });
  app.use("/api", (_req, _res, next) =>
    next(new AppError("not_found", "This action isn’t available.", 404)),
  );
  app.use(express.static("dist/client", { index: false }));
  app.get("/", (_req, res) =>
    res.sendFile("index.html", { root: "dist/client" }),
  );
  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const e =
        error instanceof AppError
          ? error
          : new AppError(
              "request_failed",
              "Something went wrong. Please try again.",
              500,
              true,
            );
      if (!(error instanceof AppError))
        console.error("request_failed", randomUUID());
      res
        .status(e.status)
        .json({ code: e.code, message: e.message, retryable: e.retryable });
    },
  );
  return app;
}
