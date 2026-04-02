import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  return (
    <div className="rounded-xl border border-dashed border-[#0051FF]/25 bg-gradient-to-br from-white via-[#F0F7FF]/40 to-white py-14 text-center sm:py-16">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0051FF]/10 ring-1 ring-[#0051FF]/20">
        <LightBulbIcon className="h-6 w-6 text-[#0051FF]" aria-hidden />
      </div>
      <p className="text-sm font-semibold text-[#0033A1]">
        {hasFilters ? "No ideas match these filters" : "No ideas yet"}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
        {hasFilters
          ? "Try clearing or adjusting filters to see more results."
          : "New submissions will appear here as your teams share innovation."}
      </p>
    </div>
  );
};
