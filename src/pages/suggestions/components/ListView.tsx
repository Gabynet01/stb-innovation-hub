import React from 'react';
import { SuggestionsHeader } from './SuggestionsHeader';
import { SuggestionsStats } from './SuggestionsStats';
import { SuggestionsFilters } from './SuggestionsFilters';
import { SuggestionList } from './SuggestionList';
import { ErrorState, LoadingSpinner } from '@/components/ui';
import { Suggestion, SuggestionFilters } from '@/types/api';

interface ListViewProps {
    suggestions: Suggestion[];
    loading: boolean;
    error: string | null;
    filters: SuggestionFilters;
    showFilters: boolean;
    onToggleFilters: () => void;
    onRefresh: () => void;
    onNewSuggestion: () => void;
    onFiltersChange: (filters: SuggestionFilters) => void;
    onClearFilters: () => void;
    onClearError: () => void;
    onView: (suggestion: Suggestion) => void;
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => Promise<void>;
}

export const ListView: React.FC<ListViewProps> = ({
    suggestions,
    loading,
    error,
    filters,
    showFilters,
    onToggleFilters,
    onRefresh,
    onNewSuggestion,
    onFiltersChange,
    onClearFilters,
    onClearError,
    onView,
    onEdit,
    onDelete
}) => {


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Header Section */}
            <SuggestionsHeader
                showFilters={showFilters}
                onToggleFilters={onToggleFilters}
                onRefresh={onRefresh}
                onNewSuggestion={onNewSuggestion}
                loading={loading}
            />

            <div className="max-w-7xl mx-auto">
                {/* Stats Section - Compact */}
                <div className="py-6">
                    <SuggestionsStats suggestions={suggestions} />
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="mb-8">
                        <SuggestionsFilters
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                            onClearFilters={onClearFilters}
                        />
                    </div>
                )}

                {/* Main Content */}
                <div className="pb-12">
                    {error && (
                        <div className="mb-8">
                            <ErrorState
                                error={error}
                                title="Error loading suggestions"
                                onRetry={onClearError}
                                retryText="Dismiss"
                                size="sm"
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <LoadingSpinner size="md" color="primary" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-700">
                                    Loading suggestions...
                                </h3>
                                <p className="text-slate-500">
                                    Please wait while we fetch your data
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Empty State Only */}
                            {suggestions.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center">
                                                <div className="w-6 h-6 bg-white rounded-lg opacity-80" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-bold text-slate-700">
                                            No ideas shared yet
                                        </h2>
                                        <p className="text-slate-500 text-lg max-w-md mx-auto">
                                            Be the first to share your idea!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Main Label */}
                            {suggestions.length > 0 && (
                                <div className="text-left mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Suggestions
                                    </h2>
                                    <p className="text-slate-600 mt-1">
                                        Explore ideas shared by your colleagues and customers
                                    </p>
                                </div>
                            )}

                            {/* Suggestions Grid */}
                            {suggestions.length > 0 && (
                                <div className="relative">
                                    {/* Decorative Background Elements */}
                                    <div className="absolute inset-0 -z-10">
                                        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl" />
                                        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl" />
                                    </div>

                                    <SuggestionList
                                        suggestions={suggestions}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 