import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

const ITEMS_PER_PAGE = 9;

export interface ListPaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

export const ListPagination: React.FC<ListPaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage = ITEMS_PER_PAGE,
    onPageChange,
    itemLabel = 'items'
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0 || totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
            <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> {itemLabel}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <span className="text-sm text-gray-600 px-3">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export { ITEMS_PER_PAGE };
