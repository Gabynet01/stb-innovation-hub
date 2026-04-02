export function composeUserStoryLines(
  asA: string,
  want: string,
  soThat: string
): string {
  const a = asA.trim();
  const w = want.trim();
  const s = soThat.trim();
  const lines: string[] = [];
  if (a) lines.push(`As a ${a},`);
  if (w) lines.push(`I want to ${w},`);
  if (s) lines.push(`so that ${s}.`);
  return lines.join("\n");
}
