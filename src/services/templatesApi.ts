import { BaseApiService } from "./baseApi";
import { Template, TemplateCreate, ApiResponse } from "@/types/api";

export class TemplatesApiService extends BaseApiService {
  // Get All Templates
  async getTemplates(): Promise<ApiResponse<Template[]>> {
    return this.request<Template[]>("/templates");
  }

  // Create Template
  async createTemplate(
    template: TemplateCreate
  ): Promise<ApiResponse<Template>> {
    return this.requestWithRetry("/templates", {
      method: "POST",
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
}
