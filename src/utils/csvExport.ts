/** Escape a single CSV field (RFC-style, quoted if needed). */
export function escapeCsvField(value: string): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildCsv(rows: string[][]): string {
  return rows.map((r) => r.map(escapeCsvField).join(",")).join("\r\n");
}

export function downloadCsvFile(filename: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
