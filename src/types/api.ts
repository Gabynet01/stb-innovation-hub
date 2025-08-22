// Core API Response Structure
export interface ApiResponse<T = any> {
  ok: boolean;
  data: T;
  meta?: any;
}

// Suggestion Types - exactly matching backend schemas
export interface ContactInfo {
  email: string | null;
  phone: string | null;
}

export interface SuggestionCreate {
  author_type: "STAFF" | "CUSTOMER";
  category: "UX" | "PRODUCT" | "SERVICE" | "OPERATIONAL" | "OTHER";
  title: string;
  body: string;
  contact: ContactInfo;
  attachments?: Record<string, any>[];
}

export interface Suggestion {
  id: string;
  author_type: "STAFF" | "CUSTOMER";
  category: "UX" | "PRODUCT" | "SERVICE" | "OPERATIONAL" | "OTHER";
  title: string;
  body: string;
  contact: Record<string, any>;
  attachments: Record<string, any>[];
  tags: string[];
  language: string | null;
  embedding_model: string | null;
  status: "NEW" | "PROCESSED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface SuggestionFilters {
  search?: string;
  author_type?: string;
  category?: string;
  status?: string;
  language?: string;
  tag?: string;
  page?: number;
  page_size?: number;
}

// Cluster Types - exactly matching backend schemas
export interface ClusterCreate {
  kind: "EMBEDDING" | "TAG" | "TOPIC" | "FUSION";
  title?: string | null;
  description?: string | null;
  tags?: string[];
  primary_topic_id?: string | null;
  fusion_params?: Record<string, any> | null;
}

export interface Cluster {
  id: string;
  kind: "EMBEDDING" | "TAG" | "TOPIC" | "FUSION";
  title?: string | null;
  description?: string | null;
  tags: string[];
  weight: number;
  status: "NEW" | "IN_REVIEW" | "IN_PROGRESS" | "CLOSED" | "ARCHIVED";
  primary_topic_id?: string | null;
  fusion_params?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ClusterFilters {
  kind?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Topic Types - exactly matching backend schemas
export interface TopicCreate {
  label: string;
  description?: string | null;
}

export interface Topic {
  id: string;
  label: string;
  description?: string | null;
}

export interface TopicFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

// Metrics Types - exactly matching backend responses
export interface OverviewMetrics {
  total_suggestions: number;
  total_clusters: number;
  jobs: Record<string, number>;
  system_status: string;
  timestamp: string;
}

export interface ClusterMetrics {
  total_clusters: number;
  by_kind: Record<string, number>;
  by_status: Record<string, number>;
  total_weight: number;
  avg_weight: number;
}

export interface TopicMetrics {
  total_topics: number;
  reuse_rate: number;
  avg_confidence: number;
  message: string;
}

export interface GenerationMetrics {
  total_documents: number;
  documents_by_status: Record<string, number>;
  documents_by_type: Record<string, number>;
  average_generation_time: number;
}

// Job Types - exactly matching backend schemas
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

export interface JobFilters {
  status?: string | null;
  job_type?: string | null;
  page?: number;
  page_size?: number;
}

export interface JobStats {
  total_jobs: number;
  jobs_by_status: Record<string, number>;
  jobs_by_type: Record<string, number>;
  average_processing_time: number;
}

// Document Types - exactly matching backend schemas
export interface Document {
  id: string;
  title: string;
  content: string;
  template_id?: string | null;
  generated_at: string;
  status: "draft" | "generated" | "published";
  metadata?: Record<string, any> | null;
}

export interface DocumentCreate {
  title: string;
  template_id: string;
  data: Record<string, any>;
  output_format?: "pdf" | "docx" | "html";
}

export interface DocumentFilters {
  template_id?: string | null;
  status?: string | null;
  page?: number;
  page_size?: number;
}

// Template Types - exactly matching backend schemas
export interface Template {
  id: string;
  name: string;
  description?: string | null;
  content: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface TemplateCreate {
  name: string;
  description?: string | null;
  content: string;
  variables: string[];
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
