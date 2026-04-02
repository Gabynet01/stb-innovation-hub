const ACCESS = "ideahub_access_token";
const REFRESH = "ideahub_refresh_token";
const USERNAME = "ideahub_username";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH);
  } catch {
    return null;
  }
}

export function getStoredUsername(): string | null {
  try {
    return localStorage.getItem(USERNAME);
  } catch {
    return null;
  }
}

export function setTokens(
  access: string,
  refresh: string,
  username?: string
): void {
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);
  if (username !== undefined) {
    localStorage.setItem(USERNAME, username);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USERNAME);
}
