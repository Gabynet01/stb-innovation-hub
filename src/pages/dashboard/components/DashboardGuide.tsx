import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

type AppRoute = '/ideas' | '/assessments';

type GuideCard = {
  id: string;
  title: string;
  summary: string;
  path: AppRoute;
  search?: string;
  cta: string;
};

const GUIDE_CARDS: GuideCard[] = [
  {
    id: 'idea-bank',
    title: 'Idea Bank (capture)',
    summary:
      'Structured intake: collection source, category, and idea details.',
    path: '/ideas',
    cta: 'Browse and capture ideas',
  },
  {
    id: 'user-story-intent',
    title: 'User story — who and intent',
    summary: '“As a …” and “I want to …” on the submission form.',
    path: '/ideas',
    search: '?view=form',
    cta: 'Open submission form',
  },
  {
    id: 'user-story-outcome',
    title: 'User story — outcome',
    summary: '“So that …” and supporting context on the same form.',
    path: '/ideas',
    search: '?view=form',
    cta: 'Continue on form',
  },
  {
    id: 'assessment',
    title: 'Weighted assessment',
    summary:
      'Five weighted criteria, scored submission, and priority band.',
    path: '/assessments',
    cta: 'Record assessments',
  },
];

function hrefFor(card: GuideCard): string {
  return `${card.path}${card.search ?? ''}`;
}

export const DashboardGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0051FF]/10 text-[#0051FF] shrink-0">
            <Squares2X2Icon className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">How this app is organised</h2>
            <p className="text-gray-600 text-sm mt-1 max-w-3xl">
              From Idea Bank capture through user stories to weighted scoring. Each
              card opens the matching area.
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {GUIDE_CARDS.map((card) => (
          <article
            key={card.id}
            className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-4 flex flex-col shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 leading-snug">{card.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed flex-1">
              {card.summary}
            </p>
            <button
              type="button"
              onClick={() => navigate(hrefFor(card))}
              className="mt-4 text-left text-sm font-semibold text-[#0051FF] hover:text-[#0047E6] underline-offset-2 hover:underline"
            >
              {card.cta} →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
