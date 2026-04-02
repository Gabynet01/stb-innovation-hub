import { ApiError, BaseApiService } from "./baseApi";
import type { ApiResponse } from "@/types/api";
import type {
  IdeahubDocumentTemplate,
  IdeahubDocumentTemplateCreate,
} from "@/types/ideahub";

/** IdeaHub GET/POST/PATCH/DELETE `/document-templates` (public list/get; mutations typically admin). */
export class DocumentTemplatesApiService extends BaseApiService {
  list(): Promise<ApiResponse<IdeahubDocumentTemplate[]>> {
    return this.request<IdeahubDocumentTemplate[]>("/document-templates/");
  }

  get(id: number): Promise<ApiResponse<IdeahubDocumentTemplate>> {
    return this.request<IdeahubDocumentTemplate>(`/document-templates/${id}`);
  }

  create(
    body: IdeahubDocumentTemplateCreate,
    file: File
  ): Promise<ApiResponse<IdeahubDocumentTemplate>> {
    const fd = new FormData();
    fd.set("name", body.name);
    fd.set("example_content", body.example_content);
    if (body.description != null) fd.set("description", body.description);
    fd.set("file", file);
    return this.requestAuthWithRetry<IdeahubDocumentTemplate>("/document-templates/", {
      method: "POST",
      body: fd,
    });
  }

  delete(id: number): Promise<ApiResponse<null>> {
    return this.requestAuth<null>(`/document-templates/${id}`, {
      method: "DELETE",
    });
  }

  /** Re-run LLM schema extraction after fixing Azure or transient errors. */
  retrySchemaExtraction(
    id: number
  ): Promise<ApiResponse<IdeahubDocumentTemplate>> {
    return this.requestAuthWithRetry<IdeahubDocumentTemplate>(
      `/document-templates/${id}/retry-schema-extraction`,
      { method: "POST" }
    );
  }

  downloadUrl(id: number): string {
    return `${this.baseUrl}/document-templates/${id}/download`;
  }

  /** GET `/document-templates/{id}/download` with Bearer token. */
  async downloadFile(id: number): Promise<Blob | null> {
    try {
      return await this.requestBlob(`/document-templates/${id}/download`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        return null;
      }
      throw e;
    }
  }
}
