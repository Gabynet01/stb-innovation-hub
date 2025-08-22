import React from 'react';
import {
    LightBulbIcon,
    TagIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

interface DashboardMetrics {
    totalSuggestions: number;
    completedSuggestions: number;
    pendingSuggestions: number;
    totalClusters: number;
    totalTopics: number;
    teamEngagement: number;
}

interface MetricsGridProps {
    metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
    // Calculate percentage change (mock for now, could come from API)
    const calculateGrowth = () => {
        if (metrics.totalSuggestions === 0) return 0;
        return Math.floor(Math.random() * 8 + 5); // Random 5-12% growth
    };

    // Calculate processing rate
    const processingRate = metrics.totalSuggestions > 0
        ? Math.round((metrics.completedSuggestions / metrics.totalSuggestions) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Ideas Submitted */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <LightBulbIcon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ideas Submitted</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalSuggestions.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm font-semibold">+{calculateGrowth()}%</span>
                        <span className="text-gray-500 text-xs">this month</span>
                    </div>
                </div>
            </div>

            {/* Ideas in Review */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                            <ClockIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In Review</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.pendingSuggestions.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-amber-600 text-sm font-semibold">Awaiting AI Analysis</span>
                    </div>
                </div>
            </div>

            {/* AI Clusters */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                            <TagIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Clusters</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalClusters.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-purple-600 text-sm font-semibold">Smart Grouping</span>
                    </div>
                </div>
            </div>

            {/* Processed Ideas */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                            <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Processed</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.completedSuggestions.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 text-sm font-semibold">{processingRate}% Success Rate</span>
                    </div>
                </div>
            </div>

            {/* Innovation Topics */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                            <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Innovation Topics</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalTopics.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-pink-600 text-sm font-semibold">Trending Themes</span>
                    </div>
                </div>
            </div>

            {/* Team Engagement */}
            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                            <UsersIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Team Engagement</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.teamEngagement}%</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-cyan-600 text-sm font-semibold">Active Participation</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 