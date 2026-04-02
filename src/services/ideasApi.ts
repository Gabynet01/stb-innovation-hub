import { BaseApiService } from "./baseApi";
import {
  Idea,
  IdeaCreate,
  IdeaFilters,
  EnhancedIdeaFilters,
  ApiResponse,
} from "@/types/api";
import type { IdeahubIdea } from "@/types/ideahub";
import {
  mapIdeahubIdeaToIdea,
  buildCategoryMap,
  buildSourceMap,
} from "./ideaHubMappers";
import { loadIdeaCategories, loadIdeaSources } from "./ideaHubCatalog";
import { getAccessToken } from "./authStorage";

function appendAttachmentNote(
  description: string,
  attachments: Record<string, unknown>[]
): string {
  if (!attachments?.length) return description;
  const meta = attachments.map((a) => ({
    name: a.name,
    size: a.size,
    type: a.type,
  }));
  return `${description}\n\n[Attachment metadata: ${JSON.stringify(meta)}]`;
}

export class IdeasApiService extends BaseApiService {
  private async maps() {
    const [categories, sources] = await Promise.all([
      loadIdeaCategories(),
      loadIdeaSources(),
    ]);
    return {
      categoriesById: buildCategoryMap(categories),
      sourcesById: buildSourceMap(sources),
      categories,
      sources,
    };
  }

  private async mapIdeahubIdeasToIdeas(ideas: IdeahubIdea[]): Promise<Idea[]> {
    const { categoriesById, sourcesById } = await this.maps();
    return ideas.map((i) => mapIdeahubIdeaToIdea(i, categoriesById, sourcesById));
  }

  /**
   * Builds GET /ideas/ query string from filters. Matches IdeaHub:
   * source_id, category_id, submitter_type, status, with_assessments,
   * min_weighted_score, max_weighted_score, priority_band, sort_by, sort_order.
   */
  private buildIdeasListPath(filters: IdeaFilters | EnhancedIdeaFilters): string {
    const p = new URLSearchParams();

    if (filters.with_assessments) {
      p.set("with_assessments", "true");
    }

    const sourceId = filters.source_id?.trim();
    if (sourceId) {
      const n = Number(sourceId);
      if (!Number.isNaN(n)) p.set("source_id", String(n));
    }

    const categoryId = filters.category_id?.trim();
    if (categoryId) {
      const n = Number(categoryId);
      if (!Number.isNaN(n)) p.set("category_id", String(n));
    }

    if (filters.author_type === "STAFF") {
      p.set("submitter_type", "internal");
    } else if (filters.author_type === "CUSTOMER") {
      p.set("submitter_type", "external");
    }

    const pipeline = filters.ideahub_status?.trim();
    if (pipeline) {
      p.set("status", pipeline);
    } else {
      const ui = filters.status?.trim();
      if (ui === "NEW") {
        p.set("status", "draft");
      } else if (ui === "ARCHIVED") {
        p.set("status", "rejected");
      }
      // PROCESSED: no single IdeaHub status — filtered in memory after fetch
    }

    if (filters.min_weighted_score != null && !Number.isNaN(filters.min_weighted_score)) {
      p.set("min_weighted_score", String(filters.min_weighted_score));
    }
    if (filters.max_weighted_score != null && !Number.isNaN(filters.max_weighted_score)) {
      p.set("max_weighted_score", String(filters.max_weighted_score));
    }
    if (filters.priority_band?.trim()) {
      p.set("priority_band", filters.priority_band.trim());
    }
    if (filters.sort_by?.trim()) {
      p.set("sort_by", filters.sort_by.trim());
    }
    if (filters.sort_order === "asc" || filters.sort_order === "desc") {
      p.set("sort_order", filters.sort_order);
    }

    const q = p.toString();
    return q ? `/ideas/?${q}` : `/ideas/`;
  }

