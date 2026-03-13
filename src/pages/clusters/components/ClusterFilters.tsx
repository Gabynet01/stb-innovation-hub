import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Input, Select, Button } from '@/components/ui';

interface ClusterFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    kindFilter: string;
    onKindFilterChange: (kind: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onClearFilters: () => void;
}

const ClusterFilters: React.FC<ClusterFiltersProps> = ({
    searchQuery,
    onSearchChange,
    kindFilter,
    onKindFilterChange,
    statusFilter,
    onStatusFilterChange,
    onClearFilters
}) => {
    const kindOptions = [
        { value: '', label: 'All Kinds' },
        { value: 'EMBEDDING', label: 'Embedding' },
        { value: 'TAG', label: 'Tag' },
        { value: 'TOPIC', label: 'Topic' },
        { value: 'FUSION', label: 'Fusion' }
    ];

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'NEW', label: 'New' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'CLOSED', label: 'Closed' },
        { value: 'ARCHIVED', label: 'Archived' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search clusters..."
                            value={searchQuery ?? ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Kind Filter */}
                    <div className="w-full sm:w-48">
                        <Select
                            value={kindFilter ?? ''}
                            onChange={(e) => onKindFilterChange(e.target.value)}
                            options={kindOptions}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="w-full sm:w-48">
                        <Select
                            value={statusFilter ?? ''}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            options={statusOptions}
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="flex items-center gap-2"
                    >
                        <FunnelIcon className="w-4 h-4" />
                        Clear Filters
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ClusterFilters;
