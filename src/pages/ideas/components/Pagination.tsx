import React from "react";
import { Button } from "@/components/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  /** Optional noun for the range line (default: ideas). */
  itemLabel?: string;
  /** Stanbic-style footer: softer chrome, optional rows-per-page. */
  variant?: "classic" | "stanbic";
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemLabel = "ideas",
  variant = "classic",
  pageSizeOptions,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const rangeText = (
    <span className="tabular-nums text-sm font-normal leading-[130%] text-stanbic-text">
      {startItem} – {endItem} of {totalItems}
    </span>
  );

  if (variant === "stanbic") {
    return (
      <div className="flex flex-col items-stretch justify-between gap-4 border-t border-stanbic-border pt-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          {pageSizeOptions && onPageSizeChange ? (
            <label className="flex items-center gap-2 text-sm font-medium leading-[130%] text-stanbic-text">
              <span className="text-stanbic-text/70">Rows per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-md border border-stanbic-border bg-white px-2 py-1.5 text-sm font-normal text-stanbic-text focus:border-stanbic-secondary focus:outline-none focus:ring-1 focus:ring-stanbic-secondary"
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {rangeText}
          <div className="flex items-center gap-1">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              variant="secondary"
              size="sm"
              className="border-stanbic-border px-2 py-2 text-stanbic-secondary hover:border-stanbic-secondary hover:text-stanbic-primary"
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              variant="secondary"
              size="sm"
              className="border-stanbic-border px-2 py-2 text-stanbic-secondary hover:border-stanbic-secondary hover:text-stanbic-primary"
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-5 space-y-4 py-5 sm:flex-row sm:space-y-0 sm:py-6">
      <div className="text-sm text-slate-600 sm:text-[15px]">
        Showing{" "}
        <span className="font-semibold text-[#0033A1]">{startItem}</span> to{" "}
        <span className="font-semibold text-[#0033A1]">{endItem}</span> of{" "}
        <span className="font-semibold text-[#0033A1]">{totalItems}</span>{" "}
        {itemLabel}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPageChange(1)}
          variant="secondary"
          size="sm"
          className="px-2 py-2"
          disabled={currentPage === 1}
        >
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => onPageChange(currentPage - 1)}
          variant="secondary"
          size="sm"
          className="px-2 py-2"
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-slate-400">...</span>
              ) : (
                <Button
                  onClick={() => onPageChange(page as number)}
                  variant={currentPage === page ? "primary" : "secondary"}
                  size="sm"
                  className={`min-w-[40px] px-3 py-2 ${
                    currentPage === page
                      ? "!border-0 !bg-[#0051FF] !text-white shadow-sm hover:!bg-[#0033AA]"
                      : ""
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          variant="secondary"
          size="sm"
          className="px-2 py-2"
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

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
