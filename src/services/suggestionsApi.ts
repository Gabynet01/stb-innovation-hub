import { BaseApiService } from "./baseApi";
import {
  Suggestion,
  SuggestionCreate,
  SuggestionFilters,
  EnhancedSuggestionFilters,
  ApiResponse,
  SuggestionTopicAssociation,
} from "@/types/api";

export class SuggestionsApiService extends BaseApiService {
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
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }

  async getSuggestions(
    filters: SuggestionFilters | EnhancedSuggestionFilters = {}
  ): Promise<ApiResponse<Suggestion[]>> {
    const queryParams = new URLSearchParams();

    if (filters.author_type)
      queryParams.append("author_type", filters.author_type);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.language) queryParams.append("language", filters.language);
    if (filters.tag) queryParams.append("tag", filters.tag);
    if (filters.cluster_id)
      queryParams.append("cluster_id", filters.cluster_id);
    if (filters.cluster_kind)
      queryParams.append("cluster_kind", filters.cluster_kind);
    if (filters.topic_id) queryParams.append("topic_id", filters.topic_id);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/suggestions?${queryParams.toString()}`
      : "/suggestions";

    return this.request<Suggestion[]>(endpoint);
  }

  async getSuggestion(id: string): Promise<ApiResponse<Suggestion>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid suggestion ID provided");
    }
    return this.request<Suggestion>(`/suggestions/${id}`);
  }

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
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteSuggestion(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid suggestion ID provided");
    }

    return this.request(`/suggestions/${id}`, {
      method: "DELETE",
    });
  }

  // Get topics for a suggestion
  async getSuggestionTopics(
    suggestionId: string,
    minConfidence: number = 0.0
  ): Promise<
    ApiResponse<{
      suggestion: Suggestion;
      topics: SuggestionTopicAssociation[];
      total: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    queryParams.append("min_confidence", minConfidence.toString());

    return this.request(
      `/suggestions/${suggestionId}/topics?${queryParams.toString()}`
    );
  }

  // Associate suggestion with topic
  async associateSuggestionWithTopic(
    suggestionId: string,
    topicId: string,
    confidence: number = 0.5
  ): Promise<ApiResponse> {
    return this.requestWithRetry(
      `/topics/${topicId}/suggestions/${suggestionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confidence }),
      }
    );
  }

  // Remove suggestion from topic
  async removeSuggestionFromTopic(
    suggestionId: string,
    topicId: string
  ): Promise<ApiResponse> {
    return this.requestWithRetry(
      `/topics/${topicId}/suggestions/${suggestionId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Get suggestion processing status
  async getSuggestionProcessingStatus(
    suggestionId: string
  ): Promise<ApiResponse<{ status: string; job_id?: string }>> {
    return this.request(`/suggestions/${suggestionId}/status`);
  }
}
