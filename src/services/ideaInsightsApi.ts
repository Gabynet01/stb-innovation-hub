import { BaseApiService } from "./baseApi";
import type { ApiResponse } from "@/types/api";
import type { IdeahubIdeaInsight, IdeahubSimilarIdea } from "@/types/ideahub";

/** IdeaHub `/idea-insights` — embeddings, similarity, retry. */
export class IdeaInsightsApiService extends BaseApiService {
  /** Public GET; optional Bearer still works if the client sends it. */
  get(ideaId: number): Promise<ApiResponse<IdeahubIdeaInsight>> {
    return this.request<IdeahubIdeaInsight>(`/idea-insights/${ideaId}`);
  }

  /** Public GET — returns [] when the idea has no embedding yet or no neighbours. */
  getSimilar(
    ideaId: number,
    limit = 8
  ): Promise<ApiResponse<IdeahubSimilarIdea[]>> {
    const q = new URLSearchParams({ limit: String(limit) });
    return this.request<IdeahubSimilarIdea[]>(
      `/idea-insights/${ideaId}/similar?${q.toString()}`
    );
  }

  retryEmbedding(ideaId: number): Promise<ApiResponse<IdeahubIdeaInsight>> {
    return this.requestAuthWithRetry<IdeahubIdeaInsight>(
      `/idea-insights/${ideaId}/retry-embedding`,
      { method: "POST" }
    );
  }
}
