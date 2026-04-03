import React from "react";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

export interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  /** Merged onto the title element (e.g. long idea titles). */
  titleClassName?: string;
}

/**
 * White header strip with breadcrumbs, title, and optional right-side actions
 * (matches Administration / Documents).
 */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className = "",
  titleClassName = "",
}: PageHeaderProps) {
  return (
    <div className={`border-b border-stanbic-border bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />
        <div
          className={`flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between ${breadcrumbs.length > 0 ? "mt-4" : ""}`}
        >
          <div className="min-w-0">
            <h1
              className={`text-2xl font-medium leading-[130%] text-stanbic-text md:text-3xl ${titleClassName}`.trim()}
            >
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm font-normal leading-[130%] text-stanbic-text/70">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
