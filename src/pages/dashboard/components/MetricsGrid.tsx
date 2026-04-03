import React from "react";
import {
  LightBulbIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { IdeahubIdeaStatus } from "@/types/ideahub";
import { IDEAHUB_STATUS_LABEL } from "../aggregateIdeaStatuses";

interface MetricsGridProps {
  totalIdeas: number;
  statusCounts: Record<IdeahubIdeaStatus, number>;
  assessmentCount: number;
}

/** Solid fills + soft hue-matched shadows (no gradients). */
const metricThemes = [
  {
    bg: "bg-[#0051FF]",
    shadow:
      "shadow-[0_22px_56px_-14px_rgba(0,81,255,0.55),0_8px_24px_-8px_rgba(0,51,170,0.2)] hover:shadow-[0_28px_64px_-14px_rgba(0,81,255,0.5)]",
  },
  {
    bg: "bg-[#EA580C]",
    shadow:
      "shadow-[0_22px_56px_-14px_rgba(234,88,12,0.45),0_8px_24px_-8px_rgba(194,65,12,0.18)] hover:shadow-[0_28px_64px_-14px_rgba(234,88,12,0.42)]",
  },
  {
    bg: "bg-[#7C3AED]",
    shadow:
      "shadow-[0_22px_56px_-14px_rgba(124,58,237,0.45),0_8px_24px_-8px_rgba(91,33,182,0.2)] hover:shadow-[0_28px_64px_-14px_rgba(124,58,237,0.4)]",
  },
  {
    bg: "bg-[#059669]",
    shadow:
      "shadow-[0_22px_56px_-14px_rgba(5,150,105,0.45),0_8px_24px_-8px_rgba(4,120,87,0.18)] hover:shadow-[0_28px_64px_-14px_rgba(5,150,105,0.4)]",
  },
] as const;

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  totalIdeas,
  statusCounts,
  assessmentCount,
}) => {
  const { draft, under_review } = statusCounts;

  const cards = [
    {
      title: "Total ideas",
      value: totalIdeas,
      hint: "Idea Bank scope (up to 500 loaded)",
      icon: LightBulbIcon,
    },
    {
      title: IDEAHUB_STATUS_LABEL.draft,
      value: draft,
      hint: "Pipeline · draft",
      icon: ClockIcon,
    },
    {
      title: IDEAHUB_STATUS_LABEL.under_review,
      value: under_review,
      hint: "Pipeline · in review",
      icon: ChartBarIcon,
    },
    {
      title: "Assessments",
      value: assessmentCount,
      hint: "Scores on record",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <section aria-label="Idea overview">
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-stanbic-text">
        Overview
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {cards.map(({ title, value, hint, icon: Icon }, i) => {
          const theme = metricThemes[i];
          return (
            <div
              key={title}
              className={`group flex min-h-[200px] flex-col rounded-[1.75rem] p-6 text-white transition duration-300 sm:min-h-[220px] sm:p-7 ${theme.bg} ${theme.shadow} hover:-translate-y-0.5`}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/25 backdrop-blur-[2px]"
                aria-hidden
              >
                <Icon className="h-7 w-7 text-white" aria-hidden />
              </div>
              <p className="mt-5 text-sm font-semibold leading-snug text-white/95">
                {title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                {hint}
              </p>
              <p className="mt-auto pt-8 text-4xl font-bold tabular-nums tracking-tight text-white sm:text-[2.5rem] sm:leading-none">
                {value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
