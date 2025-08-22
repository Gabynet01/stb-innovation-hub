import { useState, useEffect } from "react";
import { MetricsApiService } from "@/services/metricsApi";

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
      }

      // Fetch topic metrics
      const topicsResponse = await metricsService.getTopicMetrics();
      if (topicsResponse.ok) {
        setCounts((prev) => ({
          ...prev,
          topics: topicsResponse.data.total_topics || 0,
        }));
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
