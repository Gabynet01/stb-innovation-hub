import React from 'react';
import {
  LightBulbIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { IdeahubIdeaStatus } from '@/types/ideahub';
import { IDEAHUB_STATUS_LABEL } from '../aggregateIdeaStatuses';

interface MetricsGridProps {
  totalIdeas: number;
  statusCounts: Record<IdeahubIdeaStatus, number>;
  assessmentCount: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  totalIdeas,
  statusCounts,
  assessmentCount,
}) => {
  const { draft, under_review } = statusCounts;

  const cards = [
    {
      title: 'Total ideas',
      value: totalIdeas,
      hint: 'Ideas returned from IdeaHub (same list as Idea Bank).',
      icon: LightBulbIcon,
      accent: 'from-blue-500 to-indigo-600',
    },
    {
      title: IDEAHUB_STATUS_LABEL.draft,
      value: draft,
      hint: 'IdeaHub status: draft',
      icon: ClockIcon,
      accent: 'from-amber-500 to-orange-600',
    },
    {
      title: IDEAHUB_STATUS_LABEL.under_review,
      value: under_review,
      hint: 'IdeaHub status: under_review',
      icon: ChartBarIcon,
      accent: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Idea assessments',
      value: assessmentCount,
      hint: 'Records from IdeaHub idea-assessments for your account.',
      icon: CheckCircleIcon,
      accent: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(({ title, value, hint, icon: Icon, accent }) => (
        <div
          key={title}
          className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl hover:border-white/80 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
        >
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 bg-gradient-to-br ${accent} rounded-xl shadow-lg`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {value.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
