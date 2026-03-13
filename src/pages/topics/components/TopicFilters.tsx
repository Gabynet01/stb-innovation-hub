import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Input, Select, Button } from '@/components/ui';

interface TopicFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    onClearFilters: () => void;
}

const TopicFilters: React.FC<TopicFiltersProps> = ({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    sortBy,
    onSortChange,
    onClearFilters
}) => {
    const sortOptions = [
        { value: 'created_at_desc', label: 'Newest First' },
        { value: 'created_at_asc', label: 'Oldest First' },
        { value: 'updated_at_desc', label: 'Recently Updated' },
        { value: 'label_asc', label: 'Name A-Z' },
        { value: 'label_desc', label: 'Name Z-A' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery ?? ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-full sm:w-48">
                        <Select
                            value={sortBy ?? ''}
                            onChange={(e) => onSortChange(e.target.value)}
                            options={sortOptions}
                        />
                    </div>
                </div>

                {/* View Mode and Actions */}
                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Clear Filters */}
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

export default TopicFilters;
