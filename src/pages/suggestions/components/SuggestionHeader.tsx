import React from 'react';
import {
    LightBulbIcon,
    UserIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { getRelativeTime } from '@/utils/date';

interface SuggestionHeaderProps {
    suggestion: any;
    onClose: () => void;
}

export const SuggestionHeader: React.FC<SuggestionHeaderProps> = ({ suggestion, onClose }) => {
    return (
        <div className="relative p-4 sm:p-6 md:p-8 border-b border-[#0051FF]/20 bg-gradient-to-r from-[#0051FF] to-[#0047E6] text-white">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
                <div className="relative">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                </div>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30 mx-auto sm:mx-0">
                    <LightBulbIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="flex-1 pt-0 sm:pt-2 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{suggestion.title}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs sm:text-sm">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                            <UserIcon className="h-4 w-4 text-white" />
                            <span className="font-medium text-white">{suggestion.author_type}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                            <CalendarIcon className="h-4 w-4 text-white" />
                            <span className="text-white font-medium">Created {getRelativeTime(suggestion.created_at)}</span>
                        </div>
                        {suggestion.updated_at !== suggestion.created_at && (
                            <div className="flex items-center justify-center sm:justify-start space-x-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                                <ClockIcon className="h-4 w-4 text-white" />
                                <span className="text-white font-medium">Updated {getRelativeTime(suggestion.updated_at)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 