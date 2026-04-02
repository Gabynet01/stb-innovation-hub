export type PriorityVisual = { badge: string; dot: string };

/** Maps priority band label to badge + dot Tailwind classes (Stanbic-aligned). */
export function priorityPresentation(band: string): PriorityVisual {
  const lower = band.toLowerCase();
  if (lower.includes("very low"))
    return {
      badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      dot: "bg-slate-400",
    };
  if (lower.includes("low"))
    return {
      badge: "bg-slate-100/90 text-slate-800 ring-1 ring-slate-200",
      dot: "bg-slate-500",
    };
  if (lower.includes("moderate"))
    return {
      badge: "bg-[#50BEFF]/15 text-[#0033A1] ring-1 ring-[#50BEFF]/30",
      dot: "bg-[#50BEFF]",
    };
  if (lower.includes("significant"))
    return {
      badge: "bg-[#0051FF]/12 text-[#0033A1] ring-1 ring-[#0051FF]/25",
      dot: "bg-[#0051FF]",
    };
  if (lower.includes("high"))
    return {
      badge: "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200",
      dot: "bg-emerald-500",
    };
  return {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  };
}
