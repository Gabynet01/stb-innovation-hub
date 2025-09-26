import React from 'react';
import { SparklesIcon, EyeIcon, UsersIcon, TagIcon } from '@heroicons/react/24/outline';
import type { Cluster, Topic } from '../../../types/api';

interface AIInsightsProps {
    clusters: Cluster[];
    topics: Topic[];
    onViewClusters?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ clusters, topics, onViewClusters }) => {
    // Get top clusters by weight
    const topClusters = clusters
        .sort((a, b) => (b.weight || 0) - (a.weight || 0))
        .slice(0, 5);

    // Helper function to get cluster kind display name
    const getClusterKindDisplayName = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING':
                return 'AI Similarity';
            case 'TAG':
                return 'Tag Grouping';
            case 'TOPIC':
                return 'Topic Based';
            case 'FUSION':
                return 'AI Fusion';
            default:
                return kind;
        }
    };

    const getClusterIcon = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING':
                return '🔗';
            case 'TAG':
                return '🏷️';
            case 'TOPIC':
                return '📊';
            case 'FUSION':
                return '⚡';
            default:
                return '💡';
        }
    };

    const getTopicIcon = () => {
        const icons = ['🚀', '💡', '🎯', '🌟', '🔥'];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                            <SparklesIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">AI Insights</h2>
                            <p className="text-gray-600 text-lg font-medium">Smart patterns & trends discovered</p>
                        </div>
                    </div>
                    <button
                        onClick={onViewClusters}
                        className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200 group"
                        title="View all AI clusters"
                    >
                        <EyeIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {topics.length > 0 ? (
                        // Show topics if available
                        topics.slice(0, 5).map((topic) => (
                            <div key={topic.id} className="group p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getTopicIcon()}</span>
                                        <h3 className="font-bold text-gray-900 text-lg">{topic.label || 'Untitled Topic'}</h3>
                                    </div>
                                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200 text-sm">
                                        {Math.floor(Math.random() * 15 + 5)} ideas
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-4 leading-relaxed">{topic.description || 'AI-identified innovation pattern'}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <UsersIcon className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm text-gray-600 font-medium">{Math.floor(Math.random() * 20 + 8)} contributors</span>
                                    </div>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full shadow-sm transition-all duration-500" style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : clusters.length > 0 ? (
                        // Fallback to clusters if no topics available
                        topClusters.map((cluster) => (
                            <div key={cluster.id} className="group p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getClusterIcon(cluster.kind)}</span>
                                        <h3 className="font-bold text-gray-900 text-lg">{cluster.title || 'Untitled Cluster'}</h3>
                                    </div>
                                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200 text-sm">
                                        Weight: {cluster.weight || 0}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-4 leading-relaxed">{cluster.description || 'AI-identified innovation pattern'}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <TagIcon className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm text-gray-600 font-medium">{getClusterKindDisplayName(cluster.kind)}</span>
                                    </div>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full shadow-sm transition-all duration-500" style={{ width: `${Math.min((cluster.weight || 0) * 10, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Empty state
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <SparklesIcon className="h-10 w-10 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">No AI insights yet</h3>
                            <p className="text-gray-600 text-lg mb-6">AI will analyze suggestions and identify patterns</p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span>Processing suggestions...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 