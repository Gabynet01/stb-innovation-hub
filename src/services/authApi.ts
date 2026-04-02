import { BaseApiService, ApiError } from "./baseApi";
import type { ApiResponse } from "@/types/api";
import type { IdeahubTokenResponse, IdeahubUserRead } from "@/types/ideahub";
import {
  setTokens,
  clearTokens,
  getAccessToken,
} from "./authStorage";
import { refreshAccessToken } from "./tokenRefresh";

/**
 * OAuth2 password flow against IdeaHub `/api/v1/auth/login`.
 */
export class AuthApiService extends BaseApiService {
  async login(username: string, password: string): Promise<ApiResponse<IdeahubTokenResponse>> {
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    const url = `${this.getBaseUrl()}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      let msg = response.statusText;
      try {
        const j = (await response.json()) as { detail?: unknown };
        if (typeof j.detail === "string") msg = j.detail;
      } catch {
        /* ignore */
      }
      throw new ApiError(msg, response.status);
    }

    const data = (await response.json()) as IdeahubTokenResponse;
    setTokens(data.access_token, data.refresh_token, username);
    return { ok: true, data };
  }

  /** Active Directory bind — IdeaHub `POST /auth/login/ad` (LDAP; requires AD_* env on server). */
  async loginAd(username: string, password: string): Promise<ApiResponse<IdeahubTokenResponse>> {
    const url = `${this.getBaseUrl()}/auth/login/ad`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });

    if (!response.ok) {
      let msg = response.statusText;
      try {
        const j = (await response.json()) as { detail?: unknown };
        if (typeof j.detail === "string") msg = j.detail;
      } catch {
        /* ignore */
      }
      throw new ApiError(msg, response.status);
    }

    const data = (await response.json()) as IdeahubTokenResponse;
    setTokens(data.access_token, data.refresh_token, username.trim());
    return { ok: true, data };
  }

  async logout(): Promise<void> {
    const url = `${this.getBaseUrl()}/auth/logout`;
    const token = getAccessToken();
    if (!token) {
      clearTokens();
      return;
    }
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      clearTokens();
    }
  }

  /**
   * Public registration — creates a user account (IdeaHub `POST /auth/register`).
   * Does not log the new user in or change the current session.
   */
  async register(body: {
    username: string;
    email: string;
    password: string;
    display_name?: string;
  }): Promise<ApiResponse<IdeahubUserRead>> {
    return this.request<IdeahubUserRead>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: body.username.trim(),
        email: body.email.trim(),
        password: body.password,
        display_name: (body.display_name ?? "").trim(),
      }),
    });
  }

  async refresh(): Promise<ApiResponse<IdeahubTokenResponse>> {
    const data = await refreshAccessToken(this.getBaseUrl());
    if (!data) {
      throw new ApiError(
        "Session expired or invalid. Please sign in again.",
        401
      );
    }
    return { ok: true, data };
  }
}
