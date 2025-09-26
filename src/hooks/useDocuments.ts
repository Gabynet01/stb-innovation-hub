import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import { Document, DocumentCreate, DocumentFilters } from "@/types/api";

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  filters: DocumentFilters;
  setFilters: (filters: DocumentFilters) => void;
  createDocument: (document: DocumentCreate) => Promise<boolean>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  generateDocumentFromCluster: (
    clusterId: string,
    templateId: string,
    title?: string,
    renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
  ) => Promise<boolean>;
  generateDocumentFromTopic: (
    topicId: string,
    templateId: string,
    title?: string,
    renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
  ) => Promise<boolean>;
  exportDocument: (
    documentId: string,
    format?: "pdf" | "docx" | "html" | "txt" | "md"
  ) => Promise<Blob | null>;
  getDocumentRelationships: (documentId: string) => Promise<any | null>;
  getDocumentVersions: (documentId: string) => Promise<Document[] | null>;
  clearError: () => void;
  refreshDocuments: () => Promise<void>;
}

export const useDocuments = (): UseDocumentsReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentFilters>({
    template_id: undefined,
    status: undefined,
    page: 1,
    page_size: 50,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.documents.getDocuments(filters);
      if (response.ok && response.data) {
        setDocuments(response.data);
      } else {
        setError("Failed to fetch documents");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createDocument = useCallback(
    async (document: DocumentCreate): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.documents.createDocument(document);

        if (response.ok) {
          await fetchDocuments(); // Refresh the list
          return true;
        } else {
          setError("Failed to create document");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create document"
        );
        return false;
      }
    },
    [fetchDocuments]
  );

  const updateDocument = useCallback(
    async (id: string, updates: Partial<Document>): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.documents.updateDocument(id, updates);

        if (response.ok) {
          await fetchDocuments(); // Refresh the list
          return true;
        } else {
          setError("Failed to update document");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update document"
        );
        return false;
      }
    },
    [fetchDocuments]
  );

  const deleteDocument = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.documents.deleteDocument(id);

        if (response.ok) {
          await fetchDocuments(); // Refresh the list
          return true;
        } else {
          setError("Failed to delete document");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete document"
        );
        return false;
      }
    },
    [fetchDocuments]
  );

  const generateDocumentFromCluster = useCallback(
    async (
      clusterId: string,
      templateId: string,
      title?: string,
      renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
    ): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.documents.generateDocumentFromCluster(
          clusterId,
          templateId,
          title,
          renderFormat
        );

        if (response.ok) {
          await fetchDocuments(); // Refresh the list
          return true;
        } else {
          setError("Failed to generate document from cluster");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate document from cluster"
        );
        return false;
      }
    },
    [fetchDocuments]
  );

  const generateDocumentFromTopic = useCallback(
    async (
      topicId: string,
      templateId: string,
      title?: string,
      renderFormat?: "PDF" | "DOCX" | "HTML" | "TXT" | "MD"
    ): Promise<boolean> => {
      try {
        setError(null);
        const response = await apiService.documents.generateDocumentFromTopic(
          topicId,
          templateId,
          title,
          renderFormat
        );

        if (response.ok) {
          await fetchDocuments(); // Refresh the list
          return true;
        } else {
          setError("Failed to generate document from topic");
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate document from topic"
        );
        return false;
      }
    },
    [fetchDocuments]
  );

  const exportDocument = useCallback(
    async (
      documentId: string,
      format: "pdf" | "docx" | "html" | "txt" | "md" = "pdf"
    ): Promise<Blob | null> => {
      try {
        setError(null);
        const blob = await apiService.documents.exportDocument(
          documentId,
          format
        );
        return blob;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to export document"
        );
        return null;
      }
    },
    []
  );

  const getDocumentRelationships = useCallback(
    async (documentId: string): Promise<any | null> => {
      try {
        setError(null);
        const response = await apiService.documents.getDocumentRelationships(
          documentId
        );

        if (response.ok && response.data) {
          return response.data;
        } else {
          setError("Failed to fetch document relationships");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch document relationships"
        );
        return null;
      }
    },
    []
  );

  const getDocumentVersions = useCallback(
    async (documentId: string): Promise<Document[] | null> => {
      try {
        setError(null);
        const response = await apiService.documents.getDocumentVersions(
          documentId
        );

        if (response.ok && response.data) {
          return response.data;
        } else {
          setError("Failed to fetch document versions");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch document versions"
        );
        return null;
      }
    },
    []
  );

  const refreshDocuments = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    filters,
    setFilters,
    createDocument,
    updateDocument,
    deleteDocument,
    generateDocumentFromCluster,
    generateDocumentFromTopic,
    exportDocument,
    getDocumentRelationships,
    getDocumentVersions,
    clearError,
    refreshDocuments,
  };
};
