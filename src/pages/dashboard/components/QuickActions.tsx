import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LightBulbIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <h2 className="text-xl font-bold text-gray-900">Quick actions</h2>
        <p className="text-gray-600 text-sm mt-1">
          Shortcuts across the Idea Bank, submission form, and assessments.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => navigate('/ideas')}
          className="flex flex-col items-start p-5 rounded-xl border-2 border-slate-200 bg-white text-left hover:border-[#0051FF] hover:bg-blue-50/40 transition-colors"
        >
          <LightBulbIcon className="h-8 w-8 text-[#0051FF] mb-3" />
          <span className="font-semibold text-gray-900">Idea Bank</span>
          <span className="text-sm text-gray-600 mt-1">Browse and capture ideas</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/ideas?view=form')}
          className="flex flex-col items-start p-5 rounded-xl border-2 border-slate-200 bg-white text-left hover:border-[#0051FF] hover:bg-blue-50/40 transition-colors"
        >
          <DocumentTextIcon className="h-8 w-8 text-[#0051FF] mb-3" />
          <span className="font-semibold text-gray-900">User story submission</span>
          <span className="text-sm text-gray-600 mt-1">As a, I want to, so that</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/assessments')}
          className="flex flex-col items-start p-5 rounded-xl border-2 border-slate-200 bg-white text-left hover:border-[#0051FF] hover:bg-blue-50/40 transition-colors"
        >
          <ClipboardDocumentCheckIcon className="h-8 w-8 text-[#0051FF] mb-3" />
          <span className="font-semibold text-gray-900">Assessments</span>
          <span className="text-sm text-gray-600 mt-1">Weighted criteria and scoring</span>
        </button>
      </div>
    </div>
  );
};
