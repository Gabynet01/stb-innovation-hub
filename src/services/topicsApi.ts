import { BaseApiService } from "./baseApi";
import { Topic, TopicCreate, ApiResponse } from "@/types/api";

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
      body: JSON.stringify(updates),
    });
  }

  // Merge Topics
  async mergeTopics(mergeData: Record<string, any>): Promise<ApiResponse> {
    return this.requestWithRetry("/topics/merge", {
      method: "POST",
      body: JSON.stringify(mergeData),
    });
  }
}
