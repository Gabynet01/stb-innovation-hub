import type { IdeahubIdeaAssessment } from "./ideahub";

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data: T;
  meta?: unknown;
}

export interface ContactInfo {
  email: string | null;
  phone: string | null;
}

/** Payload for creating an idea in IdeaHub (after composing user story + context). */
export interface IdeaCreate {
  source_id: number;
  category_id: number;
  title: string;
  body: string;
  contact: ContactInfo;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
    lastModified?: number;
  }>;
}

/** UI / list view model for an IdeaHub idea (maps `/ideas/` API). */
export interface Idea {
  id: string;
  source_id: number;
  category_id: number;
  source_label: string;
  category_label: string;
  title: string;
  body: string;
  contact: Record<string, unknown>;
  attachments: Array<{
    name?: string;
    size?: number;
    type?: string;
    lastModified?: number;
    [key: string]: unknown;
  }>;
  author_type: "STAFF" | "CUSTOMER";
  status: "NEW" | "PROCESSED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  reference_number?: string;
  ideahub_status?:
    | "draft"
    | "under_review"
    | "approved"
    | "rejected"
    | "implemented";
  /** From IdeaHub when loaded with with_assessments=true */
  assessment?: IdeahubIdeaAssessment | null;
}

export interface IdeaFilters {
  /** Client-side only: IdeaHub has no text search on GET /ideas/. */
  search?: string;
  /**
   * UI bucket NEW | PROCESSED | ARCHIVED (derived from IdeaHub `status`).
   * Sent to API as `status` only when it maps to a single workflow value (NEW→draft, ARCHIVED→rejected);
   * PROCESSED is filtered client-side (maps to several workflow states).
   */
  status?: string;
  /** Pipeline / workflow — sent to IdeaHub as `status` (draft, under_review, …). Takes precedence over UI `status`. */
  ideahub_status?: string;
  source_id?: string;
  category_id?: string;
  /** Maps to IdeaHub `submitter_type`: STAFF→internal, CUSTOMER→external */
  author_type?: string;
  page?: number;
  page_size?: number;
  with_assessments?: boolean;
  /** IdeaHub GET /ideas/ — requires assessment join when set */
  min_weighted_score?: number;
  max_weighted_score?: number;
  /** IdeaHub: High | Significant | Moderate | Low | Very Low */
  priority_band?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/** Default idea list filters (aligned with useIdeas / IdeaHub query params). */
export const DEFAULT_IDEA_FILTERS: IdeaFilters = {
  search: "",
  author_type: "",
  category_id: "",
  source_id: "",
  status: "",
  ideahub_status: "",
  page: 1,
  page_size: 50,
};

export interface EnhancedIdeaFilters extends IdeaFilters {}

export interface OverviewMetrics {
  total_ideas: number;
  total_assessments: number;
  system_status: string;
  timestamp: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
