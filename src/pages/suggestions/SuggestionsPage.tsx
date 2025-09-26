import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Suggestion } from '@/types/api';
import { useSuggestions } from '@/hooks/useSuggestions';
import { ListView, FormView, DetailView } from './components';
import { useSnackbar, ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
import { TopicAssociationManager } from '@/components/TopicAssociationManager';

export const SuggestionsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {
        suggestions,
        loading: suggestionsLoading,
        error,
        filters,
        createSuggestion,
        updateSuggestion,
        deleteSuggestion,
        setFilters,
        clearError,
        refreshSuggestions
    } = useSuggestions();

    const { showSnackbar } = useSnackbar();
    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();
    const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [showTopicManager, setShowTopicManager] = useState(false);
    const [suggestionForTopics, setSuggestionForTopics] = useState<Suggestion | null>(null);

    // Check URL query parameter to automatically show form
    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam === 'form') {
            setView('form');
            setSelectedSuggestion(null);
        }
    }, [searchParams]);

    // Single confirmation modal for all views
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

    const handleSubmitSuggestion = async (suggestionData: any) => {
        setFormLoading(true);

        try {
            if (selectedSuggestion) {
                const updateData = {
                    author_type: suggestionData.author_type,
                    category: suggestionData.category,
                    title: suggestionData.title,
                    body: suggestionData.body,
                    contact: suggestionData.contact,
                    attachments: suggestionData.attachments
                };
                await updateSuggestion(selectedSuggestion.id, updateData);

                showSnackbar({
                    type: 'success',
                    title: 'Suggestion Updated!',
                    message: 'Your suggestion has been successfully updated.',
                    duration: 4000
                });
            } else {
                await createSuggestion(suggestionData);

                showSnackbar({
                    type: 'success',
                    title: 'Suggestion Submitted!',
                    message: 'Thank you for sharing your idea. We\'ll review it soon.',
                    duration: 5000
                });
            }

            setView('list');
            setSelectedSuggestion(null);
        } catch (error) {
            console.error('Failed to submit suggestion:', error);

            showSnackbar({
                type: 'error',
                title: 'Submission Failed',
                message: 'There was an error submitting your suggestion. Please try again.',
                duration: 6000
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSuggestion = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setView('form');
        setFormLoading(false);
    };

    const handleViewSuggestion = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setView('detail');
    };

    const handleManageTopics = (suggestion: Suggestion) => {
        setSuggestionForTopics(suggestion);
        setShowTopicManager(true);
    };

    const handleCloseTopicManager = () => {
        setShowTopicManager(false);
        setSuggestionForTopics(null);
    };

    const handleDeleteSuggestion = async (id: string) => {
        showConfirmation({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this suggestion? This action cannot be undone.',
            type: 'danger'
        }, async () => {
            try {
                await deleteSuggestion(id);
                showSnackbar({
                    type: 'success',
                    title: 'Suggestion Deleted',
                    message: 'The suggestion has been successfully removed.',
                    duration: 4000
                });
                // Close the confirmation modal after successful deletion
                hideConfirmation();
            } catch (error) {
                console.error('Failed to delete suggestion:', error);

                showSnackbar({
                    type: 'error',
                    title: 'Delete Failed',
                    message: 'There was an error deleting the suggestion. Please try again.',
                    duration: 6000
                });
                // Close the confirmation modal even if deletion failed
                hideConfirmation();
            }
        });
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedSuggestion(null);
        setFormLoading(false);
        setSearchParams({});
    };

    const handleOpenForm = () => {
        setView('form');
        setFormLoading(false);
    };

    const handleToggleFilters = () => setShowFilters(!showFilters);
    const handleClearFilters = () => setFilters({});

    // Cluster and Topic navigation handlers
    const handleClusterClick = (clusterId: string) => {
        navigate(`/clusters?highlight=${clusterId}`);
    };

    const handleTopicClick = (topicId: string) => {
        navigate(`/topics?highlight=${topicId}`);
    };

    // Single confirmation modal for all views - rendered outside conditional logic
    return (
        <>
            {view === 'form' && (
                <FormView
                    selectedSuggestion={selectedSuggestion}
                    onSubmit={handleSubmitSuggestion}
                    onCancel={handleBackToList}
                    loading={formLoading}
                />
            )}

            {view === 'detail' && selectedSuggestion && (
                <DetailView
                    selectedSuggestion={selectedSuggestion}
                    onEdit={handleEditSuggestion}
                    onDelete={handleDeleteSuggestion}
                    onBack={handleBackToList}
                />
            )}

            {view === 'list' && (
                <ListView
                    suggestions={suggestions}
                    loading={suggestionsLoading}
                    error={error}
                    filters={filters}
                    showFilters={showFilters}
                    onToggleFilters={handleToggleFilters}
                    onRefresh={refreshSuggestions}
                    onNewSuggestion={handleOpenForm}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                    onClearError={clearError}
                    onView={handleViewSuggestion}
                    onEdit={handleEditSuggestion}
                    onDelete={handleDeleteSuggestion}
                    onClusterClick={handleClusterClick}
                    onManageTopics={handleManageTopics}
                    onTopicClick={handleTopicClick}
                />
            )}

            {/* Single confirmation modal for all views */}
            {renderConfirmationModal()}

            {/* Topic Association Manager Modal */}
            {showTopicManager && suggestionForTopics && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Manage Topic Associations
                                </h2>
                                <button
                                    onClick={handleCloseTopicManager}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <TopicAssociationManager
                                suggestion={suggestionForTopics}
                                onClose={handleCloseTopicManager}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 