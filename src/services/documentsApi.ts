import { ApiError, BaseApiService } from "./baseApi";
import type { ApiResponse } from "@/types/api";
import type { IdeahubDocument, IdeahubDocumentCreate } from "@/types/ideahub";

/** IdeaHub `/documents` — generation runs async; poll until `generation_status === completed`. */
export class DocumentsApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubDocument[]>> {
    return this.request<IdeahubDocument[]>("/documents/");
  }

  get(id: number): Promise<ApiResponse<IdeahubDocument>> {
    return this.request<IdeahubDocument>(`/documents/${id}`);
  }

  create(
    body: IdeahubDocumentCreate
  ): Promise<ApiResponse<IdeahubDocument>> {
    return this.requestAuthWithRetry<IdeahubDocument>("/documents/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  delete(id: number): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/documents/${id}`, {
      method: "DELETE",
    });
  }

  downloadUrl(id: number): string {
    return `${this.baseUrl}/documents/${id}/download`;
  }

  /** GET `/documents/{id}/download` with Bearer token; returns null if not ready or missing. */
  async downloadFile(id: number): Promise<Blob | null> {
    try {
      return await this.requestBlob(`/documents/${id}/download`);
    } catch (e) {
      if (e instanceof ApiError && e.status && [404, 409].includes(e.status)) {
        return null;
      }
      throw e;
    }
  }
}
