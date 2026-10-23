import { useEffect, useState } from "react";

const preferenceKey = "hh-background-motion";

export function useBackgroundMotion() {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem(preferenceKey) === "paused";
    } catch {
      return false;
    }
  });
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReduced(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);

  function toggle() {
    const next = !paused;
    setPaused(next);
    try {
      localStorage.setItem(preferenceKey, next ? "paused" : "playing");
    } catch {
      // The control still works for this visit if browser storage is unavailable.
    }
  }
  return { paused: paused || reduced, reduced, toggle };
}
