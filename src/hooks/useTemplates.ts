import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import { Template, TemplateCreate, TemplateFilters } from "@/types/api";

interface UseTemplatesReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  filters: TemplateFilters;
  setFilters: (filters: TemplateFilters) => void;
  createTemplate: (template: TemplateCreate) => Promise<boolean>;
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
  uploadTemplate: (data: {
    file: File;
    template_name: string;
    template_description?: string;
    version: string;
    kind: string;
  }) => Promise<boolean>;
  getTemplateKinds: () => Promise<string[] | null>;
  clearError: () => void;
  refreshTemplates: () => Promise<void>;
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    kind: undefined,
    active_only: true,
    search: undefined,
    page: 1,
    page_size: 50,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.templates.getTemplates(filters);
      if (response.ok && response.data) {
        setTemplates(response.data);
      } else {
        setError("Failed to fetch templates");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch templates"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTemplate = useCallback(
    async (template: TemplateCreate): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.templates.createTemplate(template);

        if (response.ok) {
          await fetchTemplates(); // Refresh the list
          return true;
        } else {
          setError("Failed to create template");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create template"
        );
        return false;
      }
    },
    [fetchTemplates]
  );

  const updateTemplate = useCallback(
    async (id: string, updates: Partial<Template>): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.templates.updateTemplate(id, updates);

        if (response.ok) {
          await fetchTemplates(); // Refresh the list
          return true;
        } else {
          setError("Failed to update template");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update template"
        );
        return false;
      }
    },
    [fetchTemplates]
  );

  const deleteTemplate = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.templates.deleteTemplate(id);

        if (response.ok) {
          await fetchTemplates(); // Refresh the list
          return true;
        } else {
          setError("Failed to delete template");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete template"
        );
        return false;
      }
    },
    [fetchTemplates]
  );

  const uploadTemplate = useCallback(
    async (data: {
      file: File;
      template_name: string;
      template_description?: string;
      version: string;
      kind: string;
    }): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.templates.uploadTemplate(data);

        if (response.ok) {
          await fetchTemplates(); // Refresh the list
          return true;
        } else {
          setError("Failed to upload template");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload template"
        );
        return false;
      }
    },
    [fetchTemplates]
  );

  const getTemplateKinds = useCallback(async (): Promise<string[] | null> => {
    try {
      setError(null);
      const response = await apiService.templates.getTemplateKinds();

      if (response.ok && response.data) {
        return response.data;
      } else {
        setError("Failed to fetch template kinds");
        return null;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch template kinds"
      );
      return null;
    }
  }, []);

  const refreshTemplates = useCallback(async () => {
    await fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    filters,
    setFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    uploadTemplate,
    getTemplateKinds,
    clearError,
    refreshTemplates,
  };
};
