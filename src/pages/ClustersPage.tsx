import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { Cluster as ApiCluster, ClusterKind } from '@/types/api';
import {
    TagIcon,
    UsersIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChartBarIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Cluster {
    id: string;
    kind: ClusterKind;
    title?: string | null;
    description?: string | null;
    tags: string[];
    primary_topic_id?: string | null;
    fusion_params?: Record<string, any> | null;
}

interface ClusterFilters {
    kind: string;
    search: string;
}

export const ClustersPage: React.FC = () => {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<ClusterFilters>({
        kind: '',
        search: ''
    });

    const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Fetch clusters data
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiService.clusters.getClusters();
                if (response.ok && response.data) {
                    // Transform API data to match local interface
                    // Only include fields defined in ClusterCreate schema: kind, title, description, tags, primary_topic_id, fusion_params
                    const transformedClusters: Cluster[] = response.data.map((apiCluster: ApiCluster) => ({
                        id: apiCluster.id,
                        kind: apiCluster.kind,
                        title: apiCluster.title || null,
                        description: apiCluster.description || null,
                        tags: apiCluster.tags || [],
                        primary_topic_id: apiCluster.primary_topic_id || null,
                        fusion_params: apiCluster.fusion_params || null
                    }));
                    setClusters(transformedClusters);
                }
            } catch (err) {
                console.error('Failed to fetch clusters:', err);
                // Fallback to mock data that matches API spec exactly
                const mockClusters: Cluster[] = [
                    {
                        id: "1",
                        kind: ClusterKind.TOPIC,
                        title: "Digital Banking Innovation",
                        description: "AI-generated cluster of digital banking related suggestions",
                        tags: ["digital", "banking", "innovation"],
                        primary_topic_id: "topic-001",
                        fusion_params: null
                    },
                    {
                        id: "2",
                        kind: ClusterKind.EMBEDDING,
                        title: "Mobile App Features",
                        description: "Semantic cluster of mobile app enhancement suggestions",
                        tags: ["mobile", "app", "features"],
                        primary_topic_id: null,
                        fusion_params: { similarity_threshold: 0.8 }
                    },
                    {
                        id: "3",
                        kind: ClusterKind.FUSION,
                        title: "Customer Experience",
                        description: "Fused cluster combining multiple related suggestion themes",
                        tags: ["customer", "experience", "service"],
                        primary_topic_id: "topic-002",
                        fusion_params: { fusion_method: "weighted_average" }
                    },
                    {
                        id: "4",
                        kind: ClusterKind.TAG,
                        title: "Security Enhancements",
                        description: "Tag-based cluster of security-related suggestions",
                        tags: ["security", "authentication", "privacy"],
                        primary_topic_id: null,
                        fusion_params: null
                    }
                ];
                setClusters(mockClusters);
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    const filteredClusters = clusters.filter(cluster => {
        if (filters.kind && cluster.kind !== filters.kind) return false;
        if (filters.search && cluster.title && !cluster.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const getClusterKindColor = (kind: string) => {
        switch (kind) {
            case 'TOPIC': return 'bg-stanbic-100 text-stanbic-700 border-stanbic-200';
            case 'FUSION': return 'bg-stanbic-gold-100 text-stanbic-gold-700 border-stanbic-gold-200';
            case 'EMBEDDING': return 'bg-corporate-100 text-corporate-700 border-corporate-200';
            case 'TAG': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-lg"></div>
                    <p className="mt-6 text-neutral-600 text-lg font-medium">Loading clusters...</p>
                    <p className="mt-2 text-neutral-500">Analyzing innovation patterns</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />
                    <p className="mt-4 text-red-600 text-lg font-medium">Failed to load clusters</p>
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-stanbic-900">AI Clusters Management</h1>
                    <p className="text-corporate-600">
                        Manage and analyze AI-generated suggestion clusters
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Cluster
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-corporate-200 p-6">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corporate-400" />
                            <input
                                type="text"
                                placeholder="Search clusters..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-corporate-300 rounded-lg focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={filters.kind}
                        onChange={(e) => setFilters({ ...filters, kind: e.target.value })}
                        className="px-4 py-2 border border-corporate-300 rounded-lg focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                    >
                        <option value="">All Kinds</option>
                        <option value="EMBEDDING">Embedding</option>
                        <option value="TAG">Tag</option>
                        <option value="TOPIC">Topic</option>
                        <option value="FUSION">Fusion</option>
                    </select>
                </div>
            </div>

            {/* Clusters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClusters.map((cluster) => (
                    <div key={cluster.id} className="bg-white rounded-lg border border-corporate-200 p-6 hover:shadow-md transition-shadow duration-150">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-stanbic-900 mb-2">{cluster.title}</h3>
                                <p className="text-sm text-corporate-600 mb-3">{cluster.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedCluster(cluster)}
                                    className="p-2 text-corporate-500 hover:text-stanbic-600 hover:bg-stanbic-50 rounded-md transition-colors duration-150"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-corporate-500 hover:text-stanbic-600 hover:bg-stanbic-50 rounded-md transition-colors duration-150">
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Kind */}
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getClusterKindColor(cluster.kind)}`}>
                                    {cluster.kind}
                                </span>
                            </div>

                            {/* Primary Topic ID if available */}
                            {cluster.primary_topic_id && (
                                <div className="text-sm text-corporate-600">
                                    <span className="font-medium">Primary Topic:</span> {cluster.primary_topic_id}
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                                {cluster.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-corporate-100 text-corporate-700 text-xs rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-corporate-100">
                                <button className="text-sm text-stanbic-600 hover:text-stanbic-700 font-medium">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredClusters.length === 0 && (
                <div className="text-center py-12">
                    <TagIcon className="h-12 w-12 text-corporate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-corporate-900 mb-2">No clusters found</h3>
                    <p className="text-corporate-600 mb-4">
                        Try adjusting your filters or create a new cluster
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150"
                    >
                        Create First Cluster
                    </button>
                </div>
            )}
        </div>
    );
}; 