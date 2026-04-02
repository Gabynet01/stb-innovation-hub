/** Shared layout for idea detail — one surface, one rhythm, minimal noise. */

/** Full width of the parent; use with a padded page wrapper for horizontal margins. */
/** Avoid overflow-hidden so position:sticky (e.g. assessment preview) works inside the detail card. */
export const detailOuterShell =
  "flex w-full flex-col rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)]";

/** Horizontal padding shared by header, main, and footer so the column lines up at every breakpoint. */
export const detailPageGutterX =
  "px-5 sm:px-8 lg:px-12 xl:px-16";

/** Centered content column — matches idea body width. */
export const detailInnerColumn = "mx-auto w-full max-w-4xl";

export const detailMainPadding = `${detailPageGutterX} py-10 sm:py-12`;

export const detailStack = "flex flex-col gap-12";

export const detailSectionLabel =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500";

/** Inner block inside accordions — no loud outline; subtle fill only. */
export const detailSectionCard =
  "rounded-md bg-slate-50/80 p-4 ring-1 ring-slate-100 sm:p-4";

export const detailProse = "text-[15px] leading-[1.7] text-slate-700";
