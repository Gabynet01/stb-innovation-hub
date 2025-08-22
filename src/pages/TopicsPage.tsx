import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { Topic } from '@/types/api';
import { ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
import {
    TagIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

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
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [showMergeModal, setShowMergeModal] = useState(false);

    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

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
                    const transformedTopics: Topic[] = response.data.map((apiTopic: Topic) => ({
                        id: apiTopic.id,
                        label: apiTopic.label,
                        description: apiTopic.description || null
                    }));
                    setTopics(transformedTopics);
                } else {
                    setError('Failed to fetch topics');
                }
            } catch (err) {
                console.error('Failed to fetch topics:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch topics');
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const handleDeleteTopic = async (id: string) => {
        showConfirmation({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this topic?',
            type: 'danger'
        }, async () => {
            try {
                setLoading(true);
                setError(null);

                // Note: Delete endpoint not implemented in backend yet
                setError('Delete functionality not yet implemented in backend');
            } catch (err) {
                console.error('Failed to delete topic:', err);
                setError(err instanceof Error ? err.message : 'Failed to delete topic');
            } finally {
                setLoading(false);
            }
        });
    };

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
                    <p className="mt-6 text-primary-600 text-lg font-medium">Loading topics...</p>
                    <p className="mt-2 text-primary-500">Analyzing innovation themes</p>
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
                    <p className="mt-2 text-primary-500">{error}</p>
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
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-primary-900">AI Topics Management</h1>
                        <p className="text-primary-600">
                            Manage and analyze AI-generated suggestion topics
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {canMerge && (
                            <button
                                onClick={() => setShowMergeModal(true)}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <ArrowPathIcon className="h-5 w-5 mr-2" />
                                Merge Selected
                            </button>
                        )}
                        <button
                            onClick={() => setEditingTopic({} as Topic)}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Topic
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-primary-200 p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                                <input
                                    type="text"
                                    placeholder="Search topics..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics List */}
                {topics.length === 0 ? (
                    <div className="text-center py-12">
                        <TagIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary-900 mb-2">No topics found</h3>
                        <p className="text-primary-600 mb-4">
                            No topics match your current filters. Try adjusting your search criteria.
                        </p>
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-sm font-medium text-primary-900 mb-2">How topics work:</h4>
                            <ul className="text-xs text-primary-700 space-y-1 text-left">
                                <li>• Suggestions are automatically analyzed for themes</li>
                                <li>• Common themes are grouped into topics</li>
                                <li>• Topics help organize and categorize suggestions</li>
                                <li>• New topics are created as patterns emerge</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTopics.map((topic) => (
                            <div key={topic.id} className="bg-white rounded-lg border border-primary-200 p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-primary-900 mb-2">{topic.label}</h3>
                                        <p className="text-primary-600 mb-3">
                                            {topic.description || 'No description available'}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedTopics(prev =>
                                                prev.includes(topic.id)
                                                    ? prev.filter(id => id !== topic.id)
                                                    : [...prev, topic.id]
                                            )}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors duration-150 ${selectedTopics.includes(topic.id)
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                                }`}
                                        >
                                            {selectedTopics.includes(topic.id) ? 'Selected' : 'Select'}
                                        </button>
                                        <button
                                            onClick={() => setEditingTopic(topic)}
                                            className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-150"
                                            title="Edit Topic"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTopic(topic.id)}
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                                            title="Delete Topic"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selection Summary */}
                {selectedTopics.length > 0 && (
                    <div className="fixed bottom-6 right-6 bg-white rounded-lg border border-primary-200 p-4 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <TagIcon className="h-5 w-5 text-primary-600" />
                                <span className="text-sm font-medium text-primary-900">
                                    {selectedTopics.length} topics selected
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedTopics([])}
                                className="text-xs text-primary-500 hover:text-primary-700"
                            >
                                Clear
                            </button>
                        </div>
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