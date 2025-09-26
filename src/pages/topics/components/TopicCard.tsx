import React from 'react';
import { Topic } from '@/types/api';
import { TagIcon, EyeIcon, PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TopicCardProps {
    topic: Topic;
    onEdit: (topic: Topic) => void;
    onDelete: (topic: Topic) => void;
    onView: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
    topic,
    onEdit,
    onDelete,
    onView
}) => {
    return (
        <div
            className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer min-h-[320px] flex flex-col"
            onClick={() => onView(topic)}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20">
                <div className="flex items-center space-x-3">
                    {/* Topic Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                        <TagIcon className="w-5 h-5 text-gray-700" />
                    </div>

                    {/* Topic Info */}
                    <div>
                        <span className="text-sm font-semibold text-gray-900">
                            Topic
                        </span>
                        <span className="text-xs text-gray-600 ml-2 font-medium">
                            {new Date(topic.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Empty space for alignment */}
                <div></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-white/30 to-white/10">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                    {topic.label}
                </h3>

                {/* Description */}
                {topic.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1 font-medium">
                        {topic.description.length > 120
                            ? `${topic.description.substring(0, 120)}...`
                            : topic.description
                        }
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>Created: {new Date(topic.created_at).toLocaleDateString()}</span>
                        </span>
                    </div>
                    <span className="text-gray-400">
                        Updated: {new Date(topic.updated_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(topic);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <EyeIcon className="w-4 h-4" />
                            <span>View</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(topic);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(topic);
                        }}
                        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
