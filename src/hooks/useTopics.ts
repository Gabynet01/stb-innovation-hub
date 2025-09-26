import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import {
  Topic,
  TopicCreate,
  TopicFilters,
  TopicSuggestionAssociation,
} from "@/types/api";

interface UseTopicsReturn {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  filters: TopicFilters;
  setFilters: (filters: TopicFilters) => void;
  createTopic: (topic: TopicCreate) => Promise<boolean>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<boolean>;
  deleteTopic: (id: string) => Promise<boolean>;
  getTopicSuggestions: (
    topicId: string,
    minConfidence?: number
  ) => Promise<TopicSuggestionAssociation[] | null>;
  associateSuggestionWithTopic: (
    topicId: string,
    suggestionId: string,
    confidence?: number
  ) => Promise<boolean>;
  removeSuggestionFromTopic: (
    topicId: string,
    suggestionId: string
  ) => Promise<boolean>;
  clearError: () => void;
  refreshTopics: () => Promise<void>;
}

export const useTopics = (): UseTopicsReturn => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TopicFilters>({
    query: undefined,
    min_support: undefined,
    page: 1,
    page_size: 50,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.topics.getTopics(filters);
      if (response.ok && response.data) {
        setTopics(response.data);
      } else {
        setError("Failed to fetch topics");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch topics");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTopic = useCallback(
    async (topic: TopicCreate): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.topics.createTopic(topic);

        if (response.ok) {
          await fetchTopics(); // Refresh the list
          return true;
        } else {
          setError("Failed to create topic");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create topic");
        return false;
      }
    },
    [fetchTopics]
  );

  const updateTopic = useCallback(
    async (id: string, updates: Partial<Topic>): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.topics.updateTopic(id, updates);

        if (response.ok) {
          await fetchTopics(); // Refresh the list
          return true;
        } else {
          setError("Failed to update topic");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update topic");
        return false;
      }
    },
    [fetchTopics]
  );

  const deleteTopic = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.topics.deleteTopic(id);

        if (response.ok) {
          await fetchTopics(); // Refresh the list
          return true;
        } else {
          setError("Failed to delete topic");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete topic");
        return false;
      }
    },
    [fetchTopics]
  );

  const getTopicSuggestions = useCallback(
    async (
      topicId: string,
      minConfidence: number = 0.0
    ): Promise<TopicSuggestionAssociation[] | null> => {
      try {
        setError(null);
        const response = await apiService.topics.getTopicSuggestions(
          topicId,
          minConfidence
        );

        if (response.ok && response.data) {
          return response.data.suggestions;
        } else {
          setError("Failed to fetch topic suggestions");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch topic suggestions"
        );
        return null;
      }
    },
    []
  );

  const associateSuggestionWithTopic = useCallback(
    async (
      topicId: string,
      suggestionId: string,
      confidence: number = 0.5
    ): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.topics.associateSuggestionWithTopic(
          topicId,
          suggestionId,
          confidence
        );

        if (response.ok) {
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
    []
  );

  const removeSuggestionFromTopic = useCallback(
    async (topicId: string, suggestionId: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.topics.removeSuggestionFromTopic(
          topicId,
          suggestionId
        );

        if (response.ok) {
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
    []
  );

  const refreshTopics = useCallback(async () => {
    await fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    loading,
    error,
    filters,
    setFilters,
    createTopic,
    updateTopic,
    deleteTopic,
    getTopicSuggestions,
    associateSuggestionWithTopic,
    removeSuggestionFromTopic,
    clearError,
    refreshTopics,
  };
};
