import React, { useMemo, useCallback } from 'react';
import { Suggestion } from '@/types/api';
import { getRelativeTime } from '@/utils/date';
import { getCategoryDisplayName } from '@/utils/formatting';
import { ClusterBadge, TopicBadge, ProcessingStatus } from '@/components/ui';
import {
    UserIcon
} from '@heroicons/react/24/outline';

interface SuggestionCardProps {
    suggestion: Suggestion;
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => void;
    onView: (suggestion: Suggestion) => void;
    onClusterClick?: (clusterId: string) => void;
    onTopicClick?: (topicId: string) => void;
    onManageTopics?: (suggestion: Suggestion) => void;
}

const SuggestionCardComponent: React.FC<SuggestionCardProps> = ({
    suggestion,
    onEdit,
    onDelete,
    onView,
    onClusterClick,
    onTopicClick,
    onManageTopics
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

    const handleManageTopicsClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onManageTopics?.(suggestion);
    }, [onManageTopics, suggestion]);

    return (
        <div
            className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer min-h-[320px] flex flex-col suggestion-card"
            onClick={useCallback(() => onView(suggestion), [onView, suggestion])}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20">
                <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                        <UserIcon className="w-5 h-5 text-gray-700" />
                    </div>

                    {/* User Info */}
                    <div>
                        <span className="text-sm font-semibold text-gray-900">
                            {suggestion.author_type === 'STAFF' ? 'Staff' : 'Customer'}
                        </span>
                        <span className="text-xs text-gray-600 ml-2 font-medium">
                            {relativeTime}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${statusConfig.bgColor} ${statusConfig.textColor} shadow-sm`}>
                        {suggestion.status}
                    </span>
                    {suggestion.processing_status && (
                        <ProcessingStatus
                            status={suggestion.processing_status}
                            jobId={suggestion.job_id || undefined}
                            className="text-xs"
                        />
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-white/30 to-white/10">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                    {suggestion.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1 font-medium">
                    {suggestion.body.length > 120
                        ? `${suggestion.body.substring(0, 120)}...`
                        : suggestion.body
                    }
                </p>

                {/* Category Badge */}
                <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryConfig.color} shadow-sm`}>
                        {getCategoryDisplayName(suggestion.category)}
                    </span>
                </div>

                {/* AI Insights - Only show if available */}
                {(suggestion.cluster_id || suggestion.topic_id) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {suggestion.cluster_id && suggestion.cluster_kind && (
                            <ClusterBadge
                                kind={suggestion.cluster_kind}
                                title={suggestion.cluster_title}
                                confidence={suggestion.cluster_confidence}
                                size="sm"
                                interactive={!!onClusterClick}
                                onClick={onClusterClick ? () => onClusterClick(suggestion.cluster_id!) : undefined}
                            />
                        )}
                        {suggestion.topic_id && suggestion.topic_label && (
                            <TopicBadge
                                label={suggestion.topic_label}
                                confidence={suggestion.topic_confidence}
                                size="sm"
                                interactive={!!onTopicClick}
                                onClick={onTopicClick ? () => onTopicClick(suggestion.topic_id!) : undefined}
                            />
                        )}
                    </div>
                )}

                {/* Attachments indicator */}
                {suggestion.attachments && suggestion.attachments.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {suggestion.attachments.length} attachment{suggestion.attachments.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={useCallback((e: React.MouseEvent) => {
                                e.stopPropagation();
                                onView(suggestion);
                            }, [onView, suggestion])}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-sm font-medium">View</span>
                        </button>

                        <button
                            onClick={useCallback((e: React.MouseEvent) => {
                                e.stopPropagation();
                                onEdit(suggestion);
                            }, [onEdit, suggestion])}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="text-sm font-medium">Edit</span>
                        </button>

                        {onManageTopics && (
                            <button
                                onClick={handleManageTopicsClick}
                                className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-sm font-medium">Topics</span>
                            </button>
                        )}
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={useCallback((e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDelete(suggestion.id);
                        }, [onDelete, suggestion.id])}
                        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SuggestionCard = React.memo(SuggestionCardComponent); 