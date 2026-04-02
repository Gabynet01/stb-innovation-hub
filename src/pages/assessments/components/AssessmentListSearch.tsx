import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface AssessmentListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id?: string;
}

export const AssessmentListSearch: React.FC<AssessmentListSearchProps> = ({
  value,
  onChange,
  placeholder,
  id,
}) => (
  <div className="relative">
    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      id={id}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-[#0051FF] focus:outline-none focus:ring-2 focus:ring-[#0051FF]/20"
    />
  </div>
);
