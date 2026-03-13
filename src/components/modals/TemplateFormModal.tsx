import React, { useState, useEffect, useCallback } from 'react';
import { Template, TemplateCreate } from '@/types/api';
import { Button, Input, Textarea } from '@/components/ui';
import { XMarkIcon, PlusIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: TemplateCreate | Partial<Template>) => void | Promise<void>;
    template: Template | null;
    isEditing: boolean;
}

export const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    template,
    isEditing
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        content_markdown: '',
        version: '1.0',
        kind: 'document',
        engine: 'MD_JINJA',
        variables: [] as string[]
    });
    const [newVariable, setNewVariable] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Generate preview content with sample data
    const generatePreview = (content: string): string => {
        if (!content) return '';

        // Sample data for preview
        const sampleData: Record<string, string> = {
            'title': 'Sample Document Title',
            'description': 'This is a sample description for preview purposes',
            'name': 'John Doe',
            'email': 'john.doe@example.com',
            'company': 'Acme Corporation',
            'date': new Date().toLocaleDateString(),
            'project_name': 'Sample Project',
            'client_name': 'Sample Client',
            'client_contact': 'client@example.com',
            'proposal_date': new Date().toLocaleDateString(),
            'project_manager': 'Jane Smith',
            'timeline': '3 months',
            'project_scope': 'This is a sample project scope description',
            'deliverables': 'Sample deliverables list',
            'budget': '$50,000',
            'next_steps': 'Sample next steps description',
            'status': 'Active',
            'priority': 'High',
            'category': 'Innovation',
            'department': 'Engineering'
        };

        let preview = content;

        // Replace all variables with sample data
        formData.variables.forEach(variable => {
            const cleanVariable = variable.replace(/[{}]/g, '');
            const sampleValue = sampleData[cleanVariable] || `[${cleanVariable}]`;
            const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            preview = preview.replace(regex, sampleValue);
        });

        return preview;
    };

    useEffect(() => {
        if (isOpen) {
            if (template && isEditing) {
                // Extract variables from template content
                const extractVariables = (content: string): string[] => {
                    const variableRegex = /\{\{([^}]+)\}\}/g;
                    const matches = content.match(variableRegex);
                    if (matches) {
                        return Array.from(new Set(matches)); // Remove duplicates
                    }
                    return [];
                };

                const templateContent = template.content_markdown || template.content || '';
                const extractedVariables = extractVariables(templateContent);

                setFormData({
                    name: template.name,
                    description: template.description || '',
                    content_markdown: templateContent,
                    version: template.version || '1.0',
                    kind: template.kind || 'document',
                    engine: template.engine || 'MD_JINJA',
                    variables: extractedVariables
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    content_markdown: '',
                    version: '1.0',
                    kind: 'document',
                    engine: 'MD_JINJA',
                    variables: []
                });
            }
            setErrors({});
        }
    }, [isOpen, template, isEditing]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Template name is required';
        }

        if (!formData.content_markdown.trim()) {
            newErrors.content_markdown = 'Template content is required';
        }

        if (formData.variables.length === 0) {
            newErrors.variables = 'At least one variable is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const templateData: TemplateCreate = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            content_markdown: formData.content_markdown.trim(),
            version: formData.version,
            kind: formData.kind,
            engine: formData.engine,
            variables: formData.variables
        };

        setLoading(true);
        try {
            await Promise.resolve(onSave(templateData));
        } catch (err) {
            console.error('Failed to save template:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVariable = () => {
        if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
            setFormData(prev => ({
                ...prev,
                variables: [...prev.variables, newVariable.trim()]
            }));
            setNewVariable('');
        }
    };

    const handleRemoveVariable = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variables: prev.variables.filter((_, i) => i !== index)
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddVariable();
        }
    };

    // Handle markdown content changes
    const handleMarkdownChange = useCallback((value: string) => {
        try {
            setFormData(prev => ({ ...prev, content_markdown: value || '' }));
        } catch (error) {
            console.error('Error updating markdown content:', error);
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        {isEditing ? 'Edit Template' : 'Create Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form with Live Preview */}
                <div className="flex h-[calc(95vh-140px)]">
                    {/* Form Section */}
                    <div className="flex-[2] p-6 overflow-y-auto border-r border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Template Name *
                                    </label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter template name"
                                        error={errors.name}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <Input
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter template description"
                                    />
                                </div>
                            </div>

                            {/* Template Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Version *
                                    </label>
                                    <Input
                                        value={formData.version}
                                        onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                        placeholder="1.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kind *
                                    </label>
                                    <Input
                                        value={formData.kind}
                                        onChange={(e) => setFormData(prev => ({ ...prev, kind: e.target.value }))}
                                        placeholder="document"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Engine *
                                    </label>
                                    <Input
                                        value={formData.engine}
                                        onChange={(e) => setFormData(prev => ({ ...prev, engine: e.target.value }))}
                                        placeholder="MD_JINJA"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Variables */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Variables *
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newVariable}
                                            onChange={(e) => setNewVariable(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter variable name (e.g., {{title}})"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddVariable}
                                            disabled={!newVariable.trim() || formData.variables.includes(newVariable.trim())}
                                            className="px-4"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {formData.variables.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.variables.map((variable, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {variable}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariable(index)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <TrashIcon className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {errors.variables && (
                                        <p className="text-sm text-red-600">{errors.variables}</p>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Content *
                                </label>
                                <Textarea
                                    value={formData.content_markdown || ''}
                                    onChange={(e) => handleMarkdownChange(e.target.value)}
                                    placeholder="Enter your template content with variables like {{title}}, {{description}}, etc.

Use markdown formatting:
# Headers
**Bold text**
*Italic text*
- Lists

Use double curly braces for variables: {{variable_name}}"
                                    rows={15}
                                    className="w-full font-mono text-sm"
                                />
                                {errors.content_markdown && (
                                    <p className="mt-1 text-sm text-red-600">{errors.content_markdown}</p>
                                )}
                                <p className="mt-2 text-sm text-gray-500">
                                    Use double curly braces for variables: {`{{variable_name}}`}
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview Section */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col">
                        <div className="space-y-4 flex-1 flex flex-col">
                            {/* Preview Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                                    <p className="text-sm text-gray-600">See how your template looks with sample data</p>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 overflow-hidden">
                                <div className="h-full p-6 template-preview overflow-y-auto">
                                    <div className="prose prose-sm max-w-none h-full">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                                                p: ({ children }) => <p className="mb-3">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc list-inside mb-3">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal list-inside mb-3">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                em: ({ children }) => <em className="italic">{children}</em>,
                                                code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                                                pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-3">{children}</pre>,
                                                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                                                a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
                                            }}
                                        >
                                            {generatePreview(formData.content_markdown)}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {/* Template Info */}
                            <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Template Info</h4>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    <div className="text-center">
                                        <div className="text-blue-700 font-medium">Name</div>
                                        <div className="text-blue-800 truncate">{formData.name || 'Untitled'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-blue-700 font-medium">Version</div>
                                        <div className="text-blue-800">{formData.version}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-blue-700 font-medium">Kind</div>
                                        <div className="text-blue-800">{formData.kind}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-blue-700 font-medium">Variables</div>
                                        <div className="text-blue-800">{formData.variables.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!formData.name.trim() || !formData.content_markdown.trim() || formData.variables.length === 0 || loading}
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        {isEditing ? 'Update Template' : 'Create Template'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
