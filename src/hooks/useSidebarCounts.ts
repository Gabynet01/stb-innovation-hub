import { useState, useEffect } from "react";
import { MetricsApiService } from "@/services/metricsApi";
import { apiService } from "@/services/api";

interface SidebarCounts {
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
        console.log("Topics API response:", topicsApiResponse);
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

      // Fetch generation metrics for documents
      const generationResponse = await metricsService.getGenerationMetrics();
      if (generationResponse.ok) {
        setCounts((prev) => ({
          ...prev,
          documents: generationResponse.data.total_documents || 0,
        }));
      }

      // For templates and jobs, we'll use placeholder values for now
      // since there might not be specific count endpoints
      // You can add specific API calls for these if they exist
      setCounts((prev) => ({
        ...prev,
        templates: 0, // Placeholder - add API call when available
        jobs: 0, // Placeholder - add API call when available
      }));
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
