import React, { useState, useEffect } from 'react';
import { Button, Select, Input } from '@/components/ui';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useClusters } from '@/hooks';
import { useTopics } from '@/hooks';
import { useTemplates } from '@/hooks';

interface DocumentGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: {
        templateId: string;
        sourceId: string;
        title?: string;
        renderFormat?: 'PDF' | 'DOCX' | 'HTML' | 'TXT' | 'MD';
    }) => void;
    generationType: 'cluster' | 'topic';
}

export const DocumentGenerationModal: React.FC<DocumentGenerationModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
    generationType
}) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [documentTitle, setDocumentTitle] = useState('');
    const [renderFormat, setRenderFormat] = useState<'PDF' | 'DOCX' | 'HTML' | 'TXT' | 'MD'>('PDF');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { clusters, loading: clustersLoading } = useClusters();
    const { topics, loading: topicsLoading } = useTopics();
    const { templates, loading: templatesLoading } = useTemplates();

    useEffect(() => {
        if (isOpen) {
            setSelectedTemplate('');
            setSelectedSource('');
            setDocumentTitle('');
            setRenderFormat('PDF');
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedTemplate) {
            newErrors.template = 'Please select a template';
        }

        if (!selectedSource) {
            newErrors.source = `Please select a ${generationType}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onGenerate({
            templateId: selectedTemplate,
            sourceId: selectedSource,
            title: documentTitle || undefined,
            renderFormat: renderFormat
        });
    };

    const isLoading = clustersLoading || topicsLoading || templatesLoading;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                {/* Header */}
                <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                            <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Generate Document from {generationType === 'cluster' ? 'Cluster' : 'Topic'}
                            </h2>
                            <p className="text-sm text-blue-100">
                                Create an AI-powered document using your selected template
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-blue-100 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Template Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Template *
                            </label>
                            <Select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                disabled={isLoading}
                                options={[
                                    { value: '', label: 'Choose a template...' },
                                    ...templates.map((template) => ({
                                        value: template.id,
                                        label: template.name
                                    }))
                                ]}
                            />
                            {errors.template && (
                                <p className="mt-1 text-sm text-red-600">{errors.template}</p>
                            )}
                        </div>

                        {/* Source Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select {generationType === 'cluster' ? 'Cluster' : 'Topic'} *
                            </label>
                            <Select
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                                disabled={isLoading}
                                options={[
                                    { value: '', label: `Choose a ${generationType}...` },
                                    ...(generationType === 'cluster'
                                        ? clusters.map((cluster) => ({
                                            value: cluster.id,
                                            label: cluster.title || 'Untitled Cluster'
                                        }))
                                        : topics.map((topic) => ({
                                            value: topic.id,
                                            label: topic.label || 'Untitled Topic'
                                        }))
                                    )
                                ]}
                            />
                            {errors.source && (
                                <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                            )}
                        </div>

                        {/* Document Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Title (Optional)
                            </label>
                            <Input
                                type="text"
                                value={documentTitle}
                                onChange={(e) => setDocumentTitle(e.target.value)}
                                placeholder="Enter a title for your document..."
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Leave empty to auto-generate a title based on the {generationType} and template
                            </p>
                        </div>

                        {/* Render Format */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Format *
                            </label>
                            <Select
                                value={renderFormat}
                                onChange={(e) => setRenderFormat(e.target.value as 'PDF' | 'DOCX' | 'HTML' | 'TXT' | 'MD')}
                                disabled={isLoading}
                                options={[
                                    { value: 'PDF', label: 'PDF Document' },
                                    { value: 'DOCX', label: 'Microsoft Word (DOCX)' },
                                    { value: 'HTML', label: 'HTML Web Page' },
                                    { value: 'TXT', label: 'Plain Text (TXT)' },
                                    { value: 'MD', label: 'Markdown (MD)' }
                                ]}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Choose the format for the generated document. All formats are available for generation.
                            </p>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">Generation Process</h3>
                            <p className="text-sm text-blue-700 mb-2">
                                The AI will analyze your selected {generationType} and generate a comprehensive
                                document using the template. This process may take a few minutes depending on
                                the complexity of the data.
                            </p>
                            <div className="mt-3">
                                <h4 className="text-sm font-medium text-blue-900 mb-1">Supported Export Formats:</h4>
                                <p className="text-xs text-blue-600">
                                    PDF, DOCX, HTML, TXT, and MD formats are supported for document generation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedTemplate || !selectedSource || isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Generate Document'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
