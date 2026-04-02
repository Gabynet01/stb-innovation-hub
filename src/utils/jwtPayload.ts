/** Decode JWT payload for UI only — authorization is always enforced by the API. */

export interface AccessTokenPayload {
  sub?: string;
  permissions?: string[];
  exp?: number;
  provider?: string;
  /** If IdeaHub adds these to the access token, the UI prefers them over the login field. */
  display_name?: string;
  name?: string;
  preferred_username?: string;
}

export function decodeAccessTokenPayload(
  token: string
): AccessTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (base64.length % 4)) % 4;
    const padded = base64 + "=".repeat(pad);
    const json = atob(padded);
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function permissionsFromAccessToken(token: string | null): string[] {
  if (!token) return [];
  const payload = decodeAccessTokenPayload(token);
  if (!payload || !Array.isArray(payload.permissions)) return [];
  return payload.permissions;
}

/** First human-readable name from JWT claims (API may add claims without a frontend deploy). */
export function displayNameFromAccessToken(token: string | null): string | null {
  if (!token) return null;
  const payload = decodeAccessTokenPayload(token);
  if (!payload) return null;
  const candidates = [
    payload.display_name,
    payload.name,
    payload.preferred_username,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

/** Auth provider from the access token (`internal`, `ad`, etc.). */
export function providerFromAccessToken(token: string | null): string | null {
  if (!token) return null;
  const p = decodeAccessTokenPayload(token)?.provider;
  return typeof p === "string" && p.trim() ? p.trim() : null;
}

/** `sub` claim — IdeaHub user id (UUID string) for `/users/{id}`. */
export function userIdFromAccessToken(token: string | null): string | null {
  if (!token) return null;
  const sub = decodeAccessTokenPayload(token)?.sub;
  return typeof sub === "string" && sub.trim() ? sub.trim() : null;
}
