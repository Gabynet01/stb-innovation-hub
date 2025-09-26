import React from 'react';
import {
    LightBulbIcon,
    TagIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    DocumentTextIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import type {
    OverviewMetrics,
    ClusterMetrics,
    TopicMetrics,
    GenerationMetrics,
    Suggestion
} from '@/types/api';

interface MetricsGridProps {
    overviewMetrics: OverviewMetrics | null;
    clusterMetrics: ClusterMetrics | null;
    topicMetrics: TopicMetrics | null;
    generationMetrics: GenerationMetrics | null;
    suggestions: Suggestion[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
    overviewMetrics,
    clusterMetrics,
    topicMetrics,
    generationMetrics,
    suggestions
}) => {
    // Calculate derived metrics
    const totalSuggestions = overviewMetrics?.total_suggestions || suggestions.length;
    const totalClusters = overviewMetrics?.total_clusters || clusterMetrics?.total_clusters || 0;
    const totalTopics = topicMetrics?.total_topics || 0;
    const totalDocuments = generationMetrics?.total_documents || 0;

    const completedSuggestions = suggestions.filter(s => s.status === 'PROCESSED').length;
    const pendingSuggestions = suggestions.filter(s => s.status === 'NEW').length;
    const processingRate = totalSuggestions > 0 ? Math.round((completedSuggestions / totalSuggestions) * 100) : 0;

    // Calculate job statistics
    const jobStats = overviewMetrics?.jobs || {};
    const totalJobs = Object.values(jobStats).reduce((sum, count) => sum + (count || 0), 0);
    const completedJobs = jobStats.SUCCEEDED || 0;
    const runningJobs = jobStats.RUNNING || 0;

    // Calculate topic reuse rate
    const topicReuseRate = topicMetrics?.reuse_rate || 0;

    // Calculate average generation time
    const avgGenerationTime = generationMetrics?.average_generation_time || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Ideas Submitted */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <LightBulbIcon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ideas Submitted</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{totalSuggestions.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-sm font-semibold">{processingRate}% Processed</span>
                    </div>
                </div>
            </div>

            {/* Ideas in Review */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                            <ClockIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In Review</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{pendingSuggestions.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-amber-600 text-sm font-semibold">Awaiting AI Analysis</span>
                    </div>
                </div>
            </div>

            {/* AI Clusters */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                            <TagIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Clusters</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{totalClusters.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-purple-600 text-sm font-semibold">Smart Grouping</span>
                    </div>
                </div>
            </div>

            {/* Generated Documents */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                            <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <SparklesIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents Generated</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{totalDocuments.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 text-sm font-semibold">
                            {avgGenerationTime > 0 ? `${Math.round(avgGenerationTime)}s avg` : 'AI-Powered'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Innovation Topics */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
                            <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Innovation Topics</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{totalTopics.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-pink-600 text-sm font-semibold">
                            {topicReuseRate > 0 ? `${Math.round(topicReuseRate * 100)}% Reuse` : 'Trending Themes'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Jobs */}
            <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                            <ClockIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Background Jobs</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{totalJobs.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-cyan-600 text-sm font-semibold">
                            {completedJobs} completed, {runningJobs} running
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 