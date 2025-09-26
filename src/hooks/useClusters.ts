import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import { Cluster, ClusterCreate, ClusterFilters } from "@/types/api";

interface UseClustersReturn {
  clusters: Cluster[];
  loading: boolean;
  error: string | null;
  filters: ClusterFilters;
  setFilters: (filters: ClusterFilters) => void;
  createCluster: (cluster: ClusterCreate) => Promise<boolean>;
  updateCluster: (id: string, updates: Partial<Cluster>) => Promise<boolean>;
  deleteCluster: (id: string) => Promise<boolean>;
  addClusterMember: (
    clusterId: string,
    memberData: {
      suggestion_id?: string;
      document_id?: string;
      similarity?: number;
    }
  ) => Promise<boolean>;
  removeClusterMember: (
    clusterId: string,
    memberId: string,
    memberType: "suggestion" | "document"
  ) => Promise<boolean>;
  clearError: () => void;
  refreshClusters: () => Promise<void>;
}

export const useClusters = (): UseClustersReturn => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClusterFilters>({
    kind: undefined,
    status: undefined,
    min_weight: undefined,
    tag: undefined,
    topic_id: undefined,
    page: 1,
    page_size: 50,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchClusters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.clusters.getClusters(filters);
      if (response.ok && response.data) {
        setClusters(response.data);
      } else {
        setError("Failed to fetch clusters");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clusters");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createCluster = useCallback(
    async (cluster: ClusterCreate): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.clusters.createCluster(cluster);

        if (response.ok) {
          await fetchClusters(); // Refresh the list
          return true;
        } else {
          setError("Failed to create cluster");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create cluster"
        );
        return false;
      }
    },
    [fetchClusters]
  );

  const updateCluster = useCallback(
    async (id: string, updates: Partial<Cluster>): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.clusters.updateCluster(id, updates);

        if (response.ok) {
          await fetchClusters(); // Refresh the list
          return true;
        } else {
          setError("Failed to update cluster");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update cluster"
        );
        return false;
      }
    },
    [fetchClusters]
  );

  const deleteCluster = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.clusters.deleteCluster(id);

        if (response.ok) {
          await fetchClusters(); // Refresh the list
          return true;
        } else {
          setError("Failed to delete cluster");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete cluster"
        );
        return false;
      }
    },
    [fetchClusters]
  );

  const addClusterMember = useCallback(
    async (
      clusterId: string,
      memberData: {
        suggestion_id?: string;
        document_id?: string;
        similarity?: number;
      }
    ): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.clusters.addClusterMember(
          clusterId,
          memberData
        );

        if (response.ok) {
          return true;
        } else {
          setError("Failed to add cluster member");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add cluster member"
        );
        return false;
      }
    },
    []
  );

  const removeClusterMember = useCallback(
    async (
      clusterId: string,
      memberId: string,
      memberType: "suggestion" | "document"
    ): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.clusters.removeClusterMember(
          clusterId,
          memberId,
          memberType
        );

        if (response.ok) {
          return true;
        } else {
          setError("Failed to remove cluster member");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove cluster member"
        );
        return false;
      }
    },
    []
  );

  const refreshClusters = useCallback(async () => {
    await fetchClusters();
  }, [fetchClusters]);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  return {
    clusters,
    loading,
    error,
    filters,
    setFilters,
    createCluster,
    updateCluster,
    deleteCluster,
    addClusterMember,
    removeClusterMember,
    clearError,
    refreshClusters,
  };
};
