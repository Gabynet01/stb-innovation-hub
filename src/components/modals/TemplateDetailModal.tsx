import React from 'react';
import { Template } from '@/types/api';
import { Button } from '@/components/ui';
import { PencilIcon, DocumentTextIcon, CalendarIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TemplateDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template;
    onEdit: (template: Template) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
    isOpen,
    onClose,
    template,
    onEdit
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Extract variables from template content
    const extractVariables = (content: string): string[] => {
        const variableRegex = /\{\{([^}]+)\}\}/g;
        const matches = content.match(variableRegex);
        if (matches) {
            return Array.from(new Set(matches)); // Remove duplicates
        }
        return [];
    };

    if (!isOpen) return null;

    const templateContent = template.content_markdown || template.content || '';
    const variables = extractVariables(templateContent);

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
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">{template.name}</h2>
                            <p className="text-sm text-blue-100 font-medium">Template Details</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(template)}
                            className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-sm"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Edit
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

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Template Name</h3>
                                <p className="text-lg font-semibold text-gray-900">{template.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Version</h3>
                                <p className="text-gray-900">{template.version || '1.0'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Kind</h3>
                                <p className="text-gray-900">{template.kind || 'document'}</p>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {formatDate(template.created_at)}
                            </div>
                        </div>

                        {/* Description */}
                        {template.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-900">{template.description}</p>
                            </div>
                        )}

                        {/* Variables */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Template Variables</h3>
                            <div className="flex flex-wrap gap-2">
                                {variables.map((variable, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                    >
                                        {variable}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                {variables.length} variable{variables.length !== 1 ? 's' : ''} defined
                            </p>
                        </div>

                        {/* Content Preview */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <CodeBracketIcon className="h-4 w-4 mr-2" />
                                Template Content
                            </h3>
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
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
                                        {templateContent}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
                                <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    {formatDate(template.updated_at)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Template ID</h3>
                                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {template.id}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
