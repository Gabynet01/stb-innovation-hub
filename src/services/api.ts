import { SuggestionsApiService } from "./suggestionsApi";
import { ClustersApiService } from "./clustersApi";
import { TopicsApiService } from "./topicsApi";
import { MetricsApiService } from "./metricsApi";
import { DocumentsApiService } from "./documentsApi";
import { TemplatesApiService } from "./templatesApi";
import { JobsApiService } from "./jobsApi";
import { BaseApiService } from "./baseApi";

// Main API Service that aggregates all specialized services
export class ApiService extends BaseApiService {
  public suggestions: SuggestionsApiService;
  public clusters: ClustersApiService;
  public topics: TopicsApiService;
  public metrics: MetricsApiService;
  public documents: DocumentsApiService;
  public templates: TemplatesApiService;
  public jobs: JobsApiService;

  constructor(timeout?: number) {
    super(timeout);

    // Initialize all specialized services with the same base URL
    this.suggestions = new SuggestionsApiService(timeout);
    this.clusters = new ClustersApiService(timeout);
    this.topics = new TopicsApiService(timeout);
    this.metrics = new MetricsApiService(timeout);
    this.documents = new DocumentsApiService(timeout);
    this.templates = new TemplatesApiService(timeout);
    this.jobs = new JobsApiService(timeout);

    // Set the base URL for all services to match the parent
    // Use the parent's baseUrl directly instead of calling getBaseUrl()
    this.suggestions.setBaseUrl(this.baseUrl);
    this.clusters.setBaseUrl(this.baseUrl);
    this.topics.setBaseUrl(this.baseUrl);
    this.metrics.setBaseUrl(this.baseUrl);
    this.documents.setBaseUrl(this.baseUrl);
    this.templates.setBaseUrl(this.baseUrl);
    this.jobs.setBaseUrl(this.baseUrl);
  }

  // Override setBaseUrl to update all services
  setBaseUrl(url: string): void {
    super.setBaseUrl(url);
    this.suggestions.setBaseUrl(url);
    this.clusters.setBaseUrl(url);
    this.topics.setBaseUrl(url);
    this.metrics.setBaseUrl(url);
    this.documents.setBaseUrl(url);
    this.templates.setBaseUrl(url);
    this.jobs.setBaseUrl(url);
  }

  // Override setTimeout to update all services
  setTimeout(timeout: number): void {
    super.setTimeout(timeout);
    this.suggestions.setTimeout(timeout);
    this.clusters.setTimeout(timeout);
    this.topics.setTimeout(timeout);
    this.metrics.setTimeout(timeout);
    this.documents.setTimeout(timeout);
    this.templates.setTimeout(timeout);
    this.jobs.setTimeout(timeout);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual services for direct use if needed
export {
  SuggestionsApiService,
  ClustersApiService,
  TopicsApiService,
  MetricsApiService,
  DocumentsApiService,
  TemplatesApiService,
  JobsApiService,
};

// Export base service for custom implementations
export { BaseApiService };
