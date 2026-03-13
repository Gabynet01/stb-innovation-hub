import React, { useState, useRef } from 'react';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { DocumentArrowUpIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface TemplateUploadData {
    file: File;
    template_name: string;
    template_description?: string;
    version: string;
    kind: string;
}

interface TemplateUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: TemplateUploadData) => void | Promise<void>;
}

export const TemplateUploadModal: React.FC<TemplateUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [version, setVersion] = useState('1.0');
    const [kind, setKind] = useState('document');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (file && allowedExtensions.includes(fileExtension)) {
            setSelectedFile(file);
            setErrors(prev => ({ ...prev, file: '' }));
        } else {
            setErrors(prev => ({ ...prev, file: 'Please select a valid file (.pdf, .docx, .doc, .txt, or .md)' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedFile) {
            newErrors.file = 'Please select a file to upload';
        }

        if (!templateName.trim()) {
            newErrors.template_name = 'Template name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !selectedFile) {
            return;
        }

        setLoading(true);
        try {
            const result = onUpload({
                file: selectedFile,
                template_name: templateName.trim(),
                template_description: templateDescription.trim() || undefined,
                version: version,
                kind: kind
            });
            if (result && typeof (result as Promise<void>).then === 'function') {
                await (result as Promise<void>);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        handleRemoveFile();
        setTemplateName('');
        setTemplateDescription('');
        setVersion('1.0');
        setKind('document');
        onClose();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setErrors(prev => ({ ...prev, file: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 bg-blue-600 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                            <DocumentArrowUpIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Upload Template</h2>
                            <p className="text-blue-100">Upload a new document template</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-blue-100 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
                        {/* Template Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Template Information</h3>

                            {/* Template Name */}
                            <div>
                                <label htmlFor="template_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Name *
                                </label>
                                <Input
                                    id="template_name"
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    placeholder="Enter template name"
                                    className={errors.template_name ? 'border-red-300' : ''}
                                />
                                {errors.template_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.template_name}</p>
                                )}
                            </div>

                            {/* Template Description */}
                            <div>
                                <label htmlFor="template_description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    id="template_description"
                                    value={templateDescription}
                                    onChange={(e) => setTemplateDescription(e.target.value)}
                                    placeholder="Enter template description"
                                    rows={3}
                                />
                            </div>

                            {/* Version and Kind */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                                        Version
                                    </label>
                                    <Input
                                        id="version"
                                        type="text"
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        placeholder="1.0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="kind" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kind
                                    </label>
                                    <Select
                                        value={kind}
                                        onChange={(e) => setKind(e.target.value)}
                                        options={[
                                            { value: 'document', label: 'Document' },
                                            { value: 'report', label: 'Report' },
                                            { value: 'presentation', label: 'Presentation' },
                                            { value: 'form', label: 'Form' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    } ${errors.file ? 'border-red-300' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc,.txt,.md"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 text-gray-400">
                                            <DocumentArrowUpIcon />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Upload Template File
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Drag and drop your template file here, or{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                                >
                                                    browse files
                                                </button>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Supports .pdf, .docx, .doc, .txt, and .md files
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 text-green-500">
                                            <DocumentTextIcon />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">
                                                File Selected
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="text-red-600 hover:text-red-500 text-sm font-medium mt-2"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.file && (
                                <p className="text-sm text-red-600">{errors.file}</p>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">Template Format</h3>
                            <p className="text-sm text-blue-700">
                                Upload a sample document (PDF, Word, text, or markdown) that will be converted into a reusable template.
                                The system will automatically identify variables and create placeholders like {`{{title}}`}, {`{{description}}`}, etc.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 px-6 pb-6 border-t border-gray-200 flex-shrink-0">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedFile || !templateName.trim() || loading}
                            loading={loading}
                        >
                            Upload Template
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};