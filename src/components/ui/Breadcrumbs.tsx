import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export interface BreadcrumbItem {
  label: string;
  /** In-app navigation (e.g. close detail and return to list). */
  onClick?: () => void;
  /** Router path when not using `onClick`. */
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Dashboard-style breadcrumb: links in secondary blue, current page in text colour.
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium leading-[130%]">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <ChevronRightIcon
                className="h-3.5 w-3.5 shrink-0 text-stanbic-text/35"
                aria-hidden
              />
            ) : null}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="text-left text-stanbic-secondary transition hover:text-stanbic-primary hover:underline"
              >
                {item.label}
              </button>
            ) : item.to ? (
              <Link
                to={item.to}
                className="text-stanbic-secondary transition hover:text-stanbic-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-stanbic-text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
