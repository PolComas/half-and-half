import { createHash, createHmac, randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { AppError } from "./errors.js";
export const COOKIE_NAME = "hh_session";
export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export function readToken(req: Request): string | null {
  const value = req.headers.cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
export function establishSession(req: Request, res: Response, secure: boolean) {
  const token = readToken(req) ?? randomBytes(32).toString("hex");
  setSession(res, token, secure);
}
export function replacementToken(previous: string, operationId: string) {
  return createHmac("sha256", previous)
    .update(`half-and-half:new-room:${operationId}`)
    .digest("hex");
}
export function setSession(res: Response, token: string, secure: boolean) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 14 * 86400_000,
  });
}
export function identity(req: Request) {
  const token = readToken(req);
  if (!token)
    throw new AppError(
      "session_missing",
      "Please refresh the page to reconnect.",
      401,
    );
  return tokenHash(token);
}
