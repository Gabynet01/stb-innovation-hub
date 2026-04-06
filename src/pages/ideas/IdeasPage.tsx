import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Idea, IdeaCreate, DEFAULT_IDEA_FILTERS } from '@/types/api';
import { useIdeas, useSoftRefresh } from '@/hooks';
import { IdeasListView, IdeaFormView, IdeaDetailView } from './components';
import { useSnackbar, ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import type { IdeaFormData } from '@/hooks';
import type {
  IdeahubIdeaAssessment,
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
  IdeahubIdeaStatus,
} from '@/types/ideahub';
import { mapAssessment } from '@/services/ideaHubMappers';

export const IdeasPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Read once at mount so useIdeas fetches with the right filter from the start
  const [initialStatus] = useState(() => searchParams.get('ideahub_status') || '');

  const {
    ideas,
    loading: ideasLoading,
    error,
    filters,
    createIdea,
    updateIdea,
    deleteIdea,
    setFilters,
    clearError,
    refreshIdeas,
    silentlyRefreshIdeas,
  } = useIdeas({
    listIdeasEnabled: isAuthenticated,
    initialFilters: initialStatus ? { ideahub_status: initialStatus } : undefined,
  });

  const { showSnackbar } = useSnackbar();
  const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [sources, setSources] = useState<IdeahubIdeaSource[]>([]);
  const [categories, setCategories] = useState<IdeahubIdeaCategory[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  /** Remount guest form after successful submit so fields reset. */
  const [guestFormKey, setGuestFormKey] = useState(0);

  const ideaIdFromUrl = searchParams.get('ideaId');

  /** Clean ideahub_status from URL after mount so it doesn't stick. */
  useEffect(() => {
    if (!searchParams.has('ideahub_status')) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('ideahub_status');
      return next;
    }, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  useSoftRefresh(
    () => void silentlyRefreshIdeas(),
    view === 'list' && isAuthenticated
  );

  const loadCatalog = useCallback(async () => {
    try {
      const [srcRes, catRes] = await Promise.all([
        apiService.catalog.listSources(),
        apiService.catalog.listCategories(),
      ]);
      if (srcRes.ok && srcRes.data) setSources(srcRes.data);
      if (catRes.ok && catRes.data) setCategories(catRes.data);
      if (srcRes.ok && catRes.ok) {
        setCatalogError(null);
        return;
      }
      setCatalogError('Could not load idea sources or categories');
    } catch {
      setCatalogError('Could not load catalog');
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const handleRetryAfterError = useCallback(() => {
    clearError();
    setCatalogError(null);
    void refreshIdeas();
    void loadCatalog();
  }, [clearError, refreshIdeas, loadCatalog]);

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'form') {
      setView('form');
      setSelectedIdea(null);
    }
  }, [searchParams]);

  /** Guests only see the submission form, not list or detail. */
  useEffect(() => {
    if (isAuthenticated) return;
    if (view === 'list' || view === 'detail') {
      setView('form');
      setSelectedIdea(null);
      setSearchParams({ view: 'form' }, { replace: true });
    }
  }, [isAuthenticated, view, setSearchParams]);

  useEffect(() => {
    if (view !== 'detail' || !selectedIdea) return;
    const next = ideas.find((i) => i.id === selectedIdea.id);
    if (next) setSelectedIdea(next);
  }, [ideas, view, selectedIdea]);

  /** Open idea detail when staff land with `/ideas?ideaId=` (e.g. from similar ideas or Documents). */
  useEffect(() => {
    if (!isAuthenticated || !ideaIdFromUrl?.trim()) return;
    const id = ideaIdFromUrl.trim();
    if (view === 'detail' && selectedIdea?.id === id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiService.ideas.getIdea(id);
        if (cancelled) return;
        if (res.ok && res.data) {
          setSelectedIdea(res.data);
          setView('detail');
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, ideaIdFromUrl, view, selectedIdea?.id]);

  /** Return to list when ideaId is removed from the URL (e.g. sidebar click). */
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!ideaIdFromUrl && view === 'detail') {
      setView('list');
      setSelectedIdea(null);
    }
  }, [isAuthenticated, ideaIdFromUrl, view]);

  const renderConfirmationModal = () => {
    if (!confirmation) return null;

    return (
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
      />
    );
  };

  const handleSubmitIdea = async (form: IdeaFormData) => {
    setFormLoading(true);

    try {
      const payload: IdeaCreate = {
        source_id: form.source_id,
        category_id: form.category_id,
        title: form.title,
        body: form.body,
        contact: form.contact,
        attachments: form.attachments,
      };

      if (selectedIdea) {
        await updateIdea(selectedIdea.id, {
          source_id: payload.source_id,
          category_id: payload.category_id,
          title: payload.title,
          body: payload.body,
          contact: {
            email: payload.contact.email,
            phone: payload.contact.phone,
          },
          attachments: payload.attachments as Idea['attachments'],
        });

        showSnackbar({
          type: 'success',
          title: 'Idea updated',
          message: 'Your changes were saved.',
          duration: 4000,
        });
        setView('list');
        setSelectedIdea(null);
      } else {
        await createIdea(payload);

        showSnackbar({
          type: 'success',
          title: 'Idea submitted',
          message: 'Thank you — we will review your submission.',
          duration: 5000,
        });

        if (isAuthenticated) {
          setView('list');
          setSelectedIdea(null);
        } else {
          setSelectedIdea(null);
          setGuestFormKey((k) => k + 1);
          setSearchParams({ view: 'form' }, { replace: true });
        }
      }
    } catch (err) {
      console.error('Failed to submit idea:', err);

      showSnackbar({
        type: 'error',
        title: 'Submission failed',
        message:
          err instanceof Error ? err.message : 'Please try again shortly.',
        duration: 6000,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setView('form');
    setFormLoading(false);
  };

  const handleViewIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setView('detail');
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('ideaId', idea.id);
        return next;
      },
      { replace: true }
    );
  };

  const handleDeleteIdea = async (id: string) => {
    showConfirmation(
      {
        title: 'Confirm deletion',
        message:
          'Are you sure you want to delete this idea? This action cannot be undone.',
        type: 'danger',
      },
      async () => {
        try {
          await deleteIdea(id);
          showSnackbar({
            type: 'success',
            title: 'Deleted',
            message: 'The idea was removed.',
            duration: 4000,
          });
          hideConfirmation();
        } catch (e) {
          console.error('Failed to delete:', e);
          showSnackbar({
            type: 'error',
            title: 'Delete failed',
            message: 'Could not delete this idea.',
            duration: 6000,
          });
          hideConfirmation();
        }
      }
    );
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedIdea(null);
    setFormLoading(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('ideaId');
      return next;
    });
  };

  const handleFormCancel = () => {
    if (isAuthenticated) {
      handleBackToList();
    } else {
      navigate('/login');
    }
  };

  const handleOpenForm = () => {
    setView('form');
    setFormLoading(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('ideaId');
      return next;
    });
  };

  const handleToggleFilters = () => setShowFilters(!showFilters);
  const handleClearFilters = () =>
    setFilters({ ...DEFAULT_IDEA_FILTERS });

  const handleAssessmentSaved = useCallback(
    (assessment: IdeahubIdeaAssessment) => {
      const normalized = mapAssessment(assessment);
      if (!normalized) return;
      setSelectedIdea((prev) => {
        if (!prev || prev.id !== String(normalized.idea_id)) return prev;
        return { ...prev, assessment: normalized };
      });
      void silentlyRefreshIdeas();
    },
    [silentlyRefreshIdeas]
  );

  const handleStatusChange = useCallback(
    async (status: IdeahubIdeaStatus) => {
      if (!selectedIdea) return;
      try {
        const res = await apiService.ideas.updateIdeaStatus(selectedIdea.id, status);
        if (res.ok && res.data) {
          setSelectedIdea(res.data);
          showSnackbar({
            type: 'success',
            title: 'Status updated',
            message: `Idea moved to ${status.replace(/_/g, ' ')}.`,
            duration: 4000,
          });
          void silentlyRefreshIdeas();
        }
      } catch (err) {
        showSnackbar({
          type: 'error',
          title: 'Status update failed',
          message: err instanceof Error ? err.message : 'Please try again.',
          duration: 6000,
        });
        throw err;
      }
    },
    [selectedIdea, showSnackbar, silentlyRefreshIdeas]
  );

  const listError = error || catalogError;

  return (
    <>
      {view === 'form' && (
        <IdeaFormView
          key={isAuthenticated ? 'staff-idea-form' : `guest-${guestFormKey}`}
          sources={sources}
          categories={categories}
          selectedIdea={selectedIdea}
          onSubmit={handleSubmitIdea}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}

      {view === 'detail' && selectedIdea && (
        <IdeaDetailView
          selectedIdea={selectedIdea}
          onEdit={handleEditIdea}
          onDelete={handleDeleteIdea}
          onBack={handleBackToList}
          onAssessmentSaved={handleAssessmentSaved}
          onStatusChange={handleStatusChange}
        />
      )}

      {view === 'list' && (
        <IdeasListView
          ideas={ideas}
          loading={ideasLoading}
          error={listError}
          filters={filters}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
          onNewIdea={handleOpenForm}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          onClearError={handleRetryAfterError}
          onView={handleViewIdea}
          onEdit={handleEditIdea}
          onDelete={handleDeleteIdea}
          sources={sources}
          categories={categories}
        />
      )}

      {renderConfirmationModal()}
    </>
  );
};
