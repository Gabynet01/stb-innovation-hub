import React from 'react';
import { Button, Input, Select } from '@/components/ui';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TemplateFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    kindFilter: string;
    onKindFilterChange: (kind: string) => void;
    activeOnly: boolean;
    onActiveOnlyChange: (active: boolean) => void;
    templateKinds: string[];
    onClearFilters: () => void;
}

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
    searchQuery,
    onSearchChange,
    kindFilter,
    onKindFilterChange,
    activeOnly,
    onActiveOnlyChange,
    templateKinds,
    onClearFilters,
}) => {
    const hasActiveFilters = searchQuery || kindFilter || !activeOnly;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <FunnelIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Filter Templates</h3>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-sm font-medium"
                    >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search Templates
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search by name, description, or variables..."
                            value={searchQuery ?? ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                    </div>
                </div>

                {/* Kind Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Kind
                    </label>
                    <Select
                        value={kindFilter ?? ''}
                        onChange={(e) => onKindFilterChange(e.target.value)}
                        options={[
                            { value: '', label: 'All Kinds' },
                            ...templateKinds.map((kind) => ({ value: kind, label: kind }))
                        ]}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                </div>

                {/* Active Only Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <Select
                        value={activeOnly ? 'active' : 'all'}
                        onChange={(e) => onActiveOnlyChange(e.target.value === 'active')}
                        options={[
                            { value: 'active', label: 'Active Only' },
                            { value: 'all', label: 'All Templates' }
                        ]}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Search: "{searchQuery}"
                                <button
                                    onClick={() => onSearchChange('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {kindFilter && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Kind: {kindFilter}
                                <button
                                    onClick={() => onKindFilterChange('')}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {!activeOnly && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                Status: All Templates
                                <button
                                    onClick={() => onActiveOnlyChange(true)}
                                    className="ml-2 text-orange-600 hover:text-orange-800"
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};