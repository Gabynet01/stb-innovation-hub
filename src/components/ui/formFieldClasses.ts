/** Refined fields: soft slate edges, Stanbic focus, readable shadows */

const softElevated =
  "shadow-sm shadow-slate-900/[0.04] hover:shadow-md hover:shadow-slate-900/[0.06]";

export const formFieldDefaultVariant = [
  "border-slate-200",
  softElevated,
  "hover:border-slate-300",
  "focus:border-[#0051FF] focus:ring-2 focus:ring-[#0051FF]/18",
].join(" ");

export const formFieldEmphasisVariant = [
  "border-slate-300",
  softElevated,
  "focus:border-[#0051FF] focus:ring-2 focus:ring-[#0051FF]/18",
].join(" ");

export const formFieldErrorClasses = [
  "border-red-300",
  "shadow-sm shadow-red-900/[0.04]",
  "hover:border-red-400",
  "focus:border-red-500 focus:ring-2 focus:ring-red-200/60",
].join(" ");
