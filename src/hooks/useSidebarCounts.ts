import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

export interface SidebarCounts {
  ideas: number;
}

/**
 * Sidebar counts — IdeaHub `/ideas/` list length.
 * @param enabled When false, skips fetching (e.g. guest submit-only session).
 */
export const useSidebarCounts = (enabled = true) => {
  const [counts, setCounts] = useState<SidebarCounts>({
    ideas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiService.ideas.listIdeas({
        page: 1,
        page_size: 500,
      });

      if (res.ok && res.data) {
        setCounts({ ideas: res.data.length });
      } else {
        setError("Failed to fetch idea counts");
      }
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
      setError("Failed to fetch counts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setCounts({ ideas: 0 });
      setError(null);
      setLoading(false);
      return;
    }
    void fetchCounts();
  }, [enabled]);

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
