import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { APP_CONFIG } from '@/constants';

export const DashboardHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 rounded-3xl" />
      <div className="relative text-center py-14 px-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0051FF] to-[#0038CC] rounded-2xl mb-6 shadow-xl">
          <LightBulbIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {APP_CONFIG.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Idea Bank capture, structured user stories, and weighted assessments — in
          one place.
        </p>
      </div>
    </div>
  );
};
