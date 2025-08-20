import { SuggestionsApiService } from "./suggestionsApi";
import { ClustersApiService } from "./clustersApi";
import { TopicsApiService } from "./topicsApi";
import { MetricsApiService } from "./metricsApi";
import { BaseApiService } from "./baseApi";

// Main API Service that aggregates all specialized services
export class ApiService extends BaseApiService {
  public suggestions: SuggestionsApiService;
  public clusters: ClustersApiService;
  public topics: TopicsApiService;
  public metrics: MetricsApiService;

  constructor(timeout?: number) {
    super(timeout);

    // Initialize all specialized services
    this.suggestions = new SuggestionsApiService(timeout);
    this.clusters = new ClustersApiService(timeout);
    this.topics = new TopicsApiService(timeout);
    this.metrics = new MetricsApiService(timeout);
  }

  // Override setBaseUrl to update all services
  setBaseUrl(url: string): void {
    super.setBaseUrl(url);
    this.suggestions.setBaseUrl(url);
    this.clusters.setBaseUrl(url);
    this.topics.setBaseUrl(url);
    this.metrics.setBaseUrl(url);
  }

  // Override setTimeout to update all services
  setTimeout(timeout: number): void {
    super.setTimeout(timeout);
    this.suggestions.setTimeout(timeout);
    this.clusters.setTimeout(timeout);
    this.topics.setTimeout(timeout);
    this.metrics.setTimeout(timeout);
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
};

// Export base service for custom implementations
export { BaseApiService };
