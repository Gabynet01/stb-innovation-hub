import { BaseApiService } from "./baseApi";
import {
  Suggestion,
  SuggestionCreate,
  SuggestionFilters,
  ApiResponse,
} from "@/types/api";

export class SuggestionsApiService extends BaseApiService {
  // Create Suggestion
  async createSuggestion(
    suggestion: SuggestionCreate,
    idempotencyKey?: string
  ): Promise<ApiResponse> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    return this.requestWithRetry("/suggestions", {
      method: "POST",
      body: JSON.stringify(suggestion),
      headers,
    });
  }

  // Get Suggestions with filters
  async getSuggestions(
    filters: SuggestionFilters = {}
  ): Promise<ApiResponse<Suggestion[]>> {
    const queryParams = new URLSearchParams();

    // Add filters based on API spec
    if (filters.author_type)
      queryParams.append("author_type", filters.author_type);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.language) queryParams.append("language", filters.language);
    if (filters.tag) queryParams.append("tag", filters.tag);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/suggestions?${queryParams.toString()}`
      : "/suggestions";

    return this.request<Suggestion[]>(endpoint);
  }

  // Get Single Suggestion
  async getSuggestion(id: string): Promise<ApiResponse<Suggestion>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid suggestion ID provided");
    }
    return this.request<Suggestion>(`/suggestions/${id}`);
  }

  // Update Suggestion
  async updateSuggestion(
    id: string,
    updates: Partial<Suggestion>
  ): Promise<ApiResponse<Suggestion>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid suggestion ID provided");
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    return this.requestWithRetry(`/suggestions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  // Delete Suggestion
  async deleteSuggestion(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid suggestion ID provided");
    }

    return this.request(`/suggestions/${id}`, {
      method: "DELETE",
    });
  }
}
