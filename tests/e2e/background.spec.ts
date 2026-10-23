import { test, expect } from "@playwright/test";

test("background crosses screen, pauses with keyboard and respects reduced motion", async ({ page }) => {
  await page.goto("/");
  const figures = page.locator(".ambient-figure");
  await expect(figures).toHaveCount(16);
  expect(await page.locator(".atmosphere").getAttribute("aria-hidden")).toBe("true");
  expect(await page.locator(".atmosphere").evaluate(el => getComputedStyle(el).pointerEvents)).toBe("none");

  // Inspect one full cycle deterministically: its discontinuity is off screen.
  const trajectory = await figures.first().evaluate(el => {
    const animation = el.getAnimations()[0];
    animation.pause();
    const timing = animation.effect!.getTiming();
    const duration = Number(timing.duration);
    animation.effect!.updateTiming({ delay: 0 });
    const sample = (progress: number) => {
      animation.currentTime = duration * progress;
      const rect = el.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    };
    const entry = sample(0.001), middle = sample(0.5), exit = sample(0.999);
    animation.play();
    return { entry, middle, exit, height: innerHeight };
  });
  expect(trajectory.entry.bottom).toBeLessThan(0);
  expect(trajectory.middle.top).toBeGreaterThan(0);
  expect(trajectory.middle.top).toBeLessThan(trajectory.height);
  expect(trajectory.exit.top).toBeGreaterThan(trajectory.height);

  const pause = page.getByRole("button", { name: "Pause background motion", exact: true });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Resume background motion" })).toHaveAttribute("aria-pressed", "true");
  expect(await figures.evaluateAll(elements => elements.every(el => getComputedStyle(el).animationPlayState === "paused"))).toBe(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Resume background motion" })).toBeVisible();
  await page.getByRole("button", { name: "Resume background motion" }).click();
  expect(await figures.first().evaluate(el => getComputedStyle(el).animationPlayState)).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Reduced motion enabled" })).toBeDisabled();
  expect(await figures.first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(pause).toBeEnabled();
  await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: "Create a room" })).toBeVisible();
    expect(await figures.evaluateAll(elements => elements.filter(el => getComputedStyle(el).display !== "none").length)).toBe(width === 390 ? 10 : 16);
    const positions = await figures.evaluateAll(elements => elements.filter(el => getComputedStyle(el).display !== "none").map(el => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(positions).size).toBeGreaterThan(3);
    await pause.click();
    await page.screenshot({ path: `.local/screenshots/figures-${width}.png`, fullPage: true, animations: "allow" });
    await page.getByRole("button", { name: "Resume background motion" }).click();
  }
});
