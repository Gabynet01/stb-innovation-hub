import { BaseApiService } from "./baseApi";
import { Job, JobFilters, ApiResponse } from "@/types/api";

export class JobsApiService extends BaseApiService {
  // Get Jobs with filters
  async getJobs(filters: JobFilters = {}): Promise<ApiResponse<Job[]>> {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.job_type) queryParams.append("job_type", filters.job_type);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.page_size)
      queryParams.append("page_size", filters.page_size.toString());

    const endpoint = queryParams.toString()
      ? `/jobs?${queryParams.toString()}`
      : "/jobs";

    return this.request<Job[]>(endpoint);
  }

  // Get Single Job
  async getJob(id: string): Promise<ApiResponse<Job>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid job ID provided");
    }
    return this.request<Job>(`/jobs/${id}`);
  }

  // Retry Failed Job
  async retryJob(id: string): Promise<ApiResponse<Job>> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid job ID provided");
    }

    return this.requestWithRetry(`/jobs/${id}/retry`, {
      method: "POST",
    });
  }

  // Cancel Job (if supported by the API)
  async cancelJob(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid job ID provided");
    }

    return this.request(`/jobs/${id}`, {
      method: "DELETE",
    });
  }
}
