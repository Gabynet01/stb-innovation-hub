import React from 'react';
import { Topic } from '@/types/api';
import TopicCard from './TopicCard';

interface TopicListProps {
    topics: Topic[];
    viewMode: 'grid' | 'list';
    onEdit: (topic: Topic) => void;
    onDelete: (topic: Topic) => void;
    onView: (topic: Topic) => void;
}

const TopicList: React.FC<TopicListProps> = ({
    topics,
    viewMode,
    onEdit,
    onDelete,
    onView
}) => {
    if (topics.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
                <p className="text-gray-500">Get started by creating your first topic</p>
            </div>
        );
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                    <TopicCard
                        key={topic.id}
                        topic={topic}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                    />
                ))}
            </div>
        );
    }

    // List view
    return (
        <div className="space-y-3">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => onView(topic)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {topic.label}
                            </h3>
                            {topic.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {topic.description}
                                </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Created: {new Date(topic.created_at).toLocaleDateString()}</span>
                                <span>Updated: {new Date(topic.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(topic);
                                }}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(topic);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopicList;
