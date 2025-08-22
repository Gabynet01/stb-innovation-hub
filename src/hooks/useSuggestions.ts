import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "@/services";
import { Suggestion, SuggestionCreate, SuggestionFilters } from "@/types/api";

interface UseSuggestionsReturn {
  suggestions: Suggestion[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  createSuggestion: (suggestion: SuggestionCreate) => Promise<void>;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => Promise<void>;
  deleteSuggestion: (id: string) => Promise<void>;
  filters: SuggestionFilters;
  setFilters: (filters: SuggestionFilters) => void;
  clearError: () => void;
  refreshSuggestions: () => Promise<void>;
}

export const useSuggestions = (): UseSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SuggestionFilters>({
    search: "",
    author_type: "",
    category: "",
    status: "",
    language: "",
    tag: "",
    page: 1,
    page_size: 20,
  });

  // Use ref to track if component is mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.suggestions.getSuggestions(filters);
      if (response.ok && response.data) {
        setSuggestions(response.data);
      } else {
        setError("Failed to fetch suggestions");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch suggestions"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createSuggestion = useCallback(
    async (suggestion: SuggestionCreate) => {
      try {
        setSubmitting(true);
        setError(null);

        const response = await apiService.suggestions.createSuggestion(
          suggestion
        );

        if (response.ok) {
          // Refresh the list to show the new suggestion
          await fetchSuggestions();
        } else {
          // Try to get more specific error information from the response
          let errorMessage = "Failed to create suggestion";
          if (
            response.data &&
            typeof response.data === "object" &&
            "message" in response.data
          ) {
            errorMessage = response.data.message as string;
          } else if (
            response.meta &&
            typeof response.meta === "object" &&
            "message" in response.meta
          ) {
            errorMessage = response.meta.message as string;
          }
          setError(errorMessage);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create suggestion"
        );
      } finally {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    },
    [fetchSuggestions]
  );

  const updateSuggestion = useCallback(
    async (id: string, updates: Partial<Suggestion>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.suggestions.updateSuggestion(
          id,
          updates
        );
        if (response.ok) {
          // Refresh the list to get updated data
          await fetchSuggestions();
        } else {
          setError("Failed to update suggestion");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update suggestion"
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchSuggestions]
  );

  const deleteSuggestion = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.suggestions.deleteSuggestion(id);
        if (response.ok) {
          // Refresh the list to get updated data
          await fetchSuggestions();
        } else {
          setError("Failed to delete suggestion");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete suggestion"
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchSuggestions]
  );

  const refreshSuggestions = useCallback(async () => {
    await fetchSuggestions();
  }, [fetchSuggestions]);

  // Fetch suggestions when filters change
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    submitting,
    error,
    createSuggestion,
    updateSuggestion,
    deleteSuggestion,
    filters,
    setFilters,
    clearError,
    refreshSuggestions,
  };
};
