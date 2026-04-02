import type { IdeahubTokenResponse } from "@/types/ideahub";
import {
  getRefreshToken,
  getStoredUsername,
  setTokens,
} from "./authStorage";

const EVENT = "ideahub-token-refreshed";

let inflight: Promise<IdeahubTokenResponse | null> | null = null;

export function notifyTokenRefreshed(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
}

export function subscribeTokenRefreshed(cb: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

async function postRefresh(
  baseUrl: string
): Promise<IdeahubTokenResponse | null> {
  const rt = getRefreshToken();
  if (!rt) return null;

  const root = baseUrl.replace(/\/+$/, "");
  const url = `${root}/auth/refresh`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: rt }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as IdeahubTokenResponse;
  if (!data?.access_token || !data?.refresh_token) return null;

  setTokens(
    data.access_token,
    data.refresh_token,
    getStoredUsername() ?? undefined
  );
  notifyTokenRefreshed();
  return {
    ...data,
    token_type: data.token_type ?? "bearer",
  };
}

/**
 * Exchanges the stored refresh token for new tokens (single shared in-flight call).
 * Returns new token payload or null if refresh is impossible or fails.
 */
export function refreshAccessToken(
  baseUrl: string
): Promise<IdeahubTokenResponse | null> {
  if (inflight) return inflight;

  inflight = postRefresh(baseUrl).finally(() => {
    inflight = null;
  });

  return inflight;
}

export function skipAuthRetryForEndpoint(endpoint: string): boolean {
  const e = endpoint.split("?")[0];
  return e === "/auth/refresh" || e === "/auth/login" || e === "/auth/register";
}
