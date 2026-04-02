import { useEffect, useRef } from "react";

const DEFAULT_INTERVAL_MS = 60_000;

/**
 * Runs `run` on an interval and whenever the document becomes visible again,
 * so lists stay fresh without a manual refresh control.
 */
export function useSoftRefresh(
  run: () => void | Promise<void>,
  enabled: boolean,
  intervalMs = DEFAULT_INTERVAL_MS
): void {
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      void runRef.current();
    };

    const id = window.setInterval(tick, intervalMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, intervalMs]);
}
