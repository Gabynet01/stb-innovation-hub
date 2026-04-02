import { BaseApiService } from "./baseApi";
import { ApiResponse } from "@/types/api";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";

/** Idea assessments — requires authenticated user (any valid JWT). */
export class IdeaAssessmentsApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubIdeaAssessment[]>> {
    return this.requestAuth<IdeahubIdeaAssessment[]>("/idea-assessments/");
  }

  get(id: string): Promise<ApiResponse<IdeahubIdeaAssessment>> {
    return this.requestAuth<IdeahubIdeaAssessment>(`/idea-assessments/${id}`);
  }

  create(body: {
    idea_id: number;
    potential_impact: number;
    feasibility: number;
    alignment: number;
    market_demand: number;
    innovation: number;
    notes?: string | null;
  }): Promise<ApiResponse<IdeahubIdeaAssessment>> {
    return this.requestAuthWithRetry<IdeahubIdeaAssessment>(
      "/idea-assessments/",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }

  update(
    id: string,
    body: Partial<{
      potential_impact: number;
      feasibility: number;
      alignment: number;
      market_demand: number;
      innovation: number;
      notes: string | null;
    }>
  ): Promise<ApiResponse<IdeahubIdeaAssessment>> {
    return this.requestAuthWithRetry<IdeahubIdeaAssessment>(
      `/idea-assessments/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  }

  delete(id: string): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/idea-assessments/${id}`, {
      method: "DELETE",
    });
  }
}
