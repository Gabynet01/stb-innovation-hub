import React, { useState, useEffect } from 'react';
import { Topic, TopicSuggestionAssociation } from '@/types/api';
import { useTopics } from '@/hooks';
import { Button, LoadingSpinner, TopicConfidence } from '@/components/ui';
import { XMarkIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import { getRelativeTime } from '@/utils/date';

interface TopicDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: Topic;
    onEdit?: (topic: Topic) => void;
    onDelete?: (topicId: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
    isOpen,
    onClose,
    topic,
    onEdit,
    onDelete
}) => {
    const { getTopicSuggestions } = useTopics();
    const [suggestions, setSuggestions] = useState<TopicSuggestionAssociation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadSuggestions();
        }
    }, [isOpen, topic.id]);

    const loadSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const topicSuggestions = await getTopicSuggestions(topic.id);
            if (topicSuggestions) {
                setSuggestions(topicSuggestions);
            }
        } catch (err) {
            setError('Failed to load suggestions for this topic');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-blue-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <TagIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{topic.label}</h3>
                                    {topic.description && (
                                        <p className="text-blue-100 mt-1">{topic.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {onEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(topic)}
                                        className="flex items-center space-x-1"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDelete(topic.id)}
                                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span>Delete</span>
                                    </Button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* Topic Info */}
                        <div className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Created:</span>
                                    <p>{new Date(topic.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Updated:</span>
                                    <p>{getRelativeTime(topic.updated_at)}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Suggestions:</span>
                                    <p>{suggestions.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">
                                Associated Suggestions ({suggestions.length})
                            </h4>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <Button onClick={loadSuggestions} variant="outline">
                                        Try Again
                                    </Button>
                                </div>
                            ) : suggestions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No suggestions associated with this topic yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {suggestions.map((association, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 mb-1">
                                                        {association.suggestion.title}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                        {association.suggestion.body}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                        <span>{association.suggestion.author_type}</span>
                                                        <span>•</span>
                                                        <span>{association.suggestion.category}</span>
                                                        <span>•</span>
                                                        <span>{getRelativeTime(association.suggestion.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <TopicConfidence
                                                        topic={topic}
                                                        confidence={association.confidence}
                                                        showLabel={false}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};