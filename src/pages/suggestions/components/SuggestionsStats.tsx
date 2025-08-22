import React, { useState, useEffect } from 'react';
import { Suggestion } from '@/types/api';
import {
    LightBulbIcon,
    SparklesIcon,
    ChartBarIcon,
    StarIcon,
    ClockIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface SuggestionsStatsProps {
    suggestions: Suggestion[];
}

export const SuggestionsStats: React.FC<SuggestionsStatsProps> = ({ suggestions }) => {
    const [currentInsight, setCurrentInsight] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Calculate meaningful suggestion metrics
    const totalSuggestions = suggestions.length;
    const newSuggestions = suggestions.filter(s => s.status === 'NEW').length;
    const processedSuggestions = suggestions.filter(s => s.status === 'PROCESSED').length;
    const archivedSuggestions = suggestions.filter(s => s.status === 'ARCHIVED').length;

    // Recent activity (last 7 days)
    const recentSuggestions = suggestions.filter(s => {
        const createdDate = new Date(s.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
    }).length;

    // Monthly growth (last 30 days vs previous 30 days)
    const lastMonth = suggestions.filter(s => {
        const createdDate = new Date(s.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        return createdDate > thirtyDaysAgo && createdDate <= sixtyDaysAgo;
    }).length;

    const thisMonth = suggestions.filter(s => {
        const createdDate = new Date(s.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo;
    }).length;

    const growthRate = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;
    const growthTrend = growthRate > 0 ? '↗️' : growthRate < 0 ? '↘️' : '→';

    // Category analysis
    const categoryCounts = suggestions.reduce((acc, suggestion) => {
        acc[suggestion.category] = (acc[suggestion.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];
    const topCategoryName = topCategory ? topCategory[0] : 'None';
    const topCategoryCount = topCategory ? topCategory[1] : 0;
    const categoryDiversity = Object.keys(categoryCounts).length;

    // Engagement metrics
    const avgSuggestionsPerDay = totalSuggestions > 0 ? (totalSuggestions / Math.max(1, Math.ceil((Date.now() - new Date(suggestions[0]?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1) : '0';

    // Status distribution
    const completionRate = totalSuggestions > 0 ? Math.round((processedSuggestions / totalSuggestions) * 100) : 0;
    const activeRate = totalSuggestions > 0 ? Math.round(((newSuggestions + processedSuggestions) / totalSuggestions) * 100) : 0;

    // Rotating stats sets with meaningful, actionable insights
    const statsSets = [
        {
            // Set 1: Community Impact & Growth
            mainGrid: [
                { title: "Community Growth", value: `${growthTrend} ${Math.abs(growthRate)}%`, icon: ArrowTrendingUpIcon, color: "from-[#0051FF] to-[#0047E6]", span: 2 },
                { title: "New This Month", value: thisMonth, color: "from-[#0051FF]/10 to-[#0047E6]/20" },
                { title: "Last Month", value: lastMonth, color: "from-[#0051FF]/10 to-[#0047E6]/20" }
            ],
            bottomGrid: [
                { title: "Ideas per Day", value: `${avgSuggestionsPerDay}`, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: false },
                { title: "This Week", value: recentSuggestions, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: true }
            ]
        },
        {
            // Set 2: Innovation Trends & Categories
            mainGrid: [
                { title: "Most Popular", value: topCategoryName, icon: StarIcon, color: "from-[#0051FF] to-[#0047E6]", span: 2 },
                { title: "Popular Count", value: topCategoryCount, color: "from-[#0051FF]/10 to-[#0047E6]/20" },
                { title: "Categories", value: categoryDiversity, color: "from-[#0051FF]/10 to-[#0047E6]/20" }
            ],
            bottomGrid: [
                { title: "Processing Rate", value: `${completionRate}%`, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: false },
                { title: "Active Ideas", value: `${activeRate}%`, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: false }
            ]
        },
        {
            // Set 3: Platform Performance & Success
            mainGrid: [
                { title: "Total Ideas", value: totalSuggestions, icon: LightBulbIcon, color: "from-[#0051FF] to-[#0047E6]", span: 2 },
                { title: "Fresh Ideas", value: newSuggestions, color: "from-[#0051FF]/10 to-[#0047E6]/20" },
                { title: "Being Reviewed", value: processedSuggestions, color: "from-[#0051FF]/10 to-[#0047E6]/20" }
            ],
            bottomGrid: [
                { title: "Implemented", value: archivedSuggestions, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: false },
                { title: "Implementation Rate", value: `${Math.round((archivedSuggestions / totalSuggestions) * 100)}%`, color: "from-[#0051FF]/10 to-[#0047E6]/20", animated: false }
            ]
        }
    ];



    return (
        <div className="space-y-4">
            {/* Tabbed Stats Grid */}
            <div className="relative">
                {/* Tab Navigation */}
                <div className="flex items-center justify-end mb-4 space-x-1">
                    {statsSets.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentInsight(index)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${index === currentInsight
                                ? 'bg-[#0051FF] text-white shadow-md'
                                : 'bg-[#0051FF]/10 text-[#0051FF] hover:bg-[#0051FF]/20'
                                }`}
                        >
                            {index === 0 ? 'Growth' : index === 1 ? 'Trends' : 'Performance'}
                        </button>
                    ))}
                </div>

                {/* Stats Content */}
                <div className="transition-opacity duration-300">
                    {(() => {
                        const statsSet = statsSets[currentInsight];
                        return (
                            <>
                                {/* Main Stats Grid */}
                                <div className="grid grid-cols-4 gap-2">
                                    {statsSet.mainGrid.map((stat, index) => (
                                        <div key={index} className={`${stat.span === 2 ? 'col-span-2' : ''} bg-gradient-to-br ${stat.color} rounded-lg ${stat.icon ? 'text-white' : 'border border-[#0051FF]/20'}`}>
                                            <div className={`flex items-center space-x-2 p-2 ${!stat.icon ? 'text-center' : ''}`}>
                                                {stat.icon && (
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <stat.icon className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                <div className={stat.icon ? '' : 'w-full'}>
                                                    <div className={`text-lg font-bold ${stat.icon ? 'text-white' : 'text-[#0051FF]'}`}>{stat.value}</div>
                                                    <div className={`text-xs ${stat.icon ? 'text-white/80' : 'text-slate-600'}`}>{stat.title}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {statsSet.bottomGrid.map((stat, index) => (
                                        <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg border border-[#0051FF]/20 relative overflow-hidden ${stat.animated ? '' : ''}`}>
                                            <div className="text-center relative z-10 p-2">
                                                <div className="text-base font-bold text-[#0051FF]">{stat.value}</div>
                                                <div className="text-xs text-slate-600">{stat.title}</div>
                                            </div>
                                            {stat.animated && (
                                                <div className="absolute inset-0 opacity-20">
                                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0051FF]/10 to-transparent animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}; 