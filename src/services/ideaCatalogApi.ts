import { BaseApiService } from "./baseApi";
import { ApiResponse } from "@/types/api";
import type { IdeahubIdeaCategory, IdeahubIdeaSource } from "@/types/ideahub";

/** Idea sources & categories — IdeaHub CRUD (no auth on API today). */
export class IdeaCatalogApiService extends BaseApiService {
  listSources(): Promise<ApiResponse<IdeahubIdeaSource[]>> {
    return this.request<IdeahubIdeaSource[]>("/idea-sources/");
  }

  getSource(id: number): Promise<ApiResponse<IdeahubIdeaSource>> {
    return this.request<IdeahubIdeaSource>(`/idea-sources/${id}`);
  }

  createSource(body: {
    slug: string;
    name: string;
    description: string;
  }): Promise<ApiResponse<IdeahubIdeaSource>> {
    return this.requestWithRetry<IdeahubIdeaSource>("/idea-sources/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  updateSource(
    id: number,
    body: Partial<{ slug: string; name: string; description: string }>
  ): Promise<ApiResponse<IdeahubIdeaSource>> {
    return this.requestWithRetry<IdeahubIdeaSource>(`/idea-sources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  deleteSource(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/idea-sources/${id}`, { method: "DELETE" });
  }

  listCategories(): Promise<ApiResponse<IdeahubIdeaCategory[]>> {
    return this.request<IdeahubIdeaCategory[]>("/idea-categories/");
  }

  getCategory(id: number): Promise<ApiResponse<IdeahubIdeaCategory>> {
    return this.request<IdeahubIdeaCategory>(`/idea-categories/${id}`);
  }

  createCategory(body: {
    slug: string;
    name: string;
    description: string;
    sort_order: number;
  }): Promise<ApiResponse<IdeahubIdeaCategory>> {
    return this.requestWithRetry<IdeahubIdeaCategory>("/idea-categories/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  updateCategory(
    id: number,
    body: Partial<{
      slug: string;
      name: string;
      description: string;
      sort_order: number;
    }>
  ): Promise<ApiResponse<IdeahubIdeaCategory>> {
    return this.requestWithRetry<IdeahubIdeaCategory>(
      `/idea-categories/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  }

  deleteCategory(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/idea-categories/${id}`, { method: "DELETE" });
  }
}
