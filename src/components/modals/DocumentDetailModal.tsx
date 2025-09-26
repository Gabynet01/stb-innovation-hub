import React, { useState } from 'react';
import { Document } from '@/types/api';
import { Button, LoadingSpinner } from '@/components/ui';
import { ArrowDownTrayIcon, DocumentTextIcon, CalendarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document;
    onExport: (document: Document, format?: 'pdf' | 'docx' | 'html' | 'txt' | 'md') => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
    isOpen,
    onClose,
    document,
    onExport
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'html' | 'txt' | 'md'>('pdf');

    const handleExport = async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);
            setExportError(null);
            await onExport(document, exportFormat);
        } catch (error) {
            console.error('Export failed:', error);
            setExportError(error instanceof Error ? error.message : 'Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'READY':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'RENDERING':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'FAILED':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            case 'DRAFT':
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'READY':
                return 'bg-green-100 text-green-800';
            case 'RENDERING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'DRAFT':
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDocumentContent = (): string => {
        // Try to get content from the new API structure first
        if (document.draft_content?.markdown) {
            return document.draft_content.markdown;
        }
        // Fallback to legacy content field
        return document.content || 'No content available';
    };

    const getDocumentDate = (): string => {
        // Try to get date from the new API structure first
        if (document.created_at) {
            return formatDate(document.created_at);
        }
        // Fallback to legacy generated_at field
        return document.generated_at ? formatDate(document.generated_at) : 'Unknown date';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white bg-opacity-25 rounded-lg shadow-sm">
                            <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">{document.title}</h2>
                            <p className="text-sm text-blue-100 font-medium">Document Details</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'docx' | 'html' | 'txt' | 'md')}
                            disabled={isExporting}
                            className="px-3 py-2 text-sm bg-white/10 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                        >
                            <option value="pdf" className="text-gray-900 bg-white">PDF Document</option>
                            <option value="docx" className="text-gray-900 bg-white">Microsoft Word (DOCX)</option>
                            <option value="html" className="text-gray-900 bg-white">HTML Web Page</option>
                            <option value="txt" className="text-gray-900 bg-white">Plain Text (TXT)</option>
                            <option value="md" className="text-gray-900 bg-white">Markdown (MD)</option>
                        </select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={document.status !== 'READY' || isExporting}
                            className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <ArrowDownTrayIcon className="h-4 w-4" />
                            )}
                            {isExporting ? 'Exporting...' : 'Export'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-white hover:bg-white/20 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg font-medium"
                        >
                            Close
                        </Button>
                    </div>
                </div>

                {/* Export Error */}
                {exportError && (
                    <div className="px-6 py-3 bg-red-50 border-b border-red-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-800">{exportError}</p>
                            </div>
                            <button
                                onClick={() => setExportError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        {/* Status and Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                                    {getStatusIcon(document.status)}
                                    <span className="ml-2 capitalize">{document.status}</span>
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Generated</h3>
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    {getDocumentDate()}
                                </div>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Document Content</h3>
                            <div className="bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                                <div className="p-6 prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-900">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-gray-900">{children}</h3>,
                                            h4: ({ children }) => <h4 className="text-base font-bold mb-2 text-gray-900">{children}</h4>,
                                            h5: ({ children }) => <h5 className="text-sm font-bold mb-1 text-gray-900">{children}</h5>,
                                            h6: ({ children }) => <h6 className="text-sm font-bold mb-1 text-gray-900">{children}</h6>,
                                            p: ({ children }) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-gray-700">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-gray-700">{children}</ol>,
                                            li: ({ children }) => <li className="mb-1">{children}</li>,
                                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                                            code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">{children}</code>,
                                            pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-3 text-gray-800">{children}</pre>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                                            a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                            table: ({ children }) => <table className="min-w-full border border-gray-300 mb-3">{children}</table>,
                                            thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                                            tbody: ({ children }) => <tbody>{children}</tbody>,
                                            tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
                                            th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>,
                                            td: ({ children }) => <td className="px-3 py-2 text-sm text-gray-700">{children}</td>,
                                        }}
                                    >
                                        {getDocumentContent()}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Output Format</h3>
                                <p className="text-gray-900">{document.output_format?.toUpperCase() || 'PDF'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">File Size</h3>
                                <p className="text-gray-900">
                                    {document.file_size ? `${(document.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Template ID</h3>
                                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {document.template_id || 'N/A'}
                                </code>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Document ID</h3>
                                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {document.id}
                                </code>
                            </div>
                        </div>

                        {/* Processing Info */}
                        {document.status === 'processing' && (
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                                    <h3 className="text-sm font-medium text-yellow-900">Processing in Progress</h3>
                                </div>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Your document is being generated. This may take a few minutes.
                                    You can close this modal and check back later.
                                </p>
                            </div>
                        )}

                        {document.status === 'failed' && (
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                                    <h3 className="text-sm font-medium text-red-900">Generation Failed</h3>
                                </div>
                                <p className="text-sm text-red-700 mt-1">
                                    There was an error generating your document. Please try again or contact support.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
