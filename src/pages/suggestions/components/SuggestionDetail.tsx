import React, { useState } from 'react';
import { Suggestion } from '@/types/api';
import { ConfirmationModal, Button } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
import { TopicAssociationManager } from '@/components/TopicAssociationManager';
import { SuggestionHeader } from './SuggestionHeader';
import { SuggestionContent } from './SuggestionContent';
import { SuggestionFooter } from './SuggestionFooter';
import { TagIcon } from '@heroicons/react/24/outline';

interface SuggestionDetailProps {
    suggestion: Suggestion;
    onClose: () => void;
    onEdit?: (suggestion: Suggestion) => void;
    onDelete?: (id: string) => void;
}

export const SuggestionDetail: React.FC<SuggestionDetailProps> = ({
    suggestion,
    onClose,
    onEdit,
    onDelete
}) => {
    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();
    const [showTopicManager, setShowTopicManager] = useState(false);

    const handleDelete = () => {
        showConfirmation({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this suggestion? This action cannot be undone.',
            type: 'danger'
        }, () => {
            onDelete?.(suggestion.id);
            onClose();
        });
    };

    const handleEdit = () => {
        onEdit?.(suggestion);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                    <SuggestionHeader
                        suggestion={suggestion}
                        onClose={onClose}
                    />

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                        <SuggestionContent suggestion={suggestion} />

                        {/* Topic Management Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TagIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Topic Associations</h3>
                                        <p className="text-sm text-gray-600">Manage which topics this suggestion belongs to</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowTopicManager(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <TagIcon className="w-4 h-4 mr-2" />
                                    Manage Topics
                                </Button>
                            </div>

                            {/* Current Topic Display */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">Current Topics:</span>
                                    {suggestion.topic_id ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                {suggestion.topic_label}
                                            </span>
                                            {suggestion.topic_confidence && (
                                                <span className="text-xs text-gray-500">
                                                    ({Math.round(suggestion.topic_confidence * 100)}% confidence)
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500 italic">No topics assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <SuggestionFooter
                        onClose={onClose}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
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

            {/* Topic Association Manager Modal */}
            {showTopicManager && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Manage Topic Associations
                                </h2>
                                <button
                                    onClick={() => setShowTopicManager(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <TopicAssociationManager
                                suggestion={suggestion}
                                onClose={() => setShowTopicManager(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 