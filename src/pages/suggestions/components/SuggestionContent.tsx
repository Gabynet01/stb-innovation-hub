import React from 'react';
import { Card } from '@/components/ui';
import {
    LightBulbIcon,
    UserIcon,
    TagIcon,
    PaperClipIcon
} from '@heroicons/react/24/outline';
import { getCategoryDisplayName } from '@/utils/formatting';
import { AttachmentViewer } from './AttachmentViewer';

interface SuggestionContentProps {
    suggestion: any;
}

export const SuggestionContent: React.FC<SuggestionContentProps> = ({ suggestion }) => {
    return (
        <div className="space-y-6">
            {/* Status and Category Row */}
            <div className="flex flex-wrap items-center gap-3">
                <span className={`bg-slate-50 text-slate-700 border-slate-200 border px-4 py-2 text-sm font-semibold rounded-lg`}>
                    Status: {suggestion.status}
                </span>
                <span className={`bg-slate-50 text-slate-700 border-slate-200 border px-4 py-2 text-sm font-semibold rounded-lg flex items-center`}>
                    <TagIcon className="h-4 w-4 mr-2" />
                    {getCategoryDisplayName(suggestion.category)}
                </span>
            </div>

            {/* Description */}
            <Card className="p-6 border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <LightBulbIcon className="h-5 w-5 text-[#0051FF] mr-3" />
                    Description
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {suggestion.body}
                </p>
            </Card>

            {/* Contact Information */}
            {suggestion.contact && (suggestion.contact.email || suggestion.contact.phone) && (
                <Card className="p-6 border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 text-[#0051FF] mr-3" />
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestion.contact.email && (
                            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="w-10 h-10 bg-[#0051FF]/10 rounded-lg flex items-center justify-center">
                                    <svg className="h-5 w-5 text-[#0051FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Email</p>
                                    <p className="text-slate-900 font-medium">{suggestion.contact.email}</p>
                                </div>
                            </div>
                        )}
                        {suggestion.contact.phone && (
                            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="w-10 h-10 bg-[#0051FF]/10 rounded-lg flex items-center justify-center">
                                    <svg className="h-5 w-5 text-[#0051FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Phone</p>
                                    <p className="text-slate-900 font-medium">{suggestion.contact.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Attachments */}
            {suggestion.attachments && suggestion.attachments.length > 0 && (
                <Card className="p-6 border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <PaperClipIcon className="h-5 w-5 text-[#0051FF] mr-3" />
                        Attachments ({suggestion.attachments.length})
                    </h3>
                    <AttachmentViewer attachments={suggestion.attachments} />
                </Card>
            )}

            {/* Tags */}
            {suggestion.tags && suggestion.tags.length > 0 && (
                <Card className="p-6 border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <TagIcon className="h-5 w-5 text-[#0051FF] mr-3" />
                        Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestion.tags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-[#0051FF]/10 text-[#0051FF] text-sm font-medium rounded-lg border border-[#0051FF]/20"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}; 