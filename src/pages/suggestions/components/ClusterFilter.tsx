import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { Cluster, Topic } from '@/types/api';
import { ClusterBadge, TopicBadge } from '@/components/ui';
import {
    SparklesIcon,
    ChartBarIcon,
    XMarkIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface ClusterFilterProps {
    selectedClusterId?: string;
    selectedTopicId?: string;
    onClusterSelect: (clusterId: string | null) => void;
    onTopicSelect: (topicId: string | null) => void;
    onClear: () => void;
}

export const ClusterFilter: React.FC<ClusterFilterProps> = ({
    selectedClusterId,
    selectedTopicId,
    onClusterSelect,
    onTopicSelect,
    onClear
}) => {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'clusters' | 'topics'>('clusters');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [clustersResponse, topicsResponse] = await Promise.all([
                    apiService.clusters.getClusters({ page_size: 50 }),
                    apiService.topics.getTopics({ page_size: 50 })
                ]);

                if (clustersResponse.ok && clustersResponse.data) {
                    setClusters(clustersResponse.data);
                }

                if (topicsResponse.ok && topicsResponse.data) {
                    setTopics(topicsResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch clusters and topics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredClusters = clusters.filter(cluster =>
        cluster.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cluster.kind.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTopics = topics.filter(topic =>
        topic.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCluster = clusters.find(c => c.id === selectedClusterId);
    const selectedTopic = topics.find(t => t.id === selectedTopicId);

    const hasSelection = selectedClusterId || selectedTopicId;

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#0051FF]"></div>
                    <span className="ml-3 text-slate-600">Loading AI insights...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">AI Insights Filter</h3>
                    {hasSelection && (
                        <button
                            onClick={onClear}
                            className="flex items-center space-x-1 text-slate-500 hover:text-red-600 transition-colors duration-200"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            <span className="text-sm">Clear</span>
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search clusters and topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051FF] focus:border-[#0051FF] transition-all duration-200 text-sm"
                    />
                </div>
            </div>

            {/* Selected Items */}
            {hasSelection && (
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Selected:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedCluster && (
                            <ClusterBadge
                                kind={selectedCluster.kind}
                                title={selectedCluster.title}
                                size="sm"
                                interactive={false}
                            />
                        )}
                        {selectedTopic && (
                            <TopicBadge
                                label={selectedTopic.label}
                                size="sm"
                                interactive={false}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('clusters')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'clusters'
                        ? 'text-[#0051FF] border-b-2 border-[#0051FF] bg-blue-50'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Clusters ({filteredClusters.length})</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('topics')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'topics'
                        ? 'text-[#0051FF] border-b-2 border-[#0051FF] bg-blue-50'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <ChartBarIcon className="w-4 h-4" />
                        <span>Topics ({filteredTopics.length})</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto">
                {activeTab === 'clusters' ? (
                    <div className="p-4 space-y-2">
                        {filteredClusters.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <SparklesIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No clusters found</p>
                            </div>
                        ) : (
                            filteredClusters.map((cluster) => (
                                <button
                                    key={cluster.id}
                                    onClick={() => onClusterSelect(cluster.id)}
                                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${selectedClusterId === cluster.id
                                        ? 'border-[#0051FF] bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <ClusterBadge
                                        kind={cluster.kind}
                                        title={cluster.title}
                                        size="sm"
                                        interactive={false}
                                    />
                                </button>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {filteredTopics.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <ChartBarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No topics found</p>
                            </div>
                        ) : (
                            filteredTopics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => onTopicSelect(topic.id)}
                                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${selectedTopicId === topic.id
                                        ? 'border-[#0051FF] bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <TopicBadge
                                        label={topic.label}
                                        size="sm"
                                        interactive={false}
                                    />
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
