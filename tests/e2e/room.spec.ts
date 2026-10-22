import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
test("home, independent room sessions, shared generation and private halves", async ({
  browser,
}) => {
  const a = await browser.newContext(),
    b = await browser.newContext(),
    c = await browser.newContext();
  const A = await a.newPage(),
    B = await b.newPage(),
    C = await c.newPage();
  let sessionRequests = 0;
  A.on("request", request => {
    if (new URL(request.url()).pathname === "/api/session" && request.method() === "POST") sessionRequests++;
  });
  await A.goto("/");
  await expect(A.getByRole("button", { name: "Create a room" })).toBeEnabled();
  expect(sessionRequests).toBe(1);
  for (const privatePath of ["/.env", "/.local/live-a.json", "/context/archive/conversa-recuperada.md", "/devpost/learner-profile.md"]) {
    const response = await a.request.get(privatePath);
    expect([403,404]).toContain(response.status());
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
  expect((await a.request.get("/api/room/result")).status()).toBe(404);
  await A.screenshot({
    path: ".local/screenshots/own-half.png",
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
