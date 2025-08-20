import { BaseApiService } from "./baseApi";
import {
  OverviewMetrics,
  ClusterMetrics,
  TopicMetrics,
  GenerationMetrics,
  ApiResponse,
} from "@/types/api";

export class MetricsApiService extends BaseApiService {
  // Get Overview Metrics
  async getOverviewMetrics(): Promise<ApiResponse<OverviewMetrics>> {
    return this.request<OverviewMetrics>("/metrics/overview");
  }

  // Get Cluster Metrics
  async getClusterMetrics(): Promise<ApiResponse<ClusterMetrics>> {
    return this.request<ClusterMetrics>("/metrics/clusters");
  }

  // Get Topic Metrics
  async getTopicMetrics(): Promise<ApiResponse<TopicMetrics>> {
    return this.request<TopicMetrics>("/metrics/topics");
  }

  // Get Generation Metrics
  async getGenerationMetrics(): Promise<ApiResponse<GenerationMetrics>> {
    return this.request<GenerationMetrics>("/metrics/generation");
  }
}
