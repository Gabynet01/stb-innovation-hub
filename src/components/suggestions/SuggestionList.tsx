import React, { useState } from 'react';
import { Suggestion, AuthorType, Category } from '@/types/api';
import {
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

interface SuggestionListProps {
    suggestions: Suggestion[];
    loading?: boolean;
    onEdit?: (suggestion: Suggestion) => void;
    onDelete?: (id: string) => void;
    // Remove onStatusChange and onPriorityChange since these fields don't exist in API spec
}

interface SuggestionFilters {
    author_type?: AuthorType | null;
    category?: Category | null;
    search?: string;
    // Remove status and priority filters since these fields don't exist in API spec
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
    suggestions,
    loading = false,
    onEdit,
    onDelete
}) => {
    const [filters, setFilters] = useState<SuggestionFilters>({
        author_type: null,
        category: null,
        search: ''
    });

    const filteredSuggestions = suggestions.filter(suggestion => {
        if (filters.author_type && suggestion.author_type !== filters.author_type) return false;
        if (filters.category && suggestion.category !== filters.category) return false;
        if (filters.search && !suggestion.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const getCategoryColor = (category: Category) => {
        switch (category) {
            case Category.UX: return 'bg-blue-100 text-blue-700 border-blue-200';
            case Category.PRODUCT: return 'bg-green-100 text-green-700 border-green-200';
            case Category.SERVICE: return 'bg-purple-100 text-purple-700 border-purple-200';
            case Category.OPERATIONAL: return 'bg-orange-100 text-orange-700 border-orange-200';
            case Category.OTHER: return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getAuthorTypeColor = (authorType: AuthorType) => {
        switch (authorType) {
            case AuthorType.STAFF: return 'bg-stanbic-100 text-stanbic-700 border-stanbic-200';
            case AuthorType.CUSTOMER: return 'bg-corporate-100 text-corporate-700 border-corporate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this suggestion?')) {
            onDelete?.(id);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-lg"></div>
                <p className="mt-6 text-neutral-600 text-lg font-medium">Loading suggestions...</p>
                <p className="mt-2 text-neutral-500">Preparing your innovation data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        Innovation Suggestions
                    </h2>
                    <p className="text-neutral-600 text-base sm:text-lg mt-2">
                        {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Simple Filters */}
            <div className="bg-white rounded-lg border border-corporate-200 p-4">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={filters.author_type || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, author_type: e.target.value ? e.target.value as AuthorType : null }))}
                        className="px-3 py-2 border border-corporate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                    >
                        <option value="">All Author Types</option>
                        <option value={AuthorType.STAFF}>Staff</option>
                        <option value={AuthorType.CUSTOMER}>Customer</option>
                    </select>

                    <select
                        value={filters.category || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value ? e.target.value as Category : null }))}
                        className="px-3 py-2 border border-corporate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        <option value={Category.UX}>UX</option>
                        <option value={Category.PRODUCT}>Product</option>
                        <option value={Category.SERVICE}>Service</option>
                        <option value={Category.OPERATIONAL}>Operational</option>
                        <option value={Category.OTHER}>Other</option>
                    </select>

                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-corporate-400" />
                        <input
                            type="text"
                            placeholder="Search suggestions..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-corporate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white rounded-lg border border-corporate-200 p-6 hover:shadow-md transition-shadow duration-150">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-stanbic-900 mb-2">{suggestion.title}</h3>
                                <p className="text-sm text-corporate-600 mb-3 line-clamp-3">{suggestion.body}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit?.(suggestion)}
                                    className="p-2 text-corporate-500 hover:text-stanbic-600 hover:bg-stanbic-50 rounded-md transition-colors duration-150"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(suggestion.id)}
                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Category and Author Type */}
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(suggestion.category)}`}>
                                    {suggestion.category}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAuthorTypeColor(suggestion.author_type)}`}>
                                    {suggestion.author_type}
                                </span>
                            </div>

                            {/* Contact Info */}
                            {suggestion.contact.email && (
                                <div className="text-xs text-corporate-500">
                                    <span className="font-medium">Contact:</span> {suggestion.contact.email}
                                </div>
                            )}

                            {/* Attachments */}
                            {suggestion.attachments && suggestion.attachments.length > 0 && (
                                <div className="text-xs text-corporate-500">
                                    <span className="font-medium">Attachments:</span> {suggestion.attachments.length} file(s)
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredSuggestions.length === 0 && (
                <div className="text-center py-12">
                    <LightBulbIcon className="h-12 w-12 text-corporate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-corporate-900 mb-2">No suggestions found</h3>
                    <p className="text-corporate-600 mb-4">
                        Try adjusting your filters or create a new suggestion
                    </p>
                </div>
            )}
        </div>
    );
}; 