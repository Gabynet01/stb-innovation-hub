import React from 'react';
import {
    FunnelIcon,
    ArrowPathIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { APP_CONFIG } from '@/constants';

interface SuggestionsHeaderProps {
    showFilters: boolean;
    onToggleFilters: () => void;
    onRefresh: () => void;
    onNewSuggestion: () => void;
    loading: boolean;
}

export const SuggestionsHeader: React.FC<SuggestionsHeaderProps> = ({
    showFilters,
    onToggleFilters,
    onRefresh,
    onNewSuggestion,
    loading
}) => {
    return (
        <div className="relative overflow-hidden">
            {/* Elegant Background with Standard Bank Blue */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0051FF] via-[#0047E6] to-[#0038CC]"></div>

            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between">
                    {/* Left Side - Branding */}
                    <div className="flex items-center space-x-6">
                        {/* Typography Section */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                                Share Your Ideas
                            </h1>
                            <p className="text-white/70 text-base">
                                Help shape the future of Standard Bank
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Filters Button */}
                        <button
                            onClick={onToggleFilters}
                            className="px-6 py-3 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300"
                        >
                            <FunnelIcon className="h-4 w-4 mr-2 inline" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            className="px-6 py-3 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300"
                            disabled={loading}
                        >
                            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Primary Action Button */}
                        <button
                            onClick={onNewSuggestion}
                            className="px-6 py-3 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300"
                        >
                            <PlusIcon className="h-4 w-4 mr-2 inline" />
                            Share Idea
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Border with Enhanced Effect */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
                </div>
            </div>
        </div>
    );
}; 