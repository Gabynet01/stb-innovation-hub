import React from 'react';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';
import { FormData } from '../../../../hooks';
import { fileTypes } from '../../../../constants';

interface AttachmentsStepProps {
    formData: FormData;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAttachment: (index: number) => void;
}

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
    formData,
    onFileUpload,
    onRemoveAttachment
}) => {
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
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors bg-slate-50">
                        <PaperClipIcon className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                        <p className="text-base text-slate-700 mb-2">
                            Drag and drop files here, or click to browse
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
                                    <div className="flex items-center space-x-3">
                                        <PaperClipIcon className="h-5 w-5 text-[#0051FF]" />
                                        <div>
                                            <p className="font-medium text-slate-700">{file.name}</p>
                                            <p className="text-sm text-[#0051FF]">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveAttachment(index)}
                                        className="text-[#0051FF] hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
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