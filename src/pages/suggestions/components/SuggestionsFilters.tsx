import React from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { SuggestionFilters } from '@/types/api';
import { FunnelIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SuggestionsFiltersProps {
    filters: SuggestionFilters;
    onFiltersChange: (filters: SuggestionFilters) => void;
    onClearFilters: () => void;
}

export const SuggestionsFilters: React.FC<SuggestionsFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters
}) => {
    const handleFilterChange = (field: keyof SuggestionFilters, value: string) => {
        onFiltersChange({
            ...filters,
            [field]: value || undefined
        });
    };

    const hasActiveFilters = Boolean(filters.search || filters.status || filters.category || filters.author_type);

    return (
        <Card className="p-8 border-0 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 opacity-60" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FunnelIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Smart Filters</h3>
                            <p className="text-slate-600">Discover exactly what you're looking for</p>
                        </div>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            onClick={onClearFilters}
                            variant="secondary"
                            size="sm"
                            className="text-slate-600 hover:text-slate-800 bg-white/80 hover:bg-white border-slate-200"
                        >
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center space-x-2">
                            <SparklesIcon className="h-4 w-4 text-blue-500" />
                            <span>Search</span>
                        </label>
                        <Input
                            placeholder="Find suggestions..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Status</span>
                        </label>
                        <Select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={[
                                { value: '', label: 'All Statuses' },
                                { value: 'NEW', label: 'New' },
                                { value: 'PROCESSED', label: 'Processed' },
                                { value: 'ARCHIVED', label: 'Archived' }
                            ]}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span>Category</span>
                        </label>
                        <Select
                            value={filters.category || ''}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            options={[
                                { value: '', label: 'All Categories' },
                                { value: 'UX', label: 'UX' },
                                { value: 'PRODUCT', label: 'Product' },
                                { value: 'SERVICE', label: 'Service' },
                                { value: 'OPERATIONAL', label: 'Operational' },
                                { value: 'OTHER', label: 'Other' }
                            ]}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span>Author Type</span>
                        </label>
                        <Select
                            value={filters.author_type || ''}
                            onChange={(e) => handleFilterChange('author_type', e.target.value)}
                            options={[
                                { value: '', label: 'All Types' },
                                { value: 'STAFF', label: 'Staff' },
                                { value: 'CUSTOMER', label: 'Customer' }
                            ]}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-3 text-sm text-slate-600 mb-3">
                            <span className="font-semibold">Active filters:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filters.search && (
                                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 flex items-center space-x-2">
                                    <span>🔍</span>
                                    <span>"{filters.search}"</span>
                                </span>
                            )}
                            {filters.status && (
                                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200 flex items-center space-x-2">
                                    <span>📊</span>
                                    <span>{filters.status}</span>
                                </span>
                            )}
                            {filters.category && (
                                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200 flex items-center space-x-2">
                                    <span>🏷️</span>
                                    <span>{filters.category}</span>
                                </span>
                            )}
                            {filters.author_type && (
                                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200 flex items-center space-x-2">
                                    <span>👤</span>
                                    <span>{filters.author_type}</span>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}; 