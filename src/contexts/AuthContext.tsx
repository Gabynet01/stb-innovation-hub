import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken, getStoredUsername } from "@/services/authStorage";
import { subscribeTokenRefreshed } from "@/services/tokenRefresh";
import { apiService } from "@/services/api";
import {
  displayNameFromAccessToken,
  permissionsFromAccessToken,
  providerFromAccessToken,
} from "@/utils/jwtPayload";

/** IdeaHub default seed grants `users:write` only to the admin role — use for admin-only UI. */
export const IDEAHUB_ADMIN_PERMISSION = "users:write" as const;

interface AuthContextValue {
  /** Login identifier persisted at sign-in (same value sent to `/auth/login`). */
  username: string | null;
  /** Shown in the UI: JWT display claims if present, otherwise `username`. */
  displayName: string | null;
  /** From JWT `provider` (e.g. internal / ad); omit UI sublines when null. */
  provider: string | null;
  isAuthenticated: boolean;
  /**
   * True when the session has admin-level RBAC in IdeaHub (JWT includes
   * {@link IDEAHUB_ADMIN_PERMISSION}). Authorization remains enforced by the API.
   */
  isAdmin: boolean;
  /** Permission slugs from the current access token (JWT). UI hints only. */
  permissions: string[];
  hasPermission: (slug: string) => boolean;
  login: (username: string, password: string) => Promise<void>;
  /** Sign in against Active Directory (IdeaHub `login/ad`). */
  loginAd: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(() =>
    getAccessToken() ? getStoredUsername() : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getAccessToken()
  );
  const [permissions, setPermissions] = useState<string[]>(() =>
    permissionsFromAccessToken(getAccessToken())
  );
  /** Bumped when the access token is refreshed so displayName re-reads JWT claims. */
  const [sessionEpoch, setSessionEpoch] = useState(0);

  useEffect(() => {
    return subscribeTokenRefreshed(() => {
      setPermissions(permissionsFromAccessToken(getAccessToken()));
      setSessionEpoch((e) => e + 1);
    });
  }, []);

  const login = useCallback(async (u: string, password: string) => {
    await apiService.auth.login(u, password);
    setUsername(u.trim());
    setPermissions(permissionsFromAccessToken(getAccessToken()));
    setIsAuthenticated(true);
  }, []);

  const loginAd = useCallback(async (u: string, password: string) => {
    await apiService.auth.loginAd(u, password);
    setUsername(u.trim());
    setPermissions(permissionsFromAccessToken(getAccessToken()));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiService.auth.logout();
    setUsername(null);
    setPermissions([]);
    setIsAuthenticated(false);
  }, []);

  const hasPermission = useCallback(
    (slug: string) => permissions.includes(slug),
    [permissions]
  );

  const displayName = useMemo(() => {
    const fromJwt = displayNameFromAccessToken(getAccessToken());
    if (fromJwt) return fromJwt;
    return username?.trim() || null;
  }, [username, sessionEpoch]); // eslint-disable-line react-hooks/exhaustive-deps -- sessionEpoch: recompute after silent token refresh

  const provider = useMemo(() => {
    return providerFromAccessToken(getAccessToken());
  }, [username, sessionEpoch]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAdmin = useMemo(
    () => permissions.includes(IDEAHUB_ADMIN_PERMISSION),
    [permissions]
  );

  const value = useMemo(
    () => ({
      username,
      displayName,
      provider,
      isAuthenticated,
      isAdmin,
      permissions,
      hasPermission,
      login,
      loginAd,
      logout,
    }),
    [
      username,
      displayName,
      provider,
      isAuthenticated,
      isAdmin,
      permissions,
      hasPermission,
      login,
      loginAd,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
