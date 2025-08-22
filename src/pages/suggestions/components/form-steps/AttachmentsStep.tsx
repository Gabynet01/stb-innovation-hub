import React from 'react';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';
import { FormData } from '../../../../hooks';
import { fileTypes } from '../../../../constants';

interface AttachmentsStepProps {
    formData: FormData;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement> | File[]) => void;
    onRemoveAttachment: (index: number) => void;
}

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
    formData,
    onFileUpload,
    onRemoveAttachment
}) => {
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFileUpload(files);
        }
    };

    return (
        <div className="mb-8">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Supporting Documents</h2>
                <p className="text-slate-600">Add any supporting files to help explain your suggestion (optional)</p>
            </div>

            <div className="space-y-8">
                {/* File Attachments */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Supporting Documents (Optional)
                    </label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <PaperClipIcon className={`h-10 w-10 mx-auto mb-4 ${isDragOver ? 'text-blue-400' : 'text-slate-400'
                            }`} />
                        <p className={`text-base mb-2 ${isDragOver ? 'text-blue-700' : 'text-slate-700'
                            }`}>
                            {isDragOver ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            {fileTypes.description}
                        </p>
                        <input
                            ref={(input) => {
                                if (input) {
                                    input.style.display = 'none';
                                }
                            }}
                            type="file"
                            multiple
                            onChange={onFileUpload}
                            id="file-upload"
                            accept={fileTypes.accept}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                                if (fileInput) {
                                    fileInput.click();
                                }
                            }}
                            className="cursor-pointer"
                        >
                            Choose Files
                        </Button>
                    </div>

                    {/* File List */}
                    {formData.attachments.length > 0 && (
                        <div className="mt-6 space-y-3">
                            {formData.attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <PaperClipIcon className="h-5 w-5 text-[#0051FF] flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-700 break-words truncate" title={file.name}>{file.name}</p>
                                            <p className="text-sm text-[#0051FF]">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveAttachment(index)}
                                        className="text-[#0051FF] hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 ml-2"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 