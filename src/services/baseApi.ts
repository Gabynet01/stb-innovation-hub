import { ApiResponse } from "@/types/api";
import { API_ORIGIN, API_PREFIX_PATH } from "@/config/environment";
import { getAccessToken } from "./authStorage";
import {
  refreshAccessToken,
  skipAuthRetryForEndpoint,
} from "./tokenRefresh";

if (process.env.NODE_ENV === "development") {
  console.info("[baseApi] IdeaHub API:", `${API_ORIGIN}${API_PREFIX_PATH}`);
}

const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseFastApiError(response: Response): Promise<string> {
  try {
    const j = (await response.json()) as Record<string, unknown>;
    const d = j.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) {
      return d
        .map((item: { msg?: string; loc?: unknown }) =>
          typeof item?.msg === "string" ? item.msg : JSON.stringify(item)
        )
        .join("; ");
    }
    if (typeof j.message === "string") return j.message;
  } catch {
    /* ignore */
  }
  return response.statusText || "Request failed";
}

function isLegacyEnvelope(
  json: unknown
): json is ApiResponse & { ok: boolean } {
  return (
    typeof json === "object" &&
    json !== null &&
    "ok" in json &&
    typeof (json as ApiResponse).ok === "boolean"
  );
}

const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError("Request timeout")), timeout);
  });
};

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (
      maxRetries > 0 &&
      error instanceof ApiError &&
      error.status &&
      error.status >= 500
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(requestFn, maxRetries - 1, delay * 2);
    }
    throw error;
  }
};

export class BaseApiService {
  protected baseUrl: string;
  protected timeout: number;

  constructor(timeout: number = DEFAULT_TIMEOUT) {
    this.baseUrl = `${API_ORIGIN}${API_PREFIX_PATH}`;
    this.timeout = timeout;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number,
    _retryAfterRefresh = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestTimeout = timeout || this.timeout;

    const requestPromise = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(url, defaultHeaders(options));

        if (response.status === 204) {
          return { ok: true, data: null as T };
        }

        if (!response.ok) {
          const reqHeaders = new Headers(options.headers ?? undefined);
          const hadBearer =
            reqHeaders.has("Authorization") &&
            reqHeaders.get("Authorization")?.toLowerCase().startsWith("bearer ");

          if (
            response.status === 401 &&
            !_retryAfterRefresh &&
            hadBearer &&
            !skipAuthRetryForEndpoint(endpoint)
          ) {
            const refreshed = await refreshAccessToken(this.baseUrl);
            if (refreshed) {
              const nextHeaders = new Headers(options.headers ?? undefined);
              const t = getAccessToken();
              if (t) nextHeaders.set("Authorization", `Bearer ${t}`);
              return this.request<T>(
                endpoint,
                { ...options, headers: nextHeaders },
                timeout,
                true
              );
            }
          }

          const msg = await parseFastApiError(response);
          throw new ApiError(msg, response.status);
        }

        const text = await response.text();
        if (!text) {
          return { ok: true, data: null as T };
        }

        const json = JSON.parse(text) as unknown;
        if (isLegacyEnvelope(json)) {
          return json as ApiResponse<T>;
        }
        return { ok: true, data: json as T };
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new ApiError("Network error - please check your connection");
        }

        throw new ApiError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    return Promise.race([
      requestPromise(),
      createTimeoutPromise(requestTimeout),
    ]);
  }

  protected async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    return retryRequest(() => this.request<T>(endpoint, options, timeout));
  }

  /** Attach Bearer token (required for protected IdeaHub routes). */
  protected withAuth(options: RequestInit = {}): RequestInit {
    const token = getAccessToken();
    if (!token) {
      throw new ApiError("Authentication required", 401);
    }
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return { ...options, headers };
  }

  protected async requestAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, this.withAuth(options), timeout);
  }

  protected async requestAuthWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    return retryRequest(() =>
      this.requestAuth<T>(endpoint, options, timeout)
    );
  }

  /**
   * GET a binary body (file download) with Bearer token and the same 401→refresh
   * retry behavior as JSON requests. Use for `/.../download` endpoints.
   */
  protected async requestBlob(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number,
    _retryAfterRefresh = false
  ): Promise<Blob> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestTimeout = timeout || this.timeout;

    const requestPromise = async (): Promise<Blob> => {
      try {
        const opts = defaultHeaders(options);
        const reqHeaders = new Headers(opts.headers ?? undefined);
        const token = getAccessToken();
        if (token) reqHeaders.set("Authorization", `Bearer ${token}`);

        const response = await fetch(url, { ...opts, headers: reqHeaders });

        if (!response.ok) {
          const hadBearer =
            reqHeaders.has("Authorization") &&
            reqHeaders.get("Authorization")?.toLowerCase().startsWith("bearer ");

          if (
            response.status === 401 &&
            !_retryAfterRefresh &&
            hadBearer &&
            !skipAuthRetryForEndpoint(endpoint)
          ) {
            const refreshed = await refreshAccessToken(this.baseUrl);
            if (refreshed) {
              return this.requestBlob(endpoint, options, timeout, true);
            }
          }

          const msg = await parseFastApiError(response);
          throw new ApiError(msg, response.status);
        }

        return response.blob();
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new ApiError("Network error - please check your connection");
        }

        throw new ApiError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    return Promise.race([
      requestPromise(),
      createTimeoutPromise(requestTimeout),
    ]);
  }

  async healthCheck(): Promise<ApiResponse> {
    const url = `${API_ORIGIN}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      const msg = await parseFastApiError(response);
      throw new ApiError(msg, response.status);
    }
    const json = await response.json();
    return { ok: true, data: json };
  }

  setBaseUrl(url: string): void {
    if (url.includes(API_PREFIX_PATH)) {
      this.baseUrl = url.endsWith(API_PREFIX_PATH)
        ? url
        : url.replace(/\/+$/, "") + API_PREFIX_PATH;
    } else {
      this.baseUrl = `${url.replace(/\/+$/, "")}${API_PREFIX_PATH}`;
    }
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

function defaultHeaders(options: RequestInit): RequestInit {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return { ...options, headers };
}
