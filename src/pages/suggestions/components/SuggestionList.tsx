import React, { useState, useMemo } from 'react';
import { Suggestion } from '@/types/api';
import { SuggestionCard } from './SuggestionCard';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

interface SuggestionListProps {
    suggestions: Suggestion[];
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => void;
    onView: (suggestion: Suggestion) => void;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
    suggestions,
    onEdit,
    onDelete,
    onView
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate pagination
    const totalPages = Math.ceil(suggestions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSuggestions = suggestions.slice(startIndex, endIndex);

    // Reset to first page when suggestions change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [suggestions.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of the list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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