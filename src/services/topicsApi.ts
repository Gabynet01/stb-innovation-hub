import { BaseApiService } from "./baseApi";
import {
  Topic,
  TopicCreate,
  ApiResponse,
  TopicSuggestionAssociation,
  SuggestionTopicAssociation,
} from "@/types/api";

export interface TopicFilters {
  query?: string | null;
  min_support?: number | null;
  page?: number;
  page_size?: number;
}

export class TopicsApiService extends BaseApiService {
  // Get Topics with filters
  async getTopics(filters: TopicFilters = {}): Promise<ApiResponse<Topic[]>> {
    const queryParams = new URLSearchParams();

    if (filters.query) queryParams.append("query", filters.query);
    if (filters.min_support)
      queryParams.append("min_support", filters.min_support.toString());
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/topics?${queryParams.toString()}`
      : "/topics";

    return this.request<Topic[]>(endpoint);
  }

  // Create Topic
  async createTopic(topic: TopicCreate): Promise<ApiResponse<Topic>> {
    return this.requestWithRetry("/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    });
  }

  // Get Single Topic
  async getTopic(id: string): Promise<ApiResponse<Topic>> {
    return this.request<Topic>(`/topics/${id}`);
  }

  // Update Topic
  async updateTopic(
    id: string,
    updates: Partial<Topic>
  ): Promise<ApiResponse<Topic>> {
    return this.requestWithRetry(`/topics/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
  }

  // Merge Topics
  async mergeTopics(mergeData: Record<string, any>): Promise<ApiResponse> {
    return this.requestWithRetry("/topics/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mergeData),
    });
  }

  // Delete Topic
  async deleteTopic(id: string): Promise<ApiResponse> {
    return this.requestWithRetry(`/topics/${id}`, {
      method: "DELETE",
    });
  }

  // Get suggestions for a topic
  async getTopicSuggestions(
    topicId: string,
    minConfidence: number = 0.0,
    limit: number = 100
  ): Promise<
    ApiResponse<{
      topic: Topic;
      suggestions: TopicSuggestionAssociation[];
      total: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    queryParams.append("min_confidence", minConfidence.toString());
    queryParams.append("limit", limit.toString());

    return this.request(
      `/topics/${topicId}/suggestions?${queryParams.toString()}`
    );
  }

  // Associate suggestion with topic
  async associateSuggestionWithTopic(
    topicId: string,
    suggestionId: string,
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
    topicId: string,
    suggestionId: string
  ): Promise<ApiResponse> {
    return this.requestWithRetry(
      `/topics/${topicId}/suggestions/${suggestionId}`,
      {
        method: "DELETE",
      }
    );
  }
}
