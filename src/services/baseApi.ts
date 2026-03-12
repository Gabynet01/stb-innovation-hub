import { ApiResponse } from "@/types/api";
import { API_BASE_URL } from "@/config/environment";

const API_VERSION = "v1";

if (process.env.NODE_ENV === "development") {
  console.info("[baseApi] API base URL:", API_BASE_URL);
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
    this.baseUrl = `${API_BASE_URL}/${API_VERSION}`;
    this.timeout = timeout;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestTimeout = timeout || this.timeout;

    const defaultOptions = options;

    const requestPromise = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
          let errorData: Record<string, unknown> = {};
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
          }

          throw new ApiError(
            (errorData.message as string) ||
              `HTTP error! status: ${response.status}`,
            response.status,
            errorData.code as string,
            errorData.details as Record<string, unknown>
          );
        }

        const data = await response.json();
        return data as ApiResponse<T>;
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

  async healthCheck(): Promise<ApiResponse> {
    return this.request("/health");
  }

  setBaseUrl(url: string): void {
    if (url.endsWith(`/${API_VERSION}`)) {
      this.baseUrl = url;
    } else {
      this.baseUrl = `${url}/${API_VERSION}`;
    }
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
