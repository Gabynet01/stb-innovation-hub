import React from 'react';
import { LightBulbIcon, EyeIcon, UserIcon, CalendarIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { Suggestion } from '../../../types/api';
import { getStatusColor, getCategoryDisplayName, formatDisplayDate } from '../../../utils';

interface RecentIdeasProps {
    suggestions: Suggestion[];
    onIdeaClick: (suggestion: Suggestion) => void;
}

export const RecentIdeas: React.FC<RecentIdeasProps> = ({ suggestions, onIdeaClick }) => {
    const navigate = useNavigate();

    // Get recent suggestions (last 8 for better scrolling)
    const recentSuggestions = suggestions
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

    const handleViewAllSuggestions = () => {
        navigate('/suggestions');
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                </div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                                <LightBulbIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                <SparklesIcon className="h-1.5 w-1.5 text-yellow-800" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-1">Recent Ideas</h2>
                            <p className="text-blue-100 text-sm">Latest innovations from the team</p>
                        </div>
                    </div>
                    <button
                        onClick={handleViewAllSuggestions}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                        title="View all suggestions"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                <div className="p-6 space-y-4">
                    {recentSuggestions.length > 0 ? (
                        recentSuggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.id}
                                onClick={() => onIdeaClick(suggestion)}
                                className="w-full text-left group"
                            >
                                {/* Simplified Card */}
                                <div className="relative p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                                    {/* Status Indicator */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(suggestion.status)}`}></div>

                                    {/* Content */}
                                    <div className="pl-4">
                                        {/* Title and Date Row */}
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight flex-1 pr-4">
                                                {suggestion.title}
                                            </h3>
                                            <div className="text-xs text-gray-500 flex-shrink-0">
                                                {formatDisplayDate(suggestion.created_at)}
                                            </div>
                                        </div>

                                        {/* Metadata Row */}
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                {getCategoryDisplayName(suggestion.category)}
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{suggestion.author_type === 'STAFF' ? 'Staff' : 'Customer'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <LightBulbIcon className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No ideas submitted yet</h3>
                            <p className="text-gray-600 text-base mb-5">Be the first to share an innovation idea</p>
                            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                                Submit Your First Idea
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 