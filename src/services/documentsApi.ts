import { BaseApiService } from "./baseApi";
import { Document, DocumentCreate, ApiResponse } from "@/types/api";

export interface DocumentFilters {
  template_id?: string | null;
  status?: string | null;
  page?: number;
  page_size?: number;
}

export class DocumentsApiService extends BaseApiService {
  // Get Documents with filters
  async getDocuments(
    filters: DocumentFilters = {}
  ): Promise<ApiResponse<Document[]>> {
    const queryParams = new URLSearchParams();

    if (filters.template_id)
      queryParams.append("template_id", filters.template_id);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/documents?${queryParams.toString()}`
      : "/documents";

    return this.request<Document[]>(endpoint);
  }

  // Create Document
  async createDocument(
    document: DocumentCreate
  ): Promise<ApiResponse<Document>> {
    return this.requestWithRetry("/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    });
  }

  // Get Single Document
  async getDocument(id: string): Promise<ApiResponse<Document>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid document ID provided");
    }
    return this.request<Document>(`/documents/${id}`);
  }

  // Update Document
  async updateDocument(
    id: string,
    updates: Partial<Document>
  ): Promise<ApiResponse<Document>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid document ID provided");
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    return this.requestWithRetry(`/documents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
  }

  // Delete Document
  async deleteDocument(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid document ID provided");
    }

    return this.request(`/documents/${id}`, {
      method: "DELETE",
    });
  }

  // Generate Document from Cluster
  async generateDocumentFromCluster(
    clusterId: string,
    templateId: string,
    title?: string,
    renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
  ): Promise<ApiResponse<any>> {
    return this.requestWithRetry("/documents/generate/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cluster_id: clusterId,
        template_id: templateId,
        title: title,
        render_format: renderFormat,
      }),
    });
  }

  // Generate Document from Topic
  async generateDocumentFromTopic(
    topicId: string,
    templateId: string,
    title?: string,
    renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
  ): Promise<ApiResponse<any>> {
    return this.requestWithRetry("/documents/generate/topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic_id: topicId,
        template_id: templateId,
        title: title,
        render_format: renderFormat,
      }),
    });
  }

  // Export Document
  async exportDocument(
    documentId: string,
    format: "pdf" | "docx" | "html" | "txt" | "md" = "pdf"
  ): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/documents/${documentId}/export?format=${format}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Get Document Relationships
  async getDocumentRelationships(
    documentId: string
  ): Promise<ApiResponse<any>> {
    return this.request(`/documents/${documentId}/relationships`);
  }

  // Get Document Versions
  async getDocumentVersions(
    documentId: string
  ): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>(`/documents/${documentId}/versions`);
  }
}
