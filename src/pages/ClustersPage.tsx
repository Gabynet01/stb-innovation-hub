import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { Cluster } from '@/types/api';
import { ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
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
    const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);

    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

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
                    const transformedClusters: Cluster[] = response.data.map((apiCluster: any) => ({
                        id: apiCluster.id,
                        kind: apiCluster.kind,
                        title: apiCluster.title || null,
                        description: apiCluster.description || null,
                        tags: apiCluster.tags || [],
                        weight: apiCluster.weight || 0,
                        status: apiCluster.status || 'NEW',
                        primary_topic_id: apiCluster.primary_topic_id || null,
                        fusion_params: apiCluster.fusion_params || null,
                        created_at: apiCluster.created_at || new Date().toISOString(),
                        updated_at: apiCluster.updated_at || new Date().toISOString()
                    }));
                    setClusters(transformedClusters);
                } else {
                    setError('Failed to fetch clusters');
                }
            } catch (err) {
                console.error('Failed to fetch clusters:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch clusters');
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    const handleDeleteCluster = async (id: string) => {
        showConfirmation({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this cluster?',
            type: 'danger'
        }, async () => {
            try {
                setLoading(true);
                setError(null);

                // Note: Delete endpoint not implemented in backend yet
                setError('Delete functionality not yet implemented in backend');
            } catch (err) {
                console.error('Failed to delete cluster:', err);
                setError(err instanceof Error ? err.message : 'Failed to delete cluster');
            } finally {
                setLoading(false);
            }
        });
    };

    const filteredClusters = clusters.filter(cluster => {
        if (filters.kind && cluster.kind !== filters.kind) return false;
        if (filters.search && cluster.title && !cluster.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const getClusterKindColor = (kind: string) => {
        switch (kind) {
            case 'TOPIC': return 'bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 text-[#0051FF] border-[#0051FF]/30';
            case 'FUSION': return 'bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 text-[#0051FF] border-[#0051FF]/30';
            case 'EMBEDDING': return 'bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 text-[#0051FF] border-[#0051FF]/30';
            case 'TAG': return 'bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 text-[#0051FF] border-[#0051FF]/30';
            default: return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#0051FF] mx-auto shadow-lg"></div>
                    <p className="mt-6 text-[#0051FF] text-lg font-medium">Loading clusters...</p>
                    <p className="mt-2 text-slate-500">Analyzing innovation patterns</p>
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
                    <p className="mt-2 text-slate-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-[#0051FF] to-[#0047E6] text-white rounded-lg hover:from-[#0047E6] hover:to-[#0038CC] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">AI Clusters Management</h1>
                        <p className="text-[#0051FF]">
                            Manage and analyze AI-generated suggestion clusters
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-[#0051FF] to-[#0047E6] text-white rounded-lg hover:from-[#0047E6] hover:to-[#0038CC] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Cluster
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#0051FF]" />
                                <input
                                    type="text"
                                    placeholder="Search clusters..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051FF] focus:border-[#0051FF] transition-all duration-200"
                                />
                            </div>
                        </div>

                        <select
                            value={filters.kind}
                            onChange={(e) => setFilters({ ...filters, kind: e.target.value })}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051FF] focus:border-[#0051FF] transition-all duration-200"
                        >
                            <option value="">All Kinds</option>
                            <option value="EMBEDDING">Embedding</option>
                            <option value="TAG">Tag</option>
                            <option value="TOPIC">Topic</option>
                            <option value="FUSION">Fusion</option>
                        </select>
                    </div>
                </div>

                {/* Clusters List */}
                {clusters.length === 0 ? (
                    <div className="text-center py-12">
                        <TagIcon className="h-12 w-12 text-[#0051FF] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No clusters found</h3>
                        <p className="text-[#0051FF] mb-4">
                            No clusters match your current filters. Try adjusting your search criteria.
                        </p>
                        <div className="bg-gradient-to-r from-[#0051FF]/5 to-[#0047E6]/10 border border-[#0051FF]/20 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-sm font-medium text-slate-900 mb-2">How clusters work:</h4>
                            <ul className="text-xs text-[#0051FF] space-y-1 text-left">
                                <li>• Suggestions are automatically analyzed for similarity</li>
                                <li>• Related suggestions are grouped into clusters</li>
                                <li>• Clusters help identify common themes and patterns</li>
                                <li>• New clusters are created as more suggestions are added</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredClusters.map((cluster) => (
                            <div key={cluster.id} className="bg-white rounded-lg border border-primary-200 p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${cluster.kind === 'TOPIC' ? 'bg-primary-100 text-primary-700 border-primary-200' :
                                                cluster.kind === 'FUSION' ? 'bg-accent-100 text-accent-700 border-accent-200' :
                                                    'bg-primary-100 text-primary-700 border-primary-200'
                                                }`}>
                                                {cluster.kind}
                                            </span>
                                            {cluster.primary_topic_id && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-700 border-green-200">
                                                    Primary Topic
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-primary-900 mb-2">
                                            {cluster.title || `Cluster ${cluster.id.slice(0, 8)}`}
                                        </h3>

                                        <p className="text-primary-600 mb-3">
                                            {cluster.description || 'No description available'}
                                        </p>

                                        {cluster.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {cluster.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-md">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedCluster(cluster)}
                                            className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-150"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingCluster(cluster)}
                                            className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-150"
                                            title="Edit Cluster"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCluster(cluster.id)}
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                                            title="Delete Cluster"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmation && (
                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={hideConfirmation}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                    type={confirmation.type}
                />
            )}
        </>
    );
}; 