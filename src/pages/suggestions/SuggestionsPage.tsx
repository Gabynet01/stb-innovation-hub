import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Suggestion } from '@/types/api';
import { useSuggestions } from '@/hooks/useSuggestions';
import { ListView, FormView, DetailView } from './components';
import { useSnackbar, ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';

export const SuggestionsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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
                />
            )}

            {/* Single confirmation modal for all views */}
            {renderConfirmationModal()}
        </>
    );
}; 