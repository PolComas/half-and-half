import type { Problem, RoomView } from "../../shared/contracts";
export class ApiError extends Error {
  constructor(
    public problem: Problem,
    public status: number,
  ) {
    super(problem.message);
  }
}
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    ...(method !== "GET"
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body ?? {}),
        }
      : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data as Problem, response.status);
  return data as T;
}
export const loadRoom = () => api<RoomView | null>("/room");
let sessionSetup: Promise<unknown> | null = null;
export function ensureSession() {
  // StrictMode may mount effects twice in development. Establish a new cookie
  // once so two concurrent responses cannot replace a fresh participant token.
  sessionSetup ??= api("/session", "POST").catch((error) => {
    sessionSetup = null;
    throw error;
  });
  return sessionSetup;
}
export const operation = (version: number) => ({
  expectedVersion: version,
  operationId: crypto.randomUUID(),
});
