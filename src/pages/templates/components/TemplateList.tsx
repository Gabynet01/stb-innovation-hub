import React from 'react';
import { Template } from '@/types/api';
import { Button } from '@/components/ui';
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
    DocumentTextIcon,
    CodeBracketIcon
} from '@heroicons/react/24/outline';

interface TemplateListProps {
    templates: Template[];
    onEdit: (template: Template) => void;
    onDelete: (templateId: string) => void;
    onView: (template: Template) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
    templates,
    onEdit,
    onDelete,
    onView
}) => {

    // Extract variables from template content
    const extractVariables = (content: string): string[] => {
        const variableRegex = /\{\{([^}]+)\}\}/g;
        const matches = content.match(variableRegex);
        if (matches) {
            return Array.from(new Set(matches)); // Remove duplicates
        }
        return [];
    };


    // Safety check for templates array
    if (!templates || templates.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <DocumentTextIcon className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Get started by creating your first document template or uploading a sample document.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => {
                const templateContent = template.content_markdown || template.content || '';
                const variables = extractVariables(templateContent);

                return (
                    <div
                        key={template.id}
                        className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer min-h-[320px] flex flex-col"
                        onClick={() => onView(template)}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20">
                            <div className="flex items-center space-x-3">
                                {/* Template Icon */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                                    <DocumentTextIcon className="w-5 h-5 text-gray-700" />
                                </div>

                                {/* Template Info */}
                                <div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        Template
                                    </span>
                                    <span className="text-xs text-gray-600 ml-2 font-medium">
                                        {new Date(template.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Kind Badge */}
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-gray-700 border border-white/30">
                                    {template.kind || 'document'}
                                </span>
                                <span className="text-xs text-gray-500">v{template.version || '1.0'}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-white/30 to-white/10">
                            {/* Template Title */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                                {template.name}
                            </h3>

                            {/* Description */}
                            {template.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                    {template.description}
                                </p>
                            )}

                            {/* Variables */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CodeBracketIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">Variables</span>
                                    <span className="text-xs text-gray-500">({variables.length})</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {variables.slice(0, 3).map((variable, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/60 text-gray-700 border border-white/40"
                                        >
                                            {variable}
                                        </span>
                                    ))}
                                    {variables.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/40 text-gray-600">
                                            +{variables.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Spacer to push footer down */}
                            <div className="flex-1"></div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onView(template); }}
                                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">View</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onEdit(template); }}
                                        className="text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">Edit</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onDelete(template.id); }}
                                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg px-3 py-2"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="ml-1 text-xs">Delete</span>
                                    </Button>
                                </div>

                                {/* Status indicator */}
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-xs text-gray-500">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};