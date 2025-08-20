import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { Topic as ApiTopic } from '@/types/api';
import {
    TagIcon,
    UsersIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    ArrowPathIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Topic {
    id: string;
    label: string;
    description?: string | null;
}

interface TopicFilters {
    search: string;
}

export const TopicsPage: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<TopicFilters>({
        search: ''
    });

    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [showMergeModal, setShowMergeModal] = useState(false);

    // Fetch topics data
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiService.topics.getTopics();
                if (response.ok && response.data) {
                    // Transform API data to match local interface
                    // Only include fields defined in TopicCreate schema: label, description
                    const transformedTopics: Topic[] = response.data.map((apiTopic: ApiTopic) => ({
                        id: apiTopic.id,
                        label: apiTopic.label,
                        description: apiTopic.description || null
                    }));
                    setTopics(transformedTopics);
                }
            } catch (err) {
                console.error('Failed to fetch topics:', err);
                // Fallback to mock data that matches API spec exactly
                const mockTopics: Topic[] = [
                    {
                        id: "1",
                        label: "Digital Banking Innovation",
                        description: "AI-generated topic covering digital banking transformation initiatives"
                    },
                    {
                        id: "2",
                        label: "Mobile App Enhancement",
                        description: "Topic focused on mobile banking application improvements"
                    },
                    {
                        id: "3",
                        label: "Customer Experience",
                        description: "Topic covering customer service and experience improvements"
                    },
                    {
                        id: "4",
                        label: "Security & Compliance",
                        description: "Topic focused on banking security and regulatory compliance"
                    },
                    {
                        id: "5",
                        label: "Operational Efficiency",
                        description: "Topic covering process automation and operational improvements"
                    }
                ];
                setTopics(mockTopics);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const filteredTopics = topics.filter(topic => {
        if (filters.search && !topic.label.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const handleTopicSelection = (topicId: string) => {
        setSelectedTopics(prev =>
            prev.includes(topicId)
                ? prev.filter(id => id !== topicId)
                : [...prev, topicId]
        );
    };

    const canMerge = selectedTopics.length >= 2;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-lg"></div>
                    <p className="mt-6 text-neutral-600 text-lg font-medium">Loading topics...</p>
                    <p className="mt-2 text-neutral-500">Analyzing innovation themes</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />
                    <p className="mt-4 text-red-600 text-lg font-medium">Failed to load topics</p>
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
                    <h1 className="text-2xl font-semibold text-stanbic-900">Topics Management</h1>
                    <p className="text-corporate-600">
                        Manage AI-generated topics and merge related themes
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    {canMerge && (
                        <button
                            onClick={() => setShowMergeModal(true)}
                            className="flex items-center px-4 py-2 bg-stanbic-gold-600 text-white rounded-lg hover:bg-stanbic-gold-700 transition-colors duration-150"
                        >
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Merge Selected ({selectedTopics.length})
                        </button>
                    )}
                    <button className="flex items-center px-4 py-2 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Topic
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-corporate-200 p-6">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-corporate-400" />
                            <input
                                type="text"
                                placeholder="Search topics..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-corporate-300 rounded-lg focus:ring-2 focus:ring-stanbic-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => (
                    <div
                        key={topic.id}
                        className={`bg-white rounded-lg border-2 transition-all duration-150 cursor-pointer ${selectedTopics.includes(topic.id)
                            ? 'border-stanbic-500 bg-stanbic-50'
                            : 'border-corporate-200 hover:border-stanbic-300 hover:shadow-md'
                            }`}
                        onClick={() => handleTopicSelection(topic.id)}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-stanbic-900 mb-2">{topic.label}</h3>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // View details logic
                                        }}
                                        className="p-2 text-corporate-500 hover:text-stanbic-600 hover:bg-stanbic-50 rounded-md transition-colors duration-150"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Edit logic
                                        }}
                                        className="p-2 text-corporate-500 hover:text-stanbic-600 hover:bg-stanbic-50 rounded-md transition-colors duration-150"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Description */}
                                {topic.description && (
                                    <p className="text-sm text-corporate-600 mb-3">{topic.description}</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-corporate-100">
                                    <div className="flex items-center space-x-2">
                                        {selectedTopics.includes(topic.id) && (
                                            <span className="text-stanbic-600 text-sm font-medium">Selected</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTopics.length === 0 && (
                <div className="text-center py-12">
                    <TagIcon className="h-12 w-12 text-corporate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-corporate-900 mb-2">No topics found</h3>
                    <p className="text-corporate-600 mb-4">
                        Try adjusting your filters or create a new topic
                    </p>
                    <button className="px-4 py-2 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150">
                        Create First Topic
                    </button>
                </div>
            )}

            {/* Selection Summary */}
            {selectedTopics.length > 0 && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg border border-corporate-200 p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <TagIcon className="h-5 w-5 text-stanbic-600" />
                            <span className="text-sm font-medium text-stanbic-900">
                                {selectedTopics.length} topics selected
                            </span>
                        </div>
                        <button
                            onClick={() => setSelectedTopics([])}
                            className="text-xs text-corporate-500 hover:text-corporate-700"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}; 