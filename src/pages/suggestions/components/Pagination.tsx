import React from 'react';
import { Button } from '@/components/ui';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-6">
            {/* Items Info */}
            <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> suggestions
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                    onClick={() => onPageChange(1)}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-2"
                    disabled={currentPage === 1}
                >
                    <ChevronDoubleLeftIcon className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-2"
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {getVisiblePages().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-slate-400">...</span>
                            ) : (
                                <Button
                                    onClick={() => onPageChange(page as number)}
                                    variant={currentPage === page ? "primary" : "secondary"}
                                    size="sm"
                                    className="px-3 py-2 min-w-[40px]"
                                >
                                    {page}
                                </Button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Page */}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-2"
                    disabled={currentPage === totalPages}
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                    onClick={() => onPageChange(totalPages)}
                    variant="secondary"
                    size="sm"
                    className="px-2 py-2"
                    disabled={currentPage === totalPages}
                >
                    <ChevronDoubleRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}; 