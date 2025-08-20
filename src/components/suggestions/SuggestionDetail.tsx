import React, { useState } from 'react';
import { Suggestion } from '@/types/api';
import {
    XMarkIcon,
    PaperClipIcon
} from '@heroicons/react/24/outline';

interface SuggestionDetailProps {
    suggestion: Suggestion;
    onClose: () => void;
    onEdit?: (suggestion: Suggestion) => void;
    onDelete?: (id: string) => void;
    // Remove onStatusChange and onPriorityChange since these fields don't exist in API spec
}

export const SuggestionDetail: React.FC<SuggestionDetailProps> = ({
    suggestion,
    onClose,
    onEdit,
    onDelete
}) => {
    const [showActions, setShowActions] = useState(false);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this suggestion?')) {
            onDelete?.(suggestion.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-corporate-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-stanbic-900">Suggestion Details</h2>
                        <p className="text-corporate-600 mt-1">View and manage suggestion information</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onEdit?.(suggestion)}
                            className="px-4 py-2 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-corporate-500 hover:text-corporate-700 hover:bg-corporate-50 rounded-lg transition-colors duration-150"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-stanbic-900">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-corporate-700 mb-1">Title</label>
                                <p className="text-stanbic-900">{suggestion.title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-corporate-700 mb-1">Category</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {suggestion.category}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-corporate-700 mb-1">Author Type</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {suggestion.author_type}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-corporate-700 mb-1">Description</label>
                            <p className="text-stanbic-900 whitespace-pre-wrap">{suggestion.body}</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    {suggestion.contact && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-stanbic-900">Contact Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestion.contact.email && (
                                    <div>
                                        <label className="block text-sm font-medium text-corporate-700 mb-1">Email</label>
                                        <p className="text-stanbic-900">{suggestion.contact.email}</p>
                                    </div>
                                )}

                                {suggestion.contact.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-corporate-700 mb-1">Phone</label>
                                        <p className="text-stanbic-900">{suggestion.contact.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {suggestion.attachments && suggestion.attachments.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-stanbic-900">Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {suggestion.attachments.map((attachment, index) => (
                                    <div key={index} className="p-4 border border-corporate-200 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <PaperClipIcon className="h-5 w-5 text-corporate-500" />
                                            <span className="text-sm text-corporate-700">Attachment {index + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 