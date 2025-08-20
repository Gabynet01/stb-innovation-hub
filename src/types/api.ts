// API Response Types
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  meta?: Record<string, any> | null;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// Enums
export enum AuthorType {
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

export enum Category {
  UX = "UX",
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
  OPERATIONAL = "OPERATIONAL",
  OTHER = "OTHER",
}

// Core Types
export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
}

export interface SuggestionCreate {
  author_type: AuthorType;
  category: Category;
  title: string;
  body: string;
  contact: ContactInfo;
  attachments?: Record<string, any>[] | null;
}

// For production: Only use what's defined in the API spec
export interface Suggestion extends SuggestionCreate {
  id: string;
  // Only fields defined in SuggestionCreate are included
  // No additional fields beyond what the API spec defines
}

// Filter Types - only what's defined in the API spec
export interface SuggestionFilters {
  author_type?: AuthorType | null;
  category?: Category | null;
  status?: string | null;
  language?: string | null;
  tag?: string | null;
  page?: number;
  page_size?: number;
}

// Cluster Types
export enum ClusterKind {
  EMBEDDING = "EMBEDDING",
  TAG = "TAG",
  TOPIC = "TOPIC",
  FUSION = "FUSION",
}

export interface ClusterCreate {
  kind: ClusterKind;
  title?: string | null;
  description?: string | null;
  tags?: string[];
  primary_topic_id?: string | null;
  fusion_params?: Record<string, any> | null;
}

// For production: Only use what's defined in the API spec
export interface Cluster extends ClusterCreate {
  id: string;
  // Only fields defined in ClusterCreate are included
  // No additional fields beyond what the API spec defines
}

// Topic Types
export interface TopicCreate {
  label: string;
  description?: string | null;
}

// For production: Only use what's defined in the API spec
export interface Topic extends TopicCreate {
  id: string;
  // Only fields defined in TopicCreate are included
  // No additional fields beyond what the API spec defines
}

// Job Types
export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  job_type: string;
  progress?: number | null;
  result?: Record<string, any> | null;
  error?: string | null;
}

// Metrics Types
export interface OverviewMetrics {
  total_suggestions: number;
  total_clusters: number;
  total_topics: number;
  pending_suggestions: number;
  completed_suggestions: number;
  average_processing_time: number;
}

export interface ClusterMetrics {
  total_clusters: number;
  clusters_by_kind: Record<ClusterKind, number>;
  average_cluster_weight: number;
  top_clusters: Cluster[];
}

export interface TopicMetrics {
  total_topics: number;
  topics_by_support: Record<string, number>;
  average_confidence: number;
  top_topics: Topic[];
}

export interface GenerationMetrics {
  total_documents: number;
  documents_by_template: Record<string, number>;
  average_generation_time: number;
  success_rate: number;
}

// Validation Types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
