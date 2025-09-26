import React from 'react';
import { Document } from '@/types/api';
import { Button } from '@/components/ui';
import { EyeIcon, TrashIcon, ArrowDownTrayIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface DocumentListProps {
    documents: Document[];
    onView: (document: Document) => void;
    onDelete: (documentId: string) => void;
    onExport: (document: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
    documents,
    onView,
    onDelete,
    onExport
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'ready':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'processing':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'failed':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDocumentContent = (document: Document): string => {
        // Try to get content from the new API structure first
        if (document.draft_content?.markdown) {
            return document.draft_content.markdown;
        }
        // Fallback to legacy content field
        return document.content || 'No content available';
    };

    const getDocumentDate = (document: Document): string => {
        // Try to get date from the new API structure first
        if (document.created_at) {
            return formatDate(document.created_at);
        }
        // Fallback to legacy generated_at field
        return document.generated_at ? formatDate(document.generated_at) : 'Unknown date';
    };

    if (documents.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <DocumentTextIcon className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Generate your first AI-powered document from clusters or topics to get started.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <SparklesIcon className="h-4 w-4" />
                    <span>AI-powered document generation</span>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((document) => {
                const content = getDocumentContent(document);
                const date = getDocumentDate(document);
                const isReady = document.status === 'READY';

                return (
                    <div
                        key={document.id}
                        className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer min-h-[320px] flex flex-col"
                        onClick={() => onView(document)}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20">
                            <div className="flex items-center space-x-3">
                                {/* Document Icon */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                                    <DocumentTextIcon className="w-5 h-5 text-gray-700" />
                                </div>

                                {/* Document Info */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        Document
                                    </span>
                                    <span className="text-xs text-gray-600 ml-2 font-medium">
                                        {date}
                                    </span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)} shadow-sm`}>
                                    {getStatusIcon(document.status)}
                                    <span className="ml-1.5 capitalize">{document.status.toLowerCase()}</span>
                                </span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-white/30 to-white/10">
                            {/* Document Title */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                                {document.title}
                            </h3>

                            {/* Content Preview */}
                            <div className="mb-4">
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                    {content.length > 150 ? content.substring(0, 150) + '...' : content}
                                </p>
                            </div>

                            {/* Template Info */}
                            {document.draft_content?.template_info && (
                                <div className="mb-4 p-3 bg-white/60 rounded-lg border border-white/40">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <SparklesIcon className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">Template</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {document.draft_content.template_info.name} v{document.draft_content.template_info.version}
                                    </p>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <span>Source: {document.draft_content.source_type}</span>
                                        <span>•</span>
                                        <span>{document.draft_content.generation_stats.suggestions_processed} suggestions</span>
                                    </div>
                                </div>
                            )}

                            {/* Spacer to push footer down */}
                            <div className="flex-1"></div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onView(document); }}
                                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">View</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onExport(document); }}
                                        disabled={!isReady}
                                        className="text-gray-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">Export</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onDelete(document.id); }}
                                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">Delete</span>
                                    </Button>
                                </div>

                                {/* Format indicator */}
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-xs text-gray-500">{document.output_format?.toUpperCase() || 'PDF'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
