import { test, expect } from "@playwright/test";

test("background crosses screen, pauses with keyboard and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
  await expect(page.getByRole("button", { name: "Enable background motion" })).toHaveAttribute("aria-pressed", "false");
  expect(await figures.evaluateAll(elements => elements.every(el => getComputedStyle(el).animationPlayState === "paused"))).toBe(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Enable background motion" })).toBeVisible();
  await page.getByRole("button", { name: "Enable background motion" }).click();
  expect(await figures.first().evaluate(el => getComputedStyle(el).animationPlayState)).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  // Explicit opt-in affects only the decorative background, even with OS reduction.
  await expect(pause).toBeEnabled();
  expect(await figures.first().evaluate(el => getComputedStyle(el).animationName)).toBe("figure-crossing");
  expect(await page.locator(".hero-copy").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
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
    await page.getByRole("button", { name: "Enable background motion" }).click();
  }
});


test("reduced-motion default can be overridden from the visible sticky header", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const figure = page.locator(".ambient-figure").first();
  const enable = page.getByRole("button", { name: "Enable background motion", exact: true });
  await expect(enable).toBeEnabled();
  await expect(enable).toHaveAttribute("aria-pressed", "false");
  expect(await figure.evaluate(el => getComputedStyle(el).animationPlayState)).toBe("paused");
  await expect(enable).toBeInViewport();
  await enable.focus();
  await page.keyboard.press("Enter");
  const pause = page.getByRole("button", { name: "Pause background motion", exact: true });
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  expect(await figure.evaluate(el => getComputedStyle(el).animationName)).toBe("figure-crossing");
  const position = await figure.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => figure.evaluate(el => getComputedStyle(el).transform)).not.toBe(position);
  await page.reload();
  await expect(pause).toBeEnabled();
  expect(await figure.evaluate(el => getComputedStyle(el).animationName)).toBe("figure-crossing");
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await expect(pause).toBeInViewport();
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(pause).toBeInViewport();
    await expect(page.getByRole("banner")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await pause.click();
    await expect(enable).toBeInViewport();
    expect(await figure.evaluate(el => getComputedStyle(el).animationPlayState)).toBe("paused");
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `.local/screenshots/motion-control-${width}.png`, fullPage: true });
    await enable.click();
  }
  await pause.click();
  await page.reload();
  await expect(enable).toBeEnabled();
  expect(await figure.evaluate(el => getComputedStyle(el).animationPlayState)).toBe("paused");

  // Without a site preference, changes to the device setting still apply live.
  await page.evaluate(() => localStorage.removeItem("hh-background-motion"));
  await page.reload();
  await expect(enable).toBeEnabled();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(pause).toBeEnabled();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(enable).toBeEnabled();
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`pause freezes position and resumes the same background timeline (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const enable = page.getByRole("button", { name: "Enable background motion", exact: true });
    const pause = page.getByRole("button", { name: "Pause background motion", exact: true });
    if (reducedMotion === "reduce") await enable.click();
    await expect(pause).toBeEnabled();
    // Advance to a distinct point, so a restart cannot resemble a valid resume.
    await page.evaluate(() => {
      const animations = document.querySelector(".atmosphere")!.getAnimations({ subtree: true });
      (window as any).__backgroundAnimations = animations;
      for (const animation of animations) animation.currentTime = 8000;
    });
    for (let cycle = 0; cycle < 2; cycle++) {
      await pause.click();
      await expect(enable).toBeEnabled();
      const frozen = await page.evaluate(async () => {
        const animations: Animation[] = (window as any).__backgroundAnimations;
        await Promise.all(animations.map(animation => animation.ready));
        const current = document.querySelector(".atmosphere")!.getAnimations({ subtree: true });
        return animations.map(animation => ({
          sameAnimation: current.includes(animation),
          state: animation.playState,
          time: Number(animation.currentTime),
          transform: getComputedStyle((animation.effect as KeyframeEffect).target!).transform,
        }));
      });
      expect(frozen).toHaveLength(20); // 16 figures, two washes and two sketches.
      expect(frozen.every(item => item.sameAnimation && item.state === "paused")).toBe(true);
      const held = await page.evaluate(async () => {
        for (let frame = 0; frame < 5; frame++) await new Promise(requestAnimationFrame);
        const animations: Animation[] = (window as any).__backgroundAnimations;
        return animations.map(animation => ({
          time: Number(animation.currentTime),
          transform: getComputedStyle((animation.effect as KeyframeEffect).target!).transform,
        }));
      });
      expect(held).toEqual(frozen.map(({ time, transform }) => ({ time, transform })));
      const frozenFigure = await page.locator(".ambient-figure").first()
        .evaluate(el => getComputedStyle(el).transform);
      await enable.click();
      await expect(pause).toBeEnabled();
      const resumed = await page.evaluate(() => {
        const current = document.querySelector(".atmosphere")!.getAnimations({ subtree: true });
        const animations: Animation[] = (window as any).__backgroundAnimations;
        return animations.map(animation => ({
          sameAnimation: current.includes(animation),
          time: Number(animation.currentTime),
        }));
      });
      resumed.forEach((animation, i) => {
        expect(animation.sameAnimation).toBe(true);
        expect(animation.time).toBeGreaterThanOrEqual(frozen[i].time);
        expect(animation.time).toBeLessThan(frozen[i].time + 1000);
      });
      await expect.poll(() => page.locator(".ambient-figure").first().evaluate(el => getComputedStyle(el).transform))
        .not.toBe(frozenFigure);
    }
  });
}
