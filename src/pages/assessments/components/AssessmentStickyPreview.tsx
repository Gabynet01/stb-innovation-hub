import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { PriorityVisual } from "../assessmentPriorityStyles";
import { AssessmentLivePreviewPanel } from "./AssessmentLivePreviewPanel";

/** Matches fixed navbar (`h-24`) + small gap so preview clears the bar. */
const PREVIEW_TOP_PX = 96;

interface AssessmentStickyPreviewProps {
  previewScore: number;
  previewBand: string;
  previewStyle: PriorityVisual;
  /** Rendered below the live preview card on large screens only (e.g. workflow tips). */
  desktopFooter?: React.ReactNode;
}

interface FixedBox {
  left: number;
  width: number;
  show: boolean;
}

/**
 * Desktop: fixed-position live preview pinned under the navbar, aligned to the
 * assessment column (measured). Stays visible while scrolling criteria/sliders.
 * Mobile: fixed bottom dock.
 *
 * Parent should be `aside` with `relative` + grid column classes; the aside must
 * stretch with the row (default grid) so the measure layer matches column geometry.
 */
export const AssessmentStickyPreview: React.FC<AssessmentStickyPreviewProps> = ({
  previewScore,
  previewBand,
  previewStyle,
  desktopFooter,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<FixedBox>({
    left: 0,
    width: 320,
    show: false,
  });

  const updateBox = useCallback(() => {
    const el = measureRef.current;
    if (!el || window.innerWidth < 1024) {
      setBox((b) => ({ ...b, show: false }));
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 8) {
      setBox((b) => ({ ...b, show: false }));
      return;
    }
    // Column still intersects the viewport — show fixed preview
    const show =
      r.bottom > PREVIEW_TOP_PX + 8 && r.top < window.innerHeight;
    setBox({
      left: r.left,
      width: r.width,
      show,
    });
  }, []);

  useLayoutEffect(() => {
    updateBox();
    const rafId = requestAnimationFrame(() => updateBox());
    window.addEventListener("scroll", updateBox, true);
    window.addEventListener("resize", updateBox);
    const ro = new ResizeObserver(updateBox);
    const el = measureRef.current;
    if (el) ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateBox, true);
      window.removeEventListener("resize", updateBox);
      ro.disconnect();
    };
  }, [updateBox]);

  const previewBlock = (
    <>
      <AssessmentLivePreviewPanel
        previewScore={previewScore}
        previewBand={previewBand}
        previewStyle={previewStyle}
      />
      {desktopFooter}
    </>
  );

  return (
    <>
      {/* Mobile — fixed dock */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden"
        role="region"
        aria-label="Live assessment score"
      >
        <div
          className="pointer-events-auto border-t border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_-12px_48px_-12px_rgba(15,23,42,0.18)] backdrop-blur-md"
          style={{
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Live score
              </p>
              <p
                className="font-mono text-2xl font-bold tabular-nums tracking-tight text-[#0033A1]"
                aria-live="polite"
                aria-atomic="true"
              >
                {previewScore.toFixed(2)}
              </p>
            </div>
            <span
              className={`max-w-[55%] shrink-0 truncate rounded-full px-3 py-1.5 text-center text-xs font-semibold ${previewStyle.badge}`}
            >
              {previewBand}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop — full-column measure + fixed clone (does not scroll with page) */}
      <div
        ref={measureRef}
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden
      />
      {box.show ? (
        <div
          className="fixed z-[45] max-h-[calc(100vh-6rem-1rem)] overflow-y-auto overscroll-contain"
          style={{
            top: PREVIEW_TOP_PX,
            left: box.left,
            width: box.width,
            maxWidth: "min(100vw - 1rem, 100%)",
          }}
        >
          {previewBlock}
        </div>
      ) : null}
    </>
  );
};
