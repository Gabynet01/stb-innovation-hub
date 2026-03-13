import React from 'react';
import { Button, Input, Select } from '@/components/ui';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DocumentFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onClearFilters: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onClearFilters
}) => {
    const hasActiveFilters = searchQuery || statusFilter;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Documents
                    </label>
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by title or content..."
                            value={searchQuery ?? ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <Select
                        value={statusFilter ?? ''}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        options={[
                            { value: '', label: 'All Statuses' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'failed', label: 'Failed' }
                        ]}
                    />
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
};
