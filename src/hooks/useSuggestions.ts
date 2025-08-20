import { useState, useEffect, useCallback, useRef } from "react";
import { apiService } from "@/services";
import {
  Suggestion,
  SuggestionCreate,
  SuggestionFilters,
  AuthorType,
  Category,
} from "@/types/api";

interface UseSuggestionsReturn {
  suggestions: Suggestion[];
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SuggestionFilters>({
    page: 1,
    page_size: 20,
  });

  // Debug loading state changes
  useEffect(() => {
    console.log("Loading state changed to:", loading);
  }, [loading]);

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
    if (!isMountedRef.current) return;

    console.log("fetchSuggestions called, setting loading to true");
    setLoading(true);
    setError(null);

    // Try to fetch from API first
    let apiSuccess = false;
    try {
      console.log("Attempting API call...");
      const response = await apiService.suggestions.getSuggestions(filters);
      if (response.ok && response.data) {
        console.log("API call successful, setting suggestions");
        setSuggestions(response.data);
        apiSuccess = true;
      }
    } catch (err) {
      console.log("API call failed, using mock data:", err);
    }

    // Fallback to mock data if API fails
    if (!apiSuccess) {
      console.log("Setting mock data...");
      // Add a small delay to show loading state briefly
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data that matches EXACTLY what the API spec defines
      // Based on SuggestionCreate schema: author_type, category, title, body, contact, attachments
      const mockSuggestions: Suggestion[] = [
        {
          id: "1",
          author_type: AuthorType.STAFF,
          category: Category.UX,
          title: "Mobile App Dark Mode",
          body: "Add a dark mode option to the mobile banking app to improve user experience in low-light conditions and reduce eye strain.",
          contact: {
            email: "john.doe@stanbic.co.zm",
            phone: "+260211123456",
          },
          attachments: null,
        },
        {
          id: "2",
          author_type: AuthorType.CUSTOMER,
          category: Category.PRODUCT,
          title: "Biometric Authentication",
          body: "Implement fingerprint and face recognition for secure login to enhance security and user convenience.",
          contact: {
            email: "jane.smith@email.com",
            phone: "+260955789012",
          },
          attachments: null,
        },
        {
          id: "3",
          author_type: AuthorType.STAFF,
          category: Category.SERVICE,
          title: "24/7 Chat Support",
          body: "Implement AI-powered chatbot support available 24/7 to provide instant assistance to customers.",
          contact: {
            email: "support.team@stanbic.co.zm",
            phone: "+260211123457",
          },
          attachments: null,
        },
        {
          id: "4",
          author_type: AuthorType.CUSTOMER,
          category: Category.OPERATIONAL,
          title: "Digital Document Management",
          body: "Create a centralized digital document management system for loan applications, reducing paper waste and improving processing times.",
          contact: {
            email: "michael.banda@email.com",
            phone: "+260977456789",
          },
          attachments: null,
        },
        {
          id: "5",
          author_type: AuthorType.STAFF,
          category: Category.OTHER,
          title: "Voice Banking Integration",
          body: "Integrate voice commands and speech recognition for banking operations, allowing customers to check balances and transfer funds using voice commands.",
          contact: {
            email: "tech.innovation@stanbic.co.zm",
            phone: "+260211123458",
          },
          attachments: null,
        },
      ];

      console.log("Mock data set, about to set loading to false");
      setSuggestions(mockSuggestions);
    }

    console.log("Setting loading to false");
    if (isMountedRef.current) {
      setLoading(false);
    }
  }, [filters]);

  const createSuggestion = useCallback(
    async (suggestion: SuggestionCreate) => {
      if (!isMountedRef.current) return;

      try {
        setLoading(true);
        setError(null);

        try {
          const response = await apiService.suggestions.createSuggestion(
            suggestion
          );
          if (response.ok) {
            // Refresh the list to show the new suggestion
            await fetchSuggestions();
            return;
          }
        } catch (err) {
          console.log("API call failed, adding to mock data:", err);
        }

        // Fallback: add to mock data if API fails
        const newSuggestion: Suggestion = {
          ...suggestion,
          id: Date.now().toString(),
        };

        setSuggestions((prev) => [newSuggestion, ...prev]);
      } catch (err) {
        if (isMountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Failed to create suggestion"
          );
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [fetchSuggestions]
  );

  const updateSuggestion = useCallback(
    async (id: string, updates: Partial<Suggestion>) => {
      if (!isMountedRef.current) return;

      try {
        setLoading(true);
        setError(null);

        try {
          const response = await apiService.suggestions.updateSuggestion(
            id,
            updates
          );
          if (response.ok) {
            // Update the suggestion in the local state
            setSuggestions((prev) =>
              prev.map((suggestion) =>
                suggestion.id === id
                  ? { ...suggestion, ...updates }
                  : suggestion
              )
            );
            return;
          }
        } catch (err) {
          console.log("API call failed, updating mock data:", err);
        }

        // Fallback: update mock data if API fails
        setSuggestions((prev) =>
          prev.map((suggestion) =>
            suggestion.id === id ? { ...suggestion, ...updates } : suggestion
          )
        );
      } catch (err) {
        if (isMountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Failed to update suggestion"
          );
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  const deleteSuggestion = useCallback(async (id: string) => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.suggestions.deleteSuggestion(id);
        if (response.ok) {
          // Remove the suggestion from local state
          setSuggestions((prev) =>
            prev.filter((suggestion) => suggestion.id !== id)
          );
          return;
        }
      } catch (err) {
        console.log("API call failed, removing from mock data:", err);
      }

      // Fallback: remove from mock data if API fails
      setSuggestions((prev) =>
        prev.filter((suggestion) => suggestion.id !== id)
      );
    } catch (err) {
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Failed to delete suggestion"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const refreshSuggestions = useCallback(async () => {
    await fetchSuggestions();
  }, [fetchSuggestions]);

  // Fetch suggestions when filters change
  useEffect(() => {
    fetchSuggestions();

    // Fallback timeout to ensure loading state doesn't get stuck
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, forcing loading to false");
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeoutId);
  }, [fetchSuggestions, loading]);

  return {
    suggestions,
    loading,
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
