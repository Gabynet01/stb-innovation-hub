/** Derive 1–2 letter initials from a display or login name (no placeholder literals). */
export function initialsFromName(name: string | null | undefined): string {
  const s = name?.trim();
  if (!s) return "";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? "";
    const b = parts[parts.length - 1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }
  if (s.length >= 2) return s.slice(0, 2).toUpperCase();
  return s.slice(0, 1).toUpperCase();
}
