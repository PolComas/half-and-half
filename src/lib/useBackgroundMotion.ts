import { useEffect, useState } from "react";

const preferenceKey = "hh-background-motion";

export function useBackgroundMotion() {
  const [preference, setPreference] = useState<"paused" | "playing" | null>(() => {
    try {
      const saved = localStorage.getItem(preferenceKey);
      return saved === "paused" || saved === "playing" ? saved : null;
    } catch {
      return null;
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

  const paused = preference === null ? reduced : preference === "paused";
  function toggle() {
    const next = paused ? "playing" : "paused";
    setPreference(next);
    try {
      localStorage.setItem(preferenceKey, next);
    } catch {
      // The control still works for this visit if browser storage is unavailable.
    }
  }
  return { paused, reduced, followsSystem: preference === null, toggle };
}
