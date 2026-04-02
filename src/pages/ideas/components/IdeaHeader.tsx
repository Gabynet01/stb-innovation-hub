import React from "react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getRelativeTime } from "@/utils/date";
import type { Idea } from "@/types/api";
import { detailInnerColumn, detailPageGutterX } from "./ideaDetailStyles";

interface IdeaHeaderProps {
  idea: Idea;
  onClose: () => void;
}

export const IdeaHeader: React.FC<IdeaHeaderProps> = ({ idea, onClose }) => {
  const sub =
    idea.updated_at !== idea.created_at
      ? `Created ${getRelativeTime(idea.created_at)} · Updated ${getRelativeTime(idea.updated_at)}`
      : `Created ${getRelativeTime(idea.created_at)}`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div
        className={`${detailPageGutterX} pb-6 pt-5 sm:pb-8 sm:pt-7`}
      >
        <div className={`${detailInnerColumn} flex items-start justify-between gap-4`}>
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm sm:text-base">
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-medium text-[#0051FF] underline-offset-4 transition hover:text-[#0033A1] hover:underline"
                >
                  Ideas
                </button>
              </li>
              <li className="flex min-w-0 flex-1 items-baseline gap-2">
                <ChevronRightIcon
                  className="h-4 w-4 shrink-0 translate-y-px text-slate-400"
                  aria-hidden
                />
                <h1
                  className="min-w-0 text-xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-2xl"
                  aria-current="page"
                >
                  {idea.title}
                </h1>
              </li>
            </ol>
          </nav>
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-medium text-slate-800">
              {idea.author_type === "STAFF" ? "Staff" : "Customer"}
            </span>
            <span className="text-slate-400"> · </span>
            <span>{sub}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden />
        </button>
        </div>
      </div>
    </header>
  );
};
