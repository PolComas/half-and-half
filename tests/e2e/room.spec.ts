import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
test("home, independent room sessions, shared generation and private halves", async ({
  browser,
}) => {
  test.setTimeout(180000);
  const a = await browser.newContext({ hasTouch: true }),
    b = await browser.newContext(),
    c = await browser.newContext();
  const A = await a.newPage(),
    B = await b.newPage(),
    C = await c.newPage();
  let sessionRequests = 0;
  A.on("request", (request) => {
    if (
      new URL(request.url()).pathname === "/api/session" &&
      request.method() === "POST"
    )
      sessionRequests++;
  });
  await A.goto("/");
  await expect(A.getByRole("button", { name: "Create a room" })).toBeEnabled();
  expect(sessionRequests).toBe(1);
  for (const privatePath of [
    "/.env",
    "/.local/live-a.json",
    "/context/archive/conversa-recuperada.md",
    "/devpost/learner-profile.md",
  ]) {
    const response = await a.request.get(privatePath);
    expect([403, 404]).toContain(response.status());
  }
  await mkdir(".local/screenshots", { recursive: true });
  await A.screenshot({
    path: ".local/screenshots/home-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await A.getByRole("button", { name: "Create a room" }).click();
  await expect(A.getByRole("heading", { name: /What’s on/ })).toBeVisible();
  const code = (await A.getByRole("button", {
    name: /Copy room code/,
  }).getAttribute("aria-label"))!.replace("Copy room code ", "");
  await B.goto("/");
  await B.getByLabel("Room code", { exact: true }).fill(code.toLowerCase());
  await B.getByRole("button", { name: "Join room", exact: true }).click();
  await expect(B.getByText("Your side · right")).toBeVisible();
  await C.goto("/");
  await C.getByLabel("Room code", { exact: true }).fill(code);
  await C.getByRole("button", { name: "Join room", exact: true }).click();
  await expect(C.getByRole("alert")).toContainText("two people");
  await A.getByLabel("Your idea", { exact: true }).fill("a dragon");
  await A.getByRole("button", { name: "Confirm idea", exact: true }).click();
  await A.getByRole("button", { name: "Yes, confirm idea" }).click();
  await expect(A.getByText("✓ Your idea is confirmed")).toBeVisible();
  await B.getByLabel("Your idea", { exact: true }).fill("a moon garden");
  await B.getByRole("button", { name: "Confirm idea", exact: true }).click();
  await B.getByRole("button", { name: "Yes, confirm idea" }).click();
  await A.reload();
  await expect(
    A.getByRole("heading", { name: "Here’s your half." }),
  ).toBeVisible({ timeout: 12000 });
  await expect(
    B.getByRole("heading", { name: "Here’s your half." }),
  ).toBeVisible({ timeout: 12000 });
  const stateA = await (await a.request.get("/api/room")).json(),
    stateB = await (await b.request.get("/api/room")).json();
  expect(stateA.attemptsUsed).toBe(1);
  expect(
    (await (await a.request.get("http://127.0.0.1:3188/__tests/calls")).json())
      .calls,
  ).toBe(1);
  expect(stateA.baseId).toBe(stateB.baseId);
  expect(stateA.side).toBe("left");
  expect(stateB.side).toBe("right");
  expect(stateA.ideas).toEqual({ left: "a dragon", right: "a moon garden" });
  expect(JSON.stringify(stateA)).not.toContain("token_hash");
  const left = await a.request.get("/api/room/base"),
    right = await b.request.get("/api/room/base");
  expect(left.ok()).toBeTruthy();
  expect(right.ok()).toBeTruthy();
  expect((await left.body()).equals(await right.body())).toBeFalsy();
  const altered = await a.request.get("/api/room/base?side=right");
  expect((await altered.body()).equals(await left.body())).toBeTruthy();
  expect((await c.request.get("/api/room/base")).ok()).toBeFalsy();
  expect((await a.request.get("/api/room/result")).status()).toBe(409);
  await A.screenshot({
    path: ".local/screenshots/own-half.png",
    fullPage: true,
    animations: "disabled",
  });

  // Editor operates locally: independent colors never travel to the partner.
  const canvasA = A.getByRole("img", { name: /painting canvas/ }),
    canvasB = B.getByRole("img", { name: /painting canvas/ });
  await expect(canvasA).toHaveAttribute("data-ready", "true");
  await expect(canvasB).toHaveAttribute("data-ready", "true");
  const digest = async (page: typeof A) =>
    page
      .locator("canvas")
      .evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  const untouchedB = await digest(B);
  const drawingPosts: string[] = [];
  A.on("request", (r) => {
    if (
      r.method() !== "GET" &&
      r.url().includes("/api/") &&
      !r.url().endsWith("/api/session")
    )
      drawingPosts.push(r.url());
  });
  await canvasA.click({ position: { x: 12, y: 12 } });
  await expect(
    A.getByRole("status").filter({ hasText: "Saved on this device" }),
  ).toBeVisible();
  const filledA = await digest(A);
  expect(await digest(B)).toBe(untouchedB);
  await B.getByRole("button", { name: "Blue", exact: true }).click();
  await canvasB.click({ position: { x: 12, y: 12 } });
  await expect(
    B.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  expect(await digest(B)).not.toBe(filledA);
  await A.reload();
  await expect(A.getByRole("img", { name: /painting canvas/ })).toHaveAttribute(
    "data-ready",
    "true",
  );
  expect(await digest(A)).toBe(filledA);
  await A.getByRole("button", { name: "Brush", exact: true }).click();
  await A.getByRole("button", { name: "Blue", exact: true }).click();
  const box = (await A.locator("canvas").boundingBox())!;
  await A.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
  await A.mouse.down();
  await A.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5, {
    steps: 12,
  });
  await A.mouse.up();
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  const brushed = await digest(A);
  expect(brushed).not.toBe(filledA);
  await A.reload();
  await expect(A.locator("canvas")).toHaveAttribute("data-ready", "true");
  expect(await digest(A)).toBe(brushed);
  await A.getByRole("button", { name: /Undo/ }).click();
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  expect(await digest(A)).toBe(filledA);
  await A.reload();
  await expect(A.locator("canvas")).toHaveAttribute("data-ready", "true");
  expect(await digest(A)).toBe(filledA);
  // A failed IndexedDB write must not claim saved, then retry the current revision.
  await A.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    (window as any).__writeBlocked = true;
    IDBDatabase.prototype.transaction = function (...args: any[]) {
      if ((window as any).__writeBlocked && args[1] === "readwrite")
        throw Error("Simulated storage failure");
      return original.apply(this, args as any);
    };
  });
  await A.getByRole("button", { name: "Clear colors", exact: true }).click();
  await A.getByRole("button", { name: "Yes, clear colors" }).click();
  await expect(
    A.getByText("We couldn’t save on this device.", { exact: true }),
  ).toBeVisible();
  await A.evaluate(() => {
    (window as any).__writeBlocked = false;
  });
  await A.getByRole("button", { name: "Try saving again" }).click();
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  const cleared = await digest(A);
  expect(cleared).not.toBe(filledA);
  await A.reload();
  await expect(A.locator("canvas")).toHaveAttribute("data-ready", "true");
  expect(await digest(A)).toBe(cleared);
  await A.getByRole("button", { name: /Undo/ }).click();
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  expect(await digest(A)).toBe(filledA);
  expect(drawingPosts).toEqual([]);
  for (const width of [1440, 1024, 768, 390]) {
    await A.setViewportSize({ width, height: 900 });
    expect(
      await A.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await A.screenshot({
      path: `.local/screenshots/editor-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await A.getByRole("button", { name: "Fill", exact: true }).click();
  await A.getByRole("button", { name: "Green", exact: true }).click();
  await A.locator("canvas").scrollIntoViewIfNeeded();
  const touchBox = (await A.locator("canvas").boundingBox())!;
  await A.touchscreen.tap(touchBox.x + 12, touchBox.y + 12);
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  expect((await digest(A)) === filledA).toBe(false);
  await A.getByRole("button", { name: /Undo/ }).click();
  await expect(
    A.getByText("✓ Saved on this device", { exact: true }),
  ).toBeVisible();
  expect(await digest(A)).toBe(filledA);
  await A.emulateMedia({ reducedMotion: "reduce" });
  await expect(A.locator(".sketch-one")).toHaveCSS("animation-play-state", "paused");
  // Only one active tab for this participant, and a successor reloads the saved colors.
  const twin = await a.newPage();
  await twin.goto("/");
  await expect(twin.locator("canvas")).toHaveAttribute("data-ready", "false");
  await expect(
    twin.getByText(/This half can be edited in one tab/),
  ).toBeVisible();
  await A.close();
  await expect(twin.locator("canvas")).toHaveAttribute("data-ready", "true");
  expect(await digest(twin)).toBe(filledA);

  // Local save must succeed before any upload. Upload failures keep the same frozen final.
  await twin.evaluate(() => {
    const transaction = IDBDatabase.prototype.transaction;
    (window as any).__blockFinish = true;
    IDBDatabase.prototype.transaction = function (...args: any[]) {
      if ((window as any).__blockFinish && args[1] === "readwrite")
        throw Error("Disk failure");
      return transaction.apply(this, args as any);
    };
  });
  let uploads = 0;
  const commits: string[] = [];
  twin.on("request", (r) => {
    if (r.url().endsWith("/api/room/finish")) {
      uploads++;
      commits.push(r.headers()["x-commit-id"]!);
    }
  });
  await twin.getByRole("button", { name: "I’m done →", exact: true }).click();
  await twin.getByRole("button", { name: "Yes, finish my half" }).click();
  await expect(twin.getByRole("alert")).toContainText("couldn’t finish");
  expect(uploads).toBe(0);
  expect((await (await a.request.get("/api/room")).json()).finished).toBe(
    false,
  );
  await twin.evaluate(() => {
    (window as any).__blockFinish = false;
  });
  await twin.route("**/api/room/finish", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        code: "save_failed",
        message: "Please try saving again.",
        retryable: true,
      }),
    }),
  );
  await twin.getByRole("button", { name: "Retry finishing" }).click();
  await expect(twin.getByRole("alert")).toContainText(
    "Please try saving again",
  );
  expect((await (await a.request.get("/api/room")).json()).finished).toBe(
    false,
  );
  await twin.unroute("**/api/room/finish");
  await twin.reload();
  await expect(
    twin.getByRole("button", { name: "Retry finishing" }),
  ).toBeEnabled();
  await expect(
    twin.getByRole("button", { name: "Brush", exact: true }),
  ).toBeDisabled();
  await twin.route("**/api/room/finish", async (r) => {
    await r.fetch();
    await r.abort("failed");
  });
  await twin.getByRole("button", { name: "Retry finishing" }).click();
  await expect(
    twin.getByText(/Waiting for your partner’s finishing touch/),
  ).toBeVisible();
  expect(commits.length).toBe(2);
  expect(commits[0]).toBe(commits[1]);
  expect((await a.request.get("/api/room/result")).status()).toBe(409);
  await twin.reload();
  await expect(
    twin.getByText("✓ Your half is safely saved", { exact: true }),
  ).toBeVisible();
  await expect(
    twin.getByRole("button", { name: "Brush", exact: true }),
  ).toBeDisabled();
  expect(await digest(twin)).toBe(filledA);
  await B.getByRole("button", { name: "I’m done →", exact: true }).click();
  await B.getByRole("button", { name: "Yes, finish my half" }).click();
  await expect(
    B.getByRole("heading", { name: "Better together." }),
  ).toBeVisible({ timeout: 15000 });
  await expect(
    twin.getByRole("heading", { name: "Better together." }),
  ).toBeVisible({ timeout: 15000 });
  const resultA = await a.request.get("/api/room/download"),
    resultB = await b.request.get("/api/room/download");
  expect(resultA.ok()).toBeTruthy();
  expect((await resultA.body()).equals(await resultB.body())).toBeTruthy();
  expect(resultA.headers()["content-disposition"]).toContain(
    "half-and-half.png",
  );
  expect(resultA.headers()["cache-control"]).toBe("no-store");
  expect((await c.request.get("/api/room/result")).ok()).toBeFalsy();
  expect((await c.request.get("/api/room/my-final")).ok()).toBeFalsy();
  const ownA = await a.request.get("/api/room/my-final?side=right"),
    ownB = await b.request.get("/api/room/my-final");
  expect((await ownA.body()).equals(await ownB.body())).toBeFalsy();
  await B.reload();
  await expect(
    B.getByRole("heading", { name: "Better together." }),
  ).toBeVisible();
  await B.setViewportSize({ width: 390, height: 844 });
  expect(
    await B.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await B.screenshot({
    path: ".local/screenshots/result-mobile.png",
    fullPage: true,
    animations: "disabled",
  });

  // Completed artworks remain local when the participant starts a fresh room.
  await expect(
    B.getByText("Kept with your last three drawings on this browser.", {
      exact: true,
    }),
  ).toBeVisible();
  const previousA = await (await a.request.get("/api/room")).json();
  await twin.getByRole("link", { name: "Half and Half home" }).click();
  await expect(
    twin.getByRole("button", { name: "Create a new room", exact: true }),
  ).toBeVisible();
  await twin.reload();
  await expect(
    twin.getByRole("heading", { name: "Recent on this device." }),
  ).toBeVisible();
  await expect(twin.locator(".recent-grid img")).toHaveCount(1);
  await twin.getByRole("button", { name: "View current artwork →" }).click();
  await expect(
    twin.getByRole("heading", { name: "Better together." }),
  ).toBeVisible();
  await twin.getByRole("button", { name: "Back to home →" }).click();
  // A local history write failure is visible and has an explicit download fallback.
  await twin.evaluate(async () => {
    const request = indexedDB.open("half-and-half-artworks");
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("artworks", "readwrite");
      tx.objectStore("artworks").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    const original = IDBDatabase.prototype.transaction;
    (window as any).__archiveBlocked = true;
    IDBDatabase.prototype.transaction = function (...args: any[]) {
      if (
        this.name === "half-and-half-artworks" &&
        (window as any).__archiveBlocked &&
        args[1] === "readwrite"
      )
        throw Error("Simulated local history failure");
      return original.apply(this, args as any);
    };
  });
  await twin
    .getByRole("button", { name: "Create a new room", exact: true })
    .click();
  await expect(
    twin.getByRole("button", { name: "Continue without local copy" }),
  ).toBeEnabled();
  await expect(
    twin.getByRole("link", { name: "Download current artwork ↓" }),
  ).toBeVisible();
  await twin.evaluate(() => {
    (window as any).__archiveBlocked = false;
  });
  await twin.getByRole("button", { name: "Try keeping it again" }).click();
  await expect(
    twin.getByRole("button", { name: "Yes, start new room" }),
  ).toBeEnabled();
  await twin.getByRole("button", { name: "Stay here" }).click();
  // A failed join preserves the original identity and artwork.
  await twin.getByLabel("Room code", { exact: true }).fill("ZZZZZZ");
  await twin.getByRole("button", { name: "Join room", exact: true }).click();
  await twin.getByRole("button", { name: "Yes, join new room" }).click();
  await expect(twin.getByRole("dialog").getByRole("alert")).toBeVisible();
  expect((await (await a.request.get("/api/room")).json()).roomId).toBe(
    previousA.roomId,
  );
  await twin.getByRole("button", { name: "Stay here" }).click();
  // Lose the new-room response after the cookie arrives; the state recovers that room.
  await twin.route("**/api/rooms/restart", async (route) => {
    await route.fetch();
    await route.abort("failed");
  });
  await twin
    .getByRole("button", { name: "Create a new room", exact: true })
    .click();
  await twin.getByRole("button", { name: "Yes, start new room" }).click();
  await expect(twin.getByRole("heading", { name: /What’s on/ })).toBeVisible();
  await twin.unroute("**/api/rooms/restart");
  const nextA = await (await a.request.get("/api/room")).json();
  expect(nextA.roomId).not.toBe(previousA.roomId);
  expect(nextA.participantId).not.toBe(previousA.participantId);
  expect(nextA.attemptsUsed).toBe(0);
  expect(
    (await (await a.request.get("http://127.0.0.1:3188/__tests/calls")).json())
      .calls,
  ).toBe(1);
  expect(
    (await a.request.get(`/api/room/result?base=${previousA.baseId}`)).ok(),
  ).toBe(false);
  expect((await (await b.request.get("/api/room")).json()).phase).toBe(
    "revealed",
  );
  await B.getByRole("button", { name: "Back to home →" }).click();
  await B.getByLabel("Room code", { exact: true }).fill(nextA.code);
  await B.getByRole("button", { name: "Join room", exact: true }).click();
  await B.getByRole("button", { name: "Yes, join new room" }).click();
  await expect(B.getByRole("heading", { name: /What’s on/ })).toBeVisible();
  const nextB = await (await b.request.get("/api/room")).json();
  expect(nextB.roomId).toBe(nextA.roomId);
  expect(nextB.side).toBe("right");
  await twin.getByRole("link", { name: "Half and Half home" }).click();
  await expect(
    twin.getByRole("button", { name: "Resume your room" }),
  ).toBeVisible();
  await expect(twin.locator(".recent-grid img")).toHaveCount(1);
  const localPng = await twin
    .locator(".artwork-card img")
    .evaluate(async (img) =>
      Array.from(
        new Uint8Array(
          await (await fetch((img as HTMLImageElement).src)).arrayBuffer(),
        ),
      ),
    );
  expect(Buffer.from(localPng).equals(await resultA.body())).toBe(true);
  await twin.getByRole("button", { name: "Resume your room" }).click();
  await expect(twin.getByRole("heading", { name: /What’s on/ })).toBeVisible();
  // Neither an active room nor an unconfirmed image can enter the local archive.
  const activeRestart = await a.request.post("/api/rooms/restart", {
    headers: { Origin: "http://localhost:5179" },
    data: { previousRoomId: nextA.roomId, operationId: crypto.randomUUID() },
  });
  expect(activeRestart.status()).toBe(409);
  await twin.evaluate(async () => {
    const module = await import("/src/painting/artworkStore.ts" as string);
    const png = (await module.recentArtworks())[0].png;
    for (let i = 1; i <= 4; i++)
      await module.saveArtwork({
        id: `history-${i}`,
        png,
        ideas: { left: `History ${i}`, right: "Test" },
        savedAt: Date.now() + i,
      });
    const before = await module.recentArtworks();
    await module.saveArtwork({ ...before[0], savedAt: Date.now() + 10000 });
    const after = await module.recentArtworks();
    if (
      after.length !== 3 ||
      after[0].id !== "history-4" ||
      after.some((a: any) => a.id === "history-1")
    )
      throw Error("Local history limit failed");
    let rejected = false;
    try {
      await module.archiveRoom({ phase: "painting", baseId: "unrevealed" });
    } catch {
      rejected = true;
    }
    if (!rejected) throw Error("Unrevealed archive accepted");
  });
  await twin.getByRole("link", { name: "Half and Half home" }).click();
  await twin.reload();
  await expect(twin.locator(".recent-grid img")).toHaveCount(3);
  await twin.screenshot({
    path: ".local/screenshots/home-recent.png",
    fullPage: true,
    animations: "disabled",
  });
  await a.close();
  await b.close();
  await c.close();
});
test("mobile home has working code input and no horizontal overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Create a room" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: ".local/screenshots/home-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  await context.close();
});
