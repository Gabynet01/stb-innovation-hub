import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type {
    Cluster,
    Topic,
    Suggestion,
    OverviewMetrics,
    ClusterMetrics,
    TopicMetrics,
    GenerationMetrics
} from '../../types/api';
import { DashboardHero } from './components/DashboardHero';
import { MetricsGrid } from './components/MetricsGrid';
import { ContentGrid } from './components/ContentGrid';
import { QuickActions } from './components/QuickActions';
import { LoadingSpinner, ErrorState } from '../../components/ui';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
    const [clusterMetrics, setClusterMetrics] = useState<ClusterMetrics | null>(null);
    const [topicMetrics, setTopicMetrics] = useState<TopicMetrics | null>(null);
    const [generationMetrics, setGenerationMetrics] = useState<GenerationMetrics | null>(null);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel for better performance
                const [
                    suggestionsResponse,
                    clustersResponse,
                    topicsResponse,
                    overviewMetricsResponse,
                    clusterMetricsResponse,
                    topicMetricsResponse,
                    generationMetricsResponse
                ] = await Promise.all([
                    apiService.suggestions.getSuggestions({ page_size: 100 }),
                    apiService.clusters.getClusters({ page_size: 100 }),
                    apiService.topics.getTopics({ page_size: 100 }),
                    apiService.metrics.getOverviewMetrics(),
                    apiService.metrics.getClusterMetrics(),
                    apiService.metrics.getTopicMetrics(),
                    apiService.metrics.getGenerationMetrics()
                ]);

                // Set data from responses
                if (suggestionsResponse.ok && suggestionsResponse.data) {
                    setSuggestions(suggestionsResponse.data);
                }

                if (clustersResponse.ok && clustersResponse.data) {
                    setClusters(clustersResponse.data);
                }

                if (topicsResponse.ok && topicsResponse.data) {
                    setTopics(topicsResponse.data);
                }

                // Set metrics data
                if (overviewMetricsResponse.ok && overviewMetricsResponse.data) {
                    setOverviewMetrics(overviewMetricsResponse.data);
                }

                if (clusterMetricsResponse.ok && clusterMetricsResponse.data) {
                    setClusterMetrics(clusterMetricsResponse.data);
                }

                if (topicMetricsResponse.ok && topicMetricsResponse.data) {
                    setTopicMetrics(topicMetricsResponse.data);
                }

                if (generationMetricsResponse.ok && generationMetricsResponse.data) {
                    setGenerationMetrics(generationMetricsResponse.data);
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

    const handleViewClusters = () => {
        navigate('/clusters');
    };

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

    if (error) {
        return <ErrorState
            error={error}
            title="Failed to load innovation dashboard"
            onRetry={() => window.location.reload()}
            retryText="Try Again"
        />;
    }

    return (
        <div className="space-y-12">
            <DashboardHero
                systemStatus={overviewMetrics?.system_status || 'operational'}
            />
            <MetricsGrid
                overviewMetrics={overviewMetrics}
                clusterMetrics={clusterMetrics}
                topicMetrics={topicMetrics}
                generationMetrics={generationMetrics}
                suggestions={suggestions}
            />
            <ContentGrid
                clusters={clusters}
                topics={topics}
                suggestions={suggestions}
                onViewClusters={handleViewClusters}
            />
            <QuickActions onViewClusters={handleViewClusters} />
        </div>
    );
}; 