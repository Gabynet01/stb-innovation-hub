import { BaseApiService } from "./baseApi";
import { Cluster, ClusterCreate, ApiResponse } from "@/types/api";

export interface ClusterFilters {
  kind?: string | null;
  status?: string | null;
  min_weight?: number | null;
  tag?: string | null;
  topic_id?: string | null;
  page?: number;
  page_size?: number;
}

export class ClustersApiService extends BaseApiService {
  // Get Clusters with filters
  async getClusters(
    filters: ClusterFilters = {}
  ): Promise<ApiResponse<Cluster[]>> {
    const queryParams = new URLSearchParams();

    if (filters.kind) queryParams.append("kind", filters.kind);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.min_weight)
      queryParams.append("min_weight", filters.min_weight.toString());
    if (filters.tag) queryParams.append("tag", filters.tag);
    if (filters.topic_id) queryParams.append("topic_id", filters.topic_id);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/clusters?${queryParams.toString()}`
      : "/clusters";

    return this.request<Cluster[]>(endpoint);
  }

  // Create Cluster
  async createCluster(cluster: ClusterCreate): Promise<ApiResponse<Cluster>> {
    return this.requestWithRetry("/clusters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cluster),
    });
  }

  // Get Single Cluster
  async getCluster(id: string): Promise<ApiResponse<Cluster>> {
    return this.request<Cluster>(`/clusters/${id}`);
  }

  // Update Cluster
  async updateCluster(
    id: string,
    updates: Partial<Cluster>
  ): Promise<ApiResponse<Cluster>> {
    return this.requestWithRetry(`/clusters/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
  }

  // Add Cluster Member
  async addClusterMember(
    clusterId: string,
    memberData: Record<string, any>
  ): Promise<ApiResponse> {
    return this.requestWithRetry(`/clusters/${clusterId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });
  }

  // Remove Cluster Member
  async removeClusterMember(
    clusterId: string,
    memberId: string,
    memberType: "document" | "suggestion"
  ): Promise<ApiResponse> {
    const endpoint = `/clusters/${clusterId}/members/${memberId}?member_type=${memberType}`;
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // Delete Cluster
  async deleteCluster(id: string): Promise<ApiResponse> {
    return this.requestWithRetry(`/clusters/${id}`, {
      method: "DELETE",
    });
  }
}
