import React, { useMemo, useCallback } from 'react';
import { Suggestion } from '@/types/api';
import { getRelativeTime } from '@/utils/date';
import { getCategoryDisplayName } from '@/utils/formatting';
import {
    PencilIcon,
    TrashIcon,
    UserIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface SuggestionCardProps {
    suggestion: Suggestion;
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => void;
    onView: (suggestion: Suggestion) => void;
}

const SuggestionCardComponent: React.FC<SuggestionCardProps> = ({
    suggestion,
    onEdit,
    onDelete,
    onView
}) => {

    const statusConfig = useMemo(() => {
        switch (suggestion.status) {
            case 'NEW':
                return {
                    color: 'bg-[#0051FF]',
                    textColor: 'text-[#0051FF]',
                    bgColor: 'bg-[#0051FF]/10'
                };
            case 'PROCESSED':
                return {
                    color: 'bg-emerald-500',
                    textColor: 'text-emerald-600',
                    bgColor: 'bg-emerald-50'
                };
            default:
                return {
                    color: 'bg-slate-400',
                    textColor: 'text-slate-600',
                    bgColor: 'bg-slate-50'
                };
        }
    }, [suggestion.status]);

    const categoryConfig = useMemo(() => {
        switch (suggestion.category) {
            case 'UX':
                return {
                    color: 'bg-purple-100 text-purple-700 border-purple-200'
                };
            case 'PRODUCT':
                return {
                    color: 'bg-blue-100 text-blue-700 border-blue-200'
                };
            case 'SERVICE':
                return {
                    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
                };
            case 'OPERATIONAL':
                return {
                    color: 'bg-orange-100 text-orange-700 border-orange-200'
                };
            default:
                return {
                    color: 'bg-slate-100 text-slate-700 border-slate-200'
                };
        }
    }, [suggestion.category]);

    const relativeTime = useMemo(() => getRelativeTime(suggestion.created_at), [suggestion.created_at]);

    return (
        <div
            className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer h-[310px] flex flex-col suggestion-card"
            onClick={useCallback(() => onView(suggestion), [onView, suggestion])}
        >
            {/* Header - Like Instagram */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-slate-600" />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                            {suggestion.author_type === 'STAFF' ? 'Staff Member' : 'Customer'}
                        </span>
                        <span className="text-xs text-slate-500">
                            {relativeTime}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {suggestion.status.toLowerCase()}
                    </span>

                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryConfig.color}`}>
                        {getCategoryDisplayName(suggestion.category)}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="h-40 p-4 flex flex-col overflow-hidden">
                {/* Title */}
                <div className="mb-2 overflow-hidden">
                    <h3 className="text-base font-semibold text-slate-800 line-clamp-1 leading-tight group-hover:text-[#0051FF] transition-colors duration-200">
                        {suggestion.title}
                    </h3>
                </div>

                {/* Description */}
                <div className="mb-3 overflow-hidden">
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {suggestion.body}
                    </p>
                </div>

                {/* Attachments Count - Right Aligned */}
                {suggestion.attachments && suggestion.attachments.length > 0 && (
                    <div className="flex justify-end">
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-xs text-slate-600 font-medium">
                                {suggestion.attachments.length} attachment{suggestion.attachments.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                )}

                {/* Tags */}
                {suggestion.tags && suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestion.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                            >
                                #{tag}
                            </span>
                        ))}
                        {suggestion.tags.length > 3 && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md border border-slate-200">
                                +{suggestion.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer - Like Instagram */}
            <div className="border-t border-slate-100 p-3 bg-slate-50/30">
                <div className="flex items-center justify-between">
                    {/* Left Side - Quick Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={useCallback((e: React.MouseEvent) => {
                                e.stopPropagation();
                                onEdit(suggestion);
                            }, [onEdit, suggestion])}
                            className="flex items-center space-x-1 text-slate-500 hover:text-emerald-600 transition-colors duration-200 text-xs font-medium"
                        >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>

                        <button
                            onClick={useCallback((e: React.MouseEvent) => {
                                e.stopPropagation();
                                onDelete(suggestion.id);
                            }, [onDelete, suggestion.id])}
                            className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors duration-200 text-xs font-medium"
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    </div>

                    {/* Right Side - View Button */}
                    <button
                        onClick={useCallback((e: React.MouseEvent) => {
                            e.stopPropagation();
                            onView(suggestion);
                        }, [onView, suggestion])}
                        className="px-4 py-2 bg-[#0051FF] text-white rounded-lg hover:bg-[#0047E6] transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                    >
                        <EyeIcon className="w-4 h-4 inline mr-1" />
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SuggestionCard = React.memo(SuggestionCardComponent); 