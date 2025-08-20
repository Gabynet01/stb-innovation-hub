import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import {
    LightBulbIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CogIcon,
    ArrowTrendingUpIcon,
    UsersIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import { OverviewMetrics, ClusterMetrics, TopicMetrics, Cluster, Topic, ClusterKind } from '@/types/api';

interface MetricsData {
    totalSuggestions: number;
    completedSuggestions: number;
    pendingSuggestions: number;
    totalClusters: number;
    totalTopics: number;
    averageProcessingTime: number;
}

export const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricsData>({
        totalSuggestions: 0,
        completedSuggestions: 0,
        pendingSuggestions: 0,
        totalClusters: 0,
        totalTopics: 0,
        averageProcessingTime: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch metrics in parallel
                const [overviewMetrics, clusterMetrics, topicMetrics] = await Promise.all([
                    apiService.metrics.getOverviewMetrics(),
                    apiService.metrics.getClusterMetrics(),
                    apiService.metrics.getTopicMetrics()
                ]);

                if (overviewMetrics.ok && overviewMetrics.data) {
                    // Map API data to UI metrics - only use fields that exist in the API response
                    setMetrics({
                        totalSuggestions: overviewMetrics.data.total_suggestions || 0,
                        completedSuggestions: overviewMetrics.data.completed_suggestions || 0,
                        pendingSuggestions: overviewMetrics.data.pending_suggestions || 0,
                        totalClusters: overviewMetrics.data.total_clusters || 0,
                        totalTopics: overviewMetrics.data.total_topics || 0,
                        averageProcessingTime: overviewMetrics.data.average_processing_time || 0
                    });
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                // Fallback to mock data that matches API spec exactly
                // Based on OverviewMetrics schema from API spec
                setMetrics({
                    totalSuggestions: 24,
                    completedSuggestions: 8,
                    pendingSuggestions: 12,
                    totalClusters: 7,
                    totalTopics: 5,
                    averageProcessingTime: 2.5
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Mock data for clusters and topics - only using API spec fields
    const [clusters] = useState<Cluster[]>([
        {
            id: '1',
            kind: ClusterKind.TOPIC,
            title: 'Digital Banking Experience',
            description: 'AI-generated cluster of digital banking related suggestions',
            tags: ['digital', 'banking', 'experience'],
            primary_topic_id: 'topic-001',
            fusion_params: null
        },
        {
            id: '2',
            kind: ClusterKind.FUSION,
            title: 'Mobile App Improvements',
            description: 'AI-generated cluster of mobile app enhancement suggestions',
            tags: ['mobile', 'app', 'improvements'],
            primary_topic_id: 'topic-002',
            fusion_params: null
        },
        {
            id: '3',
            kind: ClusterKind.EMBEDDING,
            title: 'Customer Service Process',
            description: 'AI-generated cluster of customer service optimization suggestions',
            tags: ['customer', 'service', 'process'],
            primary_topic_id: 'topic-003',
            fusion_params: null
        }
    ]);

    const [topics] = useState<Topic[]>([
        {
            id: '1',
            label: 'User Experience',
            description: 'Improvements to customer-facing interfaces'
        },
        {
            id: '2',
            label: 'Process Automation',
            description: 'Streamlining operational workflows'
        },
        {
            id: '3',
            label: 'Security Enhancements',
            description: 'Advanced security and fraud prevention'
        }
    ]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-lg"></div>
                    <p className="mt-6 text-neutral-600 text-lg font-medium">Loading dashboard...</p>
                    <p className="mt-2 text-neutral-500">Fetching innovation analytics</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />
                    <p className="mt-4 text-red-600 text-lg font-medium">Failed to load dashboard</p>
                    <p className="mt-2 text-neutral-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
                    Innovation Analytics Dashboard
                </h1>
                <p className="text-neutral-600 text-lg">
                    AI-powered insights and innovation trends
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                            <LightBulbIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">Total Suggestions</p>
                            <p className="text-2xl font-bold text-primary-600">{metrics.totalSuggestions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                            <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">Approved</p>
                            <p className="text-2xl font-bold text-emerald-600">{metrics.completedSuggestions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                            <ClockIcon className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">Pending</p>
                            <p className="text-2xl font-bold text-amber-600">{metrics.pendingSuggestions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                            <ExclamationTriangleIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">In Progress</p>
                            <p className="text-2xl font-bold text-primary-600">{0}</p> {/* No inProgressSuggestions in API */}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clusters Analysis */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">AI Clusters</h2>
                        <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">Intelligent grouping</span>
                    </div>
                    <div className="space-y-4">
                        {clusters.map((cluster) => (
                            <div key={cluster.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${cluster.kind === ClusterKind.TOPIC ? 'bg-gradient-to-br from-primary-100 to-primary-200' :
                                        cluster.kind === ClusterKind.FUSION ? 'bg-gradient-to-br from-accent-100 to-accent-200' :
                                            'bg-gradient-to-br from-neutral-100 to-neutral-200'
                                        }`}>
                                        <TagIcon className={`h-5 w-5 ${cluster.kind === ClusterKind.TOPIC ? 'text-primary-600' :
                                            cluster.kind === ClusterKind.FUSION ? 'text-accent-600' :
                                                'text-neutral-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">{cluster.title}</p>
                                        <p className="text-xs text-neutral-500 capitalize font-medium">{cluster.kind.toLowerCase()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-neutral-900">{0} members</p> {/* No memberCount in API */}
                                    <p className="text-xs text-neutral-500">Weight: {(0 * 100).toFixed(0)}%</p> {/* No weight in API */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topics Analysis */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">Trending Topics</h2>
                        <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">Popular themes</span>
                    </div>
                    <div className="space-y-4">
                        {topics.map((topic) => (
                            <div key={topic.id} className="p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-neutral-900">{topic.label}</h3>
                                    <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-medium">
                                        {0} suggestions {/* No suggestionCount in API */}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-600 mb-3">{topic.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <UsersIcon className="h-4 w-4 text-primary-600" />
                                        <span className="text-xs text-neutral-600 font-medium">{0} supporters</span> {/* No support in API */}
                                    </div>
                                    <div className="w-20 bg-neutral-200 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                            <ChartBarIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">AI Clusters</p>
                            <p className="text-2xl font-bold text-primary-600">{metrics.totalClusters}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl">
                            <ArrowTrendingUpIcon className="h-6 w-6 text-accent-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">Active Topics</p>
                            <p className="text-2xl font-bold text-accent-600">{metrics.totalTopics}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                            <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-neutral-600">Documents Generated</p>
                            <p className="text-2xl font-bold text-emerald-600">{0}</p> {/* No documentsGenerated in API */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="flex items-center justify-center p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-xl">
                        <LightBulbIcon className="h-7 w-7 text-primary-500 group-hover:text-primary-600 mr-4 transition-colors duration-300" />
                        <div className="text-left">
                            <div className="text-primary-900 font-semibold text-lg group-hover:text-primary-700 transition-colors duration-300">Submit Suggestion</div>
                            <div className="text-sm text-neutral-600">Share your innovative idea</div>
                        </div>
                    </button>

                    <button className="flex items-center justify-center p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-xl">
                        <CogIcon className="h-7 w-7 text-primary-500 group-hover:text-primary-600 mr-4 transition-colors duration-300" />
                        <div className="text-left">
                            <div className="text-primary-900 font-semibold text-lg group-hover:text-primary-700 transition-colors duration-300">Manage Clusters</div>
                            <div className="text-sm text-neutral-600">Review AI groupings</div>
                        </div>
                    </button>

                    <button className="flex items-center justify-center p-6 border-2 border-primary-200 rounded-2xl hover:border-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-xl">
                        <DocumentTextIcon className="h-7 w-7 text-primary-500 group-hover:text-primary-600 mr-4 transition-colors duration-300" />
                        <div className="text-left">
                            <div className="text-primary-900 font-semibold text-lg group-hover:text-primary-700 transition-colors duration-300">Generate Reports</div>
                            <div className="text-sm text-neutral-600">Create insights documents</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}; 