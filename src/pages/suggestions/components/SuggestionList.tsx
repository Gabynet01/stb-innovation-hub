import React, { useState, useCallback, useMemo } from 'react';
import { Suggestion } from '@/types/api';
import { SuggestionCard } from './SuggestionCard';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

interface SuggestionListProps {
    suggestions: Suggestion[];
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => void;
    onView: (suggestion: Suggestion) => void;
    onClusterClick?: (clusterId: string) => void;
    onTopicClick?: (topicId: string) => void;
    onManageTopics?: (suggestion: Suggestion) => void;
}

const SuggestionListComponent: React.FC<SuggestionListProps> = ({
    suggestions,
    onEdit,
    onDelete,
    onView,
    onClusterClick,
    onTopicClick,
    onManageTopics
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const { totalPages, currentSuggestions } = useMemo(() => {
        const totalPages = Math.ceil(suggestions.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentSuggestions = suggestions.slice(startIndex, endIndex);

        return { totalPages, currentSuggestions };
    }, [suggestions, currentPage, itemsPerPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [suggestions.length]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (suggestions.length === 0) {
        return <EmptyState hasFilters={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {currentSuggestions.map((suggestion) => (
                    <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        onClusterClick={onClusterClick}
                        onTopicClick={onTopicClick}
                        onManageTopics={onManageTopics}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={suggestions.length}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </div>
    );
};

export const SuggestionList = React.memo(SuggestionListComponent); 