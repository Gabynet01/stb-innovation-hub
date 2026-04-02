import { useState, useEffect, useCallback, useRef } from "react";
import { apiService, ApiError } from "@/services";
import {
  Idea,
  IdeaCreate,
  IdeaFilters,
  EnhancedIdeaFilters,
  DEFAULT_IDEA_FILTERS,
} from "@/types/api";

interface UseIdeasReturn {
  ideas: Idea[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  createIdea: (idea: IdeaCreate) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  filters: IdeaFilters | EnhancedIdeaFilters;
  setFilters: (filters: IdeaFilters | EnhancedIdeaFilters) => void;
  clearError: () => void;
  refreshIdeas: () => Promise<void>;
  /** Re-fetch ideas without toggling loading (background refresh). */
  silentlyRefreshIdeas: () => Promise<void>;
}

export type UseIdeasOptions = {
  /** When false, skip listing / refreshing ideas (guest submit-only). Default true. */
  listIdeasEnabled?: boolean;
};

export const useIdeas = (options?: UseIdeasOptions): UseIdeasReturn => {
  const listIdeasEnabled = options?.listIdeasEnabled !== false;
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IdeaFilters>(DEFAULT_IDEA_FILTERS);

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchIdeas = useCallback(async (silent = false) => {
    if (!listIdeasEnabled) return;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const response = await apiService.ideas.listIdeas({
        ...filters,
        with_assessments: true,
      });
      if (response.ok && response.data) {
        setIdeas(response.data);
      } else if (!silent) {
        setError("Failed to fetch ideas");
      }
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Failed to fetch ideas");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [filters, listIdeasEnabled]);

  const createIdea = useCallback(
    async (idea: IdeaCreate) => {
      try {
        setSubmitting(true);
        setError(null);
        const response = await apiService.ideas.createIdea(idea);
        if (response.ok) {
          if (listIdeasEnabled) {
            await fetchIdeas(true);
          }
          return;
        }
        const msg = "Failed to create idea";
        setError(msg);
        throw new ApiError(msg);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to create idea"
          );
        }
        throw err instanceof Error ? err : new ApiError(String(err));
      } finally {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    },
    [fetchIdeas, listIdeasEnabled]
  );

  const updateIdea = useCallback(
    async (id: string, updates: Partial<Idea>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.ideas.updateIdea(id, {
          ...updates,
          body: updates.body,
          category_id: updates.category_id,
          source_id: updates.source_id,
        });
        if (response.ok) {
          await fetchIdeas(true);
          return;
        }
        const msg = "Failed to update idea";
        setError(msg);
        throw new ApiError(msg);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update idea"
        );
        throw err instanceof Error ? err : new ApiError(String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetchIdeas]
  );

  const deleteIdea = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.ideas.deleteIdea(id);
        if (response.ok) {
          await fetchIdeas(true);
          return;
        }
        const msg = "Failed to delete idea";
        setError(msg);
        throw new ApiError(msg);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete idea"
        );
        throw err instanceof Error ? err : new ApiError(String(err));
      } finally {
        setLoading(false);
      }
    },
    [fetchIdeas]
  );

  const refreshIdeas = useCallback(async () => {
    await fetchIdeas(false);
  }, [fetchIdeas]);

  const silentlyRefreshIdeas = useCallback(async () => {
    await fetchIdeas(true);
  }, [fetchIdeas]);

  useEffect(() => {
    if (!listIdeasEnabled) {
      setLoading(false);
      return;
    }
    void fetchIdeas(false);
  }, [fetchIdeas, listIdeasEnabled]);

  return {
    ideas,
    loading,
    submitting,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    filters,
    setFilters,
    clearError,
    refreshIdeas,
    silentlyRefreshIdeas,
  };
};
