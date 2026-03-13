import React from 'react';
import { XMarkIcon, CalendarIcon, UserIcon, LightBulbIcon, TagIcon, ArrowUpRightIcon, CheckCircleIcon, ClockIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import type { Suggestion } from '../../../types/api';

interface IdeaDetailModalProps {
    suggestion: Suggestion;
    isOpen: boolean;
    onClose: () => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ suggestion, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryDisplayName = (category: string) => {
        switch (category) {
            case 'UX':
                return 'User Experience';
            case 'PRODUCT':
                return 'Product';
            case 'SERVICE':
                return 'Service';
            case 'OPERATIONAL':
                return 'Operations';
            case 'OTHER':
                return 'Other';
            default:
                return category;
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'NEW':
                return {
                    icon: ClockIcon,
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    label: 'New Idea',
                    description: 'Recently submitted and awaiting review'
                };
            case 'PROCESSED':
                return {
                    icon: CheckCircleIcon,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    label: 'Processed',
                    description: 'AI analysis completed'
                };
            case 'ARCHIVED':
                return {
                    icon: ArchiveBoxIcon,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    label: 'Archived',
                    description: 'Stored for future reference'
                };
            default:
                return {
                    icon: ClockIcon,
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    label: 'In Progress',
                    description: 'Currently being processed'
                };
        }
    };

    const statusInfo = getStatusInfo(suggestion.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-xl border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 bg-blue-600 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <LightBulbIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Idea Details</h2>
                                <p className="text-sm text-blue-100">Innovation submission from {suggestion.author_type === 'STAFF' ? 'Staff Member' : 'Customer'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-blue-100 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
                    {/* Title & Status */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-900 leading-tight">{suggestion.title}</h3>

                        {/* Status & Category Row */}
                        <div className="flex items-center space-x-3">
                            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg font-medium border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                <span className={`${statusInfo.color} text-sm`}>{statusInfo.label}</span>
                            </div>
                            <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium border border-blue-200 text-sm">
                                {getCategoryDisplayName(suggestion.category)}
                            </span>
                        </div>

                        {/* Status Description */}
                        <p className="text-gray-600 text-sm">{statusInfo.description}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                        <p className="text-gray-700 leading-relaxed">{suggestion.body}</p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                                <h4 className="font-medium text-gray-900">Author</h4>
                            </div>
                            <p className="text-gray-700">{suggestion.author_type === 'STAFF' ? 'Staff Member' : 'Customer'}</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <CalendarIcon className="h-4 w-4 text-purple-600" />
                                <h4 className="font-medium text-gray-900">Submitted</h4>
                            </div>
                            <p className="text-gray-700">{formatDate(suggestion.created_at)}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center space-x-2 mb-3">
                                <TagIcon className="h-4 w-4 text-emerald-600" />
                                <h4 className="font-medium text-gray-900">Tags</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {suggestion.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-white text-gray-700 rounded-md border border-gray-200 font-medium text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Language */}
                    {suggestion.language && (
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <h4 className="font-medium text-gray-900 mb-2">Language</h4>
                            <span className="px-3 py-1 bg-white text-gray-700 rounded-md border border-gray-200 font-medium text-sm">
                                {suggestion.language}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">ID:</span> {suggestion.id}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium text-sm"
                            >
                                Close
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-sm flex items-center space-x-2">
                                <span>Take Action</span>
                                <ArrowUpRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 