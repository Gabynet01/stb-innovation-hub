import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "@/services";
import {
  Suggestion,
  SuggestionCreate,
  SuggestionFilters,
  EnhancedSuggestionFilters,
  SuggestionTopicAssociation,
} from "@/types/api";

interface UseSuggestionsReturn {
  suggestions: Suggestion[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  createSuggestion: (suggestion: SuggestionCreate) => Promise<void>;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => Promise<void>;
  deleteSuggestion: (id: string) => Promise<void>;
  filters: SuggestionFilters | EnhancedSuggestionFilters;
  setFilters: (filters: SuggestionFilters | EnhancedSuggestionFilters) => void;
  getSuggestionTopics: (
    suggestionId: string,
    minConfidence?: number
  ) => Promise<SuggestionTopicAssociation[] | null>;
  associateSuggestionWithTopic: (
    suggestionId: string,
    topicId: string,
    confidence?: number
  ) => Promise<boolean>;
  removeSuggestionFromTopic: (
    suggestionId: string,
    topicId: string
  ) => Promise<boolean>;
  getSuggestionProcessingStatus: (
    suggestionId: string
  ) => Promise<{ status: string; job_id?: string } | null>;
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

  const getSuggestionTopics = useCallback(
    async (
      suggestionId: string,
      minConfidence: number = 0.0
    ): Promise<SuggestionTopicAssociation[] | null> => {
      try {
        setError(null);
        const response = await apiService.suggestions.getSuggestionTopics(
          suggestionId,
          minConfidence
        );

        if (response.ok && response.data) {
          return response.data.topics;
        } else {
          setError("Failed to fetch suggestion topics");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch suggestion topics"
        );
        return null;
      }
    },
    []
  );

  const associateSuggestionWithTopic = useCallback(
    async (
      suggestionId: string,
      topicId: string,
      confidence: number = 0.5
    ): Promise<boolean> => {
      try {
        setError(null);
        const response =
          await apiService.suggestions.associateSuggestionWithTopic(
            suggestionId,
            topicId,
            confidence
          );

        if (response.ok) {
          await fetchSuggestions(); // Refresh to show updated associations
          return true;
        } else {
          setError("Failed to associate suggestion with topic");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to associate suggestion with topic"
        );
        return false;
      }
    },
    [fetchSuggestions]
  );

  const removeSuggestionFromTopic = useCallback(
    async (suggestionId: string, topicId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.suggestions.removeSuggestionFromTopic(
          suggestionId,
          topicId
        );

        if (response.ok) {
          await fetchSuggestions(); // Refresh to show updated associations
          return true;
        } else {
          setError("Failed to remove suggestion from topic");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to remove suggestion from topic"
        );
        return false;
      }
    },
    [fetchSuggestions]
  );

  const getSuggestionProcessingStatus = useCallback(
    async (
      suggestionId: string
    ): Promise<{ status: string; job_id?: string } | null> => {
      try {
        setError(null);
        const response =
          await apiService.suggestions.getSuggestionProcessingStatus(
            suggestionId
          );

        if (response.ok && response.data) {
          return response.data;
        } else {
          setError("Failed to fetch suggestion processing status");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch suggestion processing status"
        );
        return null;
      }
    },
    []
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
    getSuggestionTopics,
    associateSuggestionWithTopic,
    removeSuggestionFromTopic,
    getSuggestionProcessingStatus,
    clearError,
    refreshSuggestions,
  };
};
