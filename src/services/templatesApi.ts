import { BaseApiService } from "./baseApi";
import { Template, TemplateCreate, ApiResponse } from "@/types/api";

export interface TemplateFilters {
  kind?: string | null;
  active_only?: boolean;
  search?: string | null;
  page?: number;
  page_size?: number;
}

export class TemplatesApiService extends BaseApiService {
  // Get All Templates with filters
  async getTemplates(
    filters: TemplateFilters = {}
  ): Promise<ApiResponse<Template[]>> {
    const queryParams = new URLSearchParams();

    if (filters.kind) queryParams.append("kind", filters.kind);
    if (filters.active_only !== undefined)
      queryParams.append("active_only", filters.active_only.toString());
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/templates?${queryParams.toString()}`
      : "/templates";

    return this.request<Template[]>(endpoint);
  }

  // Create Template
  async createTemplate(
    template: TemplateCreate
  ): Promise<ApiResponse<Template>> {
    return this.requestWithRetry("/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });
  }

  // Get Single Template
  async getTemplate(id: string): Promise<ApiResponse<Template>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid template ID provided");
    }
    return this.request<Template>(`/templates/${id}`);
  }

  // Update Template
  async updateTemplate(
    id: string,
    updates: Partial<Template>
  ): Promise<ApiResponse<Template>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid template ID provided");
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    return this.requestWithRetry(`/templates/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
  }

  // Delete Template
  async deleteTemplate(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid template ID provided");
    }

    return this.request(`/templates/${id}`, {
      method: "DELETE",
    });
  }

  // Get Template Kinds
  async getTemplateKinds(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/templates/kinds");
  }

  // Upload Template
  async uploadTemplate(data: {
    file: File;
    template_name: string;
    template_description?: string;
    version: string;
    kind: string;
  }): Promise<ApiResponse<Template>> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("template_name", data.template_name);
    if (data.template_description) {
      formData.append("template_description", data.template_description);
    }
    formData.append("version", data.version);
    formData.append("kind", data.kind);

    return this.requestWithRetry("/templates/upload", {
      method: "POST",
      body: formData,
    });
  }
}