  /**
   * IdeaHub does not support text search; UI bucket PROCESSED needs multiple statuses.
   */
  private filterIdeasInMemory(
    list: Idea[],
    filters: IdeaFilters | EnhancedIdeaFilters
  ): Idea[] {
    let out = list;

    const q = filters.search?.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.body.toLowerCase().includes(q) ||
          s.reference_number?.toLowerCase().includes(q) ||
          s.category_label.toLowerCase().includes(q) ||
          s.source_label.toLowerCase().includes(q)
      );
    }

    if (filters.status === "PROCESSED" && !filters.ideahub_status?.trim()) {
      out = out.filter((s) => s.status === "PROCESSED");
    }

    if (filters.status?.trim() && filters.ideahub_status?.trim()) {
      out = out.filter((s) => s.status === filters.status);
    }

    return out;
  }

  async createIdea(
    payload: IdeaCreate,
    idempotencyKey?: string
  ): Promise<ApiResponse<Idea>> {
    const description =
      payload.attachments?.length
        ? appendAttachmentNote(payload.body, payload.attachments)
        : payload.body;

    /** IdeaHub fills submitter name/email from the users row when Bearer token is sent (no users:read needed). */
    const body: Record<string, unknown> = {
      source_id: payload.source_id,
      category_id: payload.category_id,
      title: payload.title,
      description,
      submitter_name: null,
      submitter_email: payload.contact?.email?.trim() || null,
      submitter_phone: payload.contact?.phone?.trim() || null,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await this.requestWithRetry<IdeahubIdea>("/ideas/", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok || res.data === undefined || res.data === null) {
      return res as unknown as ApiResponse<Idea>;
    }
    const mapped = await this.mapIdeahubIdeasToIdeas([res.data]);
    return { ok: true, data: mapped[0] };
  }

  async listIdeas(
    filters: IdeaFilters | EnhancedIdeaFilters = {}
  ): Promise<ApiResponse<Idea[]>> {
    const raw = await this.request<IdeahubIdea[]>(
      this.buildIdeasListPath(filters)
    );
    if (!raw.ok || !raw.data) {
      return raw as unknown as ApiResponse<Idea[]>;
    }
    let mapped = await this.mapIdeahubIdeasToIdeas(raw.data);
    mapped = this.filterIdeasInMemory(mapped, filters);
    return { ok: true, data: mapped };
  }

  async getIdea(id: string): Promise<ApiResponse<Idea>> {
    if (!id) {
      throw new Error("Invalid idea ID");
    }
    const raw = await this.request<IdeahubIdea>(
      `/ideas/${id}?with_assessments=true`
    );
    if (!raw.ok || raw.data === undefined || raw.data === null) {
      return raw as unknown as ApiResponse<Idea>;
    }
    const mapped = await this.mapIdeahubIdeasToIdeas([raw.data]);
    return { ok: true, data: mapped[0] };
  }

  async updateIdea(
    id: string,
    updates: Partial<Idea> & {
      body?: string;
      category_id?: number;
      source_id?: number;
    }
  ): Promise<ApiResponse<Idea>> {
    if (!id) {
      throw new Error("Invalid idea ID");
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    const apiPayload: Record<string, unknown> = {};

    if (updates.title !== undefined) apiPayload.title = updates.title;
    if (updates.body !== undefined) {
      const att = (updates.attachments as Record<string, unknown>[]) || [];
      apiPayload.description =
        att.length > 0
          ? appendAttachmentNote(updates.body, att)
          : updates.body;
    }
    if (updates.category_id !== undefined) {
      apiPayload.category_id = updates.category_id;
    }
    if (updates.source_id !== undefined) {
      apiPayload.source_id = updates.source_id;
    }
    if (updates.contact) {
      if (updates.contact.email !== undefined) {
        apiPayload.submitter_email = updates.contact.email;
      }
      if (updates.contact.phone !== undefined) {
        apiPayload.submitter_phone = updates.contact.phone;
      }
    }

    const raw = await this.requestWithRetry<IdeahubIdea>(`/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(apiPayload),
      headers: { "Content-Type": "application/json" },
    });

    if (!raw.ok || !raw.data) {
      return raw as unknown as ApiResponse<Idea>;
    }
    const mapped = await this.mapIdeahubIdeasToIdeas([raw.data]);
    return { ok: true, data: mapped[0] };
  }

  async updateIdeaStatus(
    id: string,
    status: IdeahubIdea["status"]
  ): Promise<ApiResponse<Idea>> {
    const raw = await this.requestWithRetry<IdeahubIdea>(`/ideas/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });
    if (!raw.ok || !raw.data) {
      return raw as unknown as ApiResponse<Idea>;
    }
    const mapped = await this.mapIdeahubIdeasToIdeas([raw.data]);
    return { ok: true, data: mapped[0] };
  }

  async deleteIdea(id: string): Promise<ApiResponse> {
    if (!id) {
      throw new Error("Invalid idea ID");
    }
    return this.request(`/ideas/${id}`, {
      method: "DELETE",
    });
  }
}
