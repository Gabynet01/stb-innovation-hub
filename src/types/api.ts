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
  // Cluster information
  cluster_id?: string | null;
  cluster_title?: string | null;
  cluster_kind?: string | null;
  cluster_confidence?: number | null;
  // Topic information
  topic_id?: string | null;
  topic_label?: string | null;
  topic_confidence?: number | null;
  // Processing status
  processing_status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  job_id?: string | null;
}

export interface SuggestionFilters {
  search?: string;
  author_type?: string;
  category?: string;
  status?: string;
  language?: string;
  tag?: string;
  cluster_id?: string;
  cluster_kind?: string;
  topic_id?: string;
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
  status?: string;
  min_weight?: number;
  tag?: string;
  topic_id?: string;
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
  created_at: string;
  updated_at: string;
}

export interface TopicFilters {
  query?: string;
  min_support?: number;
  page?: number;
  page_size?: number;
}

// Topic-Suggestion Association Types
export interface TopicSuggestionAssociation {
  suggestion: Suggestion;
  confidence: number;
}

export interface SuggestionTopicAssociation {
  topic: Topic;
  confidence: number;
}

// Enhanced filtering for suggestions with topics and clusters
export interface EnhancedSuggestionFilters extends SuggestionFilters {
  cluster_id?: string;
  cluster_kind?: string;
  topic_id?: string;
  min_topic_confidence?: number;
  min_cluster_confidence?: number;
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
  type: string;
  status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  payload?: Record<string, any> | null;
  attempts: number;
  last_error?: string | null;
  run_at?: string | null;
  created_at: string;
  updated_at: string;
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
  content?: string; // Legacy field
  template_id?: string | null;
  generated_at?: string; // Legacy field
  created_at: string;
  updated_at: string;
  status:
    | "draft"
    | "generated"
    | "published"
    | "completed"
    | "processing"
    | "failed"
    | "READY"
    | "PROCESSING"
    | "FAILED";
  output_format?: "pdf" | "docx" | "html";
  file_size?: number | null;
  metadata?: Record<string, any> | null;
  rendered_format?: string | null;
  rendered_url?: string | null;
  draft_content?: {
    markdown: string;
    source_id: string;
    source_type: string;
    template_info: {
      id: string;
      name: string;
      version: string;
    };
    generation_stats: {
      batches_processed: number;
      total_suggestions: number;
      suggestions_processed: number;
    };
  } | null;
  created_by?: string | null;
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
  content_markdown?: string;
  version?: string;
  kind?: string;
  engine?: string;
  variables: string[];
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateCreate {
  name: string;
  description?: string | null;
  content_markdown: string;
  version: string;
  kind: string;
  engine: string;
  variables: string[];
}

export interface TemplateFilters {
  kind?: string | null;
  active_only?: boolean;
  search?: string | null;
  page?: number;
  page_size?: number;
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
