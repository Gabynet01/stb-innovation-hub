/** Raw IdeaHub API shapes (JSON). */

export type IdeahubIdeaStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "rejected"
  | "implemented";

export interface IdeahubIdea {
  id: number;
  source_id: number;
  category_id: number;
  title: string;
  description: string;
  submitter_type: "internal" | "external";
  submitter_id: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  submitter_phone: string | null;
  status: IdeahubIdeaStatus;
  reference_number: string;
  created_at: string;
  updated_at: string;
  /** Present when GET /ideas/?with_assessments=true (IdeaHub IdeaWithAssessmentResponse). */
  assessment?: IdeahubIdeaAssessment | null;
}

export interface IdeahubIdeaCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface IdeahubIdeaSource {
  id: number;
  slug: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IdeahubTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface IdeahubUserRead {
  id: string;
  username: string;
  email: string;
  display_name: string;
  provider: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface IdeahubPermissionRead {
  id: string;
  slug: string;
  description: string;
}

export interface IdeahubRoleRead {
  id: string;
  slug: string;
  description: string;
  permissions: IdeahubPermissionRead[];
}

export interface IdeahubGroupRead {
  id: string;
  slug: string;
  description: string;
  roles: IdeahubRoleRead[];
  permissions: IdeahubPermissionRead[];
}

export interface IdeahubADMappingRead {
  id: string;
  ad_group_name: string;
  role_id: string;
}

export interface IdeahubIdeaAssessment {
  id: string;
  idea_id: number;
  reviewed_by_user_id: string;
  potential_impact: number;
  feasibility: number;
  alignment: number;
  market_demand: number;
  innovation: number;
  weighted_score: number;
  priority_band: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** IdeaHub `DocumentTemplateResponse` */
export interface IdeahubDocumentTemplate {
  id: number;
  name: string;
  description: string | null;
  file_name: string;
  file_path: string;
  example_content: string;
  variable_schema: Record<string, unknown> | null;
  variable_schema_status: string;
  /** Server-persisted message when schema extraction failed (LLM/config). */
  schema_extraction_error?: string | null;
  /** Areas staff notes should emphasize when using this template (IdeaHub). */
  note_guide_areas?: string[] | null;
  created_at: string;
  updated_at: string;
}

/** IdeaHub `IdeaInsightResponse` */
export interface IdeahubIdeaInsight {
  id: number;
  idea_id: number;
  embedding_status: string;
  embedding_error: string | null;
  tags: string[] | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

/** IdeaHub `SimilarIdeaResponse` */
export interface IdeahubSimilarIdea {
  idea_id: number;
  title: string;
  description: string;
  reference_number: string;
  status: string;
  similarity: number;
}

export interface IdeahubDocumentTemplateCreate {
  name: string;
  description?: string | null;
  example_content: string;
}

/** IdeaHub `DocumentResponse` */
export interface IdeahubDocument {
  id: number;
  template_id: number;
  idea_id: number;
  name: string;
  markdown_content: string | null;
  template_data: Record<string, unknown> | null;
  generation_status: string;
  created_at: string;
  updated_at: string;
}

export interface IdeahubDocumentCreate {
  template_id: number;
  idea_id: number;
  name?: string | null;
}
