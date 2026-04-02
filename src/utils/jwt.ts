/** Decode JWT payload (no signature verification — UI hints only; API enforces auth). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function permissionsFromToken(token: string | null): string[] {
  if (!token) return [];
  const p = decodeJwtPayload(token);
  const perms = p?.permissions;
  if (Array.isArray(perms) && perms.every((x) => typeof x === "string")) {
    return perms as string[];
  }
  return [];
}

export function hasPermission(token: string | null, slug: string): boolean {
  return permissionsFromToken(token).includes(slug);
}
