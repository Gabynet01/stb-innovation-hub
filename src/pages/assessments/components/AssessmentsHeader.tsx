import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import {
  PAGE_HERO_HEADER_CLASS,
  PAGE_HERO_PATTERN_LIGHT,
  PAGE_HERO_SURFACE,
} from "@/constants/pageHero";

export const AssessmentsHeader: React.FC = () => (
  <header className={PAGE_HERO_HEADER_CLASS}>
    <div className={PAGE_HERO_SURFACE} aria-hidden />
    <div
      className="absolute inset-0 opacity-80"
      style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
      aria-hidden
    />

    <div className="relative z-10 mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11">
      <div className="min-w-0 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Stanbic Bank · Innovation
        </p>
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0051FF] to-[#0038CC] shadow-lg">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Idea assessments
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Work the queue of unaudited ideas, then browse completed scores.
              New assessments open only after you choose an idea from the
              awaiting list.
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
);
