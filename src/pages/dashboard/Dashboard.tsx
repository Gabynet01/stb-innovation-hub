import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { Cluster, Topic, Suggestion, ClusterMetrics, TopicMetrics } from '../../types/api';
import { DashboardHero } from './components/DashboardHero';
import { MetricsGrid } from './components/MetricsGrid';
import { ContentGrid } from './components/ContentGrid';
import { QuickActions } from './components/QuickActions';
import { LoadingSpinner, ErrorState } from '../../components/ui';

interface DashboardMetrics {
    totalSuggestions: number;
    completedSuggestions: number;
    pendingSuggestions: number;
    totalClusters: number;
    totalTopics: number;
    teamEngagement: number;
    systemStatus: string;
    clusterMetrics?: ClusterMetrics;
    topicMetrics?: TopicMetrics;
}

export const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel for better performance
                const [
                    suggestionsResponse,
                    clustersResponse,
                    topicsResponse,
                    overviewMetricsResponse,
                    clusterMetricsResponse,
                    topicMetricsResponse
                ] = await Promise.all([
                    apiService.suggestions.getSuggestions({ page_size: 100 }),
                    apiService.clusters.getClusters({ page_size: 100 }),
                    apiService.topics.getTopics({ page_size: 100 }),
                    apiService.metrics.getOverviewMetrics(),
                    apiService.metrics.getClusterMetrics(),
                    apiService.metrics.getTopicMetrics()
                ]);

                if (suggestionsResponse.ok && suggestionsResponse.data) {
                    const suggestionsData = suggestionsResponse.data || [];
                    setSuggestions(suggestionsData);

                    // Calculate metrics from real data
                    const calculatedMetrics: DashboardMetrics = {
                        totalSuggestions: suggestionsData.length,
                        completedSuggestions: suggestionsData.filter(s => s.status === 'PROCESSED').length,
                        pendingSuggestions: suggestionsData.filter(s => s.status === 'NEW').length,
                        totalClusters: clustersResponse.ok ? (clustersResponse.data?.length || 0) : 0,
                        totalTopics: topicsResponse.ok ? (topicsResponse.data?.length || 0) : 0,
                        teamEngagement: Math.floor(Math.random() * 20 + 80), // Mock for now
                        systemStatus: overviewMetricsResponse.ok && overviewMetricsResponse.data
                            ? overviewMetricsResponse.data.system_status
                            : 'operational'
                    };

                    // Add detailed metrics if available
                    if (clusterMetricsResponse.ok && clusterMetricsResponse.data) {
                        calculatedMetrics.clusterMetrics = clusterMetricsResponse.data;
                    }

                    if (topicMetricsResponse.ok && topicMetricsResponse.data) {
                        calculatedMetrics.topicMetrics = topicMetricsResponse.data;
                    }

                    setMetrics(calculatedMetrics);
                }

                if (clustersResponse.ok && clustersResponse.data) {
                    setClusters(clustersResponse.data || []);
                }

                if (topicsResponse.ok && topicsResponse.data) {
                    setTopics(topicsResponse.data || []);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <LoadingSpinner size="lg" color="primary" />
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                        Loading innovation dashboard...
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Fetching your innovation data
                    </p>
                </div>
            </div>
        );
    }

    if (error || !metrics) {
        return <ErrorState
            error={error}
            title="Failed to load innovation dashboard"
            onRetry={() => window.location.reload()}
            retryText="Try Again"
        />;
    }

    return (
        <div className="space-y-12">
            <DashboardHero systemStatus={metrics.systemStatus} />
            <MetricsGrid metrics={metrics} />
            <ContentGrid
                clusters={clusters}
                topics={topics}
                suggestions={suggestions}
            />
            <QuickActions />
        </div>
    );
}; 