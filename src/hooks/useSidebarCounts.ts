import { useState, useEffect } from "react";
import { MetricsApiService } from "@/services/metricsApi";
import { apiService } from "@/services/api";

export interface SidebarCounts {
  suggestions: number;
  clusters: number;
  topics: number;
  documents: number;
  templates: number;
  jobs: number;
}

export const useSidebarCounts = () => {
  const [counts, setCounts] = useState<SidebarCounts>({
    suggestions: 0,
    clusters: 0,
    topics: 0,
    documents: 0,
    templates: 0,
    jobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const metricsService = new MetricsApiService();

      // Fetch overview metrics for suggestions and clusters
      const overviewResponse = await metricsService.getOverviewMetrics();
      if (overviewResponse.ok) {
        setCounts((prev) => ({
          ...prev,
          suggestions: overviewResponse.data.total_suggestions || 0,
          clusters: overviewResponse.data.total_clusters || 0,
        }));
      } else {
        console.error("Failed to fetch overview metrics:", overviewResponse);
        // Fallback: fetch counts directly from APIs
        try {
          const [suggestionsResponse, clustersResponse] = await Promise.all([
            apiService.suggestions.getSuggestions({ page: 1, page_size: 1 }),
            apiService.clusters.getClusters({ page: 1, page_size: 1 }),
          ]);

          if (suggestionsResponse.ok && suggestionsResponse.data) {
            const suggestionsCount =
              suggestionsResponse.meta?.total ||
              suggestionsResponse.data.length ||
              0;
            setCounts((prev) => ({
              ...prev,
              suggestions: suggestionsCount,
            }));
          }

          if (clustersResponse.ok && clustersResponse.data) {
            const clustersCount =
              clustersResponse.meta?.total || clustersResponse.data.length || 0;
            setCounts((prev) => ({
              ...prev,
              clusters: clustersCount,
            }));
          }
        } catch (fallbackError) {
          console.error("Fallback counts fetch failed:", fallbackError);
        }
      }

      // Fetch topics count directly from topics API (since metrics endpoint might not work)
      try {
        const topicsApiResponse = await apiService.topics.getTopics({
          page: 1,
          page_size: 1,
        });
        if (topicsApiResponse.ok && topicsApiResponse.data) {
          // Use pagination metadata if available, otherwise fall back to array length
          const totalCount =
            topicsApiResponse.meta?.total || topicsApiResponse.data.length || 0;
          setCounts((prev) => ({
            ...prev,
            topics: totalCount,
          }));
        }
      } catch (topicsError) {
        console.error("Failed to fetch topics count:", topicsError);
      }

      // Fetch generation metrics for documents (with API fallback)
      const generationResponse = await metricsService.getGenerationMetrics();
      if (generationResponse.ok) {
        setCounts((prev) => ({
          ...prev,
          documents: generationResponse.data?.total_documents ?? 0,
        }));
      }
      try {
        const documentsResponse = await apiService.documents.getDocuments({
          page: 1,
          page_size: 1,
        });
        if (documentsResponse.ok && documentsResponse.data) {
          const total =
            (documentsResponse as { meta?: { total?: number } }).meta?.total ??
            (Array.isArray(documentsResponse.data) ? documentsResponse.data.length : 0);
          setCounts((prev) => ({ ...prev, documents: total }));
        }
      } catch {
        // Keep value from generation metrics if set
      }

      // Fetch templates count
      try {
        const templatesResponse = await apiService.templates.getTemplates({
          page: 1,
          page_size: 1,
        });
        if (templatesResponse.ok && templatesResponse.data) {
          const totalTemplates =
            (templatesResponse as any).meta?.total ??
            (Array.isArray(templatesResponse.data) ? templatesResponse.data.length : 0);
          setCounts((prev) => ({
            ...prev,
            templates: totalTemplates,
          }));
        }
      } catch (templatesError) {
        console.error("Failed to fetch templates count:", templatesError);
      }

      // Fetch jobs count
      try {
        const jobsResponse = await apiService.jobs.getJobs({
          page: 1,
          page_size: 1,
        });
        if (jobsResponse.ok && jobsResponse.data) {
          const totalJobs =
            (jobsResponse as any).meta?.total ??
            (Array.isArray(jobsResponse.data) ? jobsResponse.data.length : 0);
          setCounts((prev) => ({
            ...prev,
            jobs: totalJobs,
          }));
        }
      } catch (jobsError) {
        console.error("Failed to fetch jobs count:", jobsError);
      }
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
      setError("Failed to fetch counts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const refreshCounts = () => {
    fetchCounts();
  };

  return {
    counts,
    loading,
    error,
    refreshCounts,
  };
};
