import React, { useState, useEffect } from 'react';
import { Topic, Suggestion, SuggestionTopicAssociation } from '@/types/api';
import { useTopics, useSuggestions } from '@/hooks';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { TopicConfidence } from './ui/TopicConfidence';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useSnackbar } from './ui/SnackbarProvider';

interface TopicAssociationManagerProps {
    suggestion: Suggestion;
    onClose: () => void;
}

export const TopicAssociationManager: React.FC<TopicAssociationManagerProps> = ({
    suggestion,
    onClose
}) => {
    const { topics, loading: topicsLoading, associateSuggestionWithTopic, removeSuggestionFromTopic, refreshTopics } = useTopics();
    const { getSuggestionTopics } = useSuggestions();
    const { showSnackbar } = useSnackbar();

    const [suggestionTopics, setSuggestionTopics] = useState<SuggestionTopicAssociation[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [confidence, setConfidence] = useState(0.5);
    const [loading, setLoading] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);

    useEffect(() => {
        loadSuggestionTopics();
        // Refresh topics when component mounts to ensure we have the latest data
        refreshTopics();
    }, [suggestion.id, refreshTopics]);

    const loadSuggestionTopics = async () => {
        setLoadingTopics(true);
        try {
            const topics = await getSuggestionTopics(suggestion.id);
            if (topics) {
                setSuggestionTopics(topics);
            }
        } catch (error) {
            console.error('Failed to load suggestion topics:', error);
        } finally {
            setLoadingTopics(false);
        }
    };

    const handleAssociateTopic = async () => {
        if (!selectedTopicId) return;

        // Debug: Check if the selected topic exists
        const selectedTopic = topics.find(t => t.id === selectedTopicId);
        if (!selectedTopic) {
            console.error('Selected topic not found in topics list:', selectedTopicId);
            console.log('Available topics:', topics.map(t => ({ id: t.id, label: t.label })));
            showSnackbar({
                type: 'error',
                title: 'Topic Not Found',
                message: 'The selected topic was not found. Please refresh and try again.',
                duration: 5000
            });
            return;
        }

        setLoading(true);
        try {
            console.log('Associating suggestion with topic:', {
                suggestionId: suggestion.id,
                topicId: selectedTopicId,
                topicLabel: selectedTopic.label,
                confidence
            });
            const success = await associateSuggestionWithTopic(selectedTopicId, suggestion.id, confidence);
            if (success) {
                showSnackbar({
                    type: 'success',
                    title: 'Topic Associated',
                    message: 'Suggestion has been associated with the topic.',
                    duration: 3000
                });
                await loadSuggestionTopics();
                setSelectedTopicId('');
                setConfidence(0.5);
            }
        } catch (error) {
            console.error('Failed to associate topic:', error);
            showSnackbar({
                type: 'error',
                title: 'Association Failed',
                message: `Failed to associate suggestion with topic: ${error instanceof Error ? error.message : 'Unknown error'}`,
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTopic = async (topicId: string) => {
        setLoading(true);
        try {
            const success = await removeSuggestionFromTopic(topicId, suggestion.id);
            if (success) {
                showSnackbar({
                    type: 'success',
                    title: 'Topic Removed',
                    message: 'Suggestion has been removed from the topic.',
                    duration: 3000
                });
                await loadSuggestionTopics();
            }
        } catch (error) {
            showSnackbar({
                type: 'error',
                title: 'Removal Failed',
                message: 'Failed to remove suggestion from topic.',
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const availableTopics = topics.filter(topic =>
        !suggestionTopics.some(st => st.topic.id === topic.id)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Manage Topic Associations
                    </h3>
                    <p className="text-sm text-gray-600">
                        Associate this suggestion with topics or remove existing associations.
                    </p>
                </div>
                <Button
                    onClick={refreshTopics}
                    variant="outline"
                    size="sm"
                    disabled={topicsLoading}
                >
                    {topicsLoading ? 'Refreshing...' : 'Refresh Topics'}
                </Button>
            </div>

            {/* Current Associations */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Current Associations</h4>
                {loadingTopics ? (
                    <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="sm" />
                    </div>
                ) : suggestionTopics.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No topic associations</p>
                ) : (
                    <div className="space-y-2">
                        {suggestionTopics.map((association) => (
                            <div key={association.topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <TopicConfidence
                                    topic={association.topic}
                                    confidence={association.confidence}
                                    size="sm"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveTopic(association.topic.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add New Association */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Add New Association
                    <span className="text-xs text-gray-500 ml-2">
                        ({availableTopics.length} topics available)
                    </span>
                </h4>

                {topicsLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2 text-sm text-gray-600">Loading topics...</span>
                    </div>
                ) : availableTopics.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">No topics available for association</p>
                        <p className="text-xs text-gray-400">
                            {topics.length === 0
                                ? "No topics have been created yet. Create some topics first."
                                : "All topics are already associated with this suggestion."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Select
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            disabled={topicsLoading || loading}
                            options={[
                                { value: '', label: 'Select a topic...' },
                                ...availableTopics.map((topic) => ({
                                    value: topic.id,
                                    label: topic.label
                                }))
                            ]}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confidence Level
                            </label>
                            <Input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={confidence}
                                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0%</span>
                                <span>{Math.round(confidence * 100)}%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleAssociateTopic}
                            disabled={!selectedTopicId || loading}
                            className="w-full"
                        >
                            {loading ? 'Associating...' : 'Associate Topic'}
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
};
