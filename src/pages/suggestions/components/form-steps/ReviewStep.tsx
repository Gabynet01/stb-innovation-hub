import React from 'react';
import { CheckCircleIcon, UserIcon, EnvelopeIcon, PaperClipIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';
import { FormData } from '../../../../hooks';

interface ReviewStepProps {
    formData: FormData;
    expandedSections: Record<string, boolean>;
    onToggleSection: (section: string) => void;
    onEditStep: (step: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    formData,
    expandedSections,
    onToggleSection,
    onEditStep
}) => {
    return (
        <div className="mb-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0051FF] to-[#0047E6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Review & Submit</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Review all your information before submitting your suggestion
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Review Your Information</h3>
                    <p className="text-slate-600">Please review all details before submitting your suggestion</p>
                </div>

                <div className="space-y-4">
                    {/* Basic Information Accordion */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <button
                            type="button"
                            className="w-full px-6 py-5 text-left bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 rounded-t-xl border-b border-slate-200"
                            onClick={() => onToggleSection('basicInfo')}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[#0051FF] rounded-lg flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                                </div>
                                {expandedSections.basicInfo ? (
                                    <ChevronDownIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                ) : (
                                    <ChevronRightIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                )}
                            </div>
                        </button>
                        {expandedSections.basicInfo && (
                            <div className="px-6 py-6">
                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <table className="w-full">
                                        <tbody className="divide-y divide-slate-200">
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Author Type</td>
                                                <td className="px-4 py-3 text-sm text-slate-900">{formData.author_type}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Category</td>
                                                <td className="px-4 py-3 text-sm text-slate-900">{formData.category}</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Title</td>
                                                <td className="px-4 py-3 text-sm text-slate-900">{formData.title}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Description</td>
                                                <td className="px-4 py-3 text-sm text-slate-900 max-w-md">{formData.body}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditStep(1)}
                                        className="text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                                    >
                                        Edit Basic Info
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Information Accordion */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <button
                            type="button"
                            className="w-full px-6 py-5 text-left bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 rounded-t-xl border-b border-slate-200"
                            onClick={() => onToggleSection('contactInfo')}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                        <EnvelopeIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                                </div>
                                {expandedSections.contactInfo ? (
                                    <ChevronDownIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                ) : (
                                    <ChevronRightIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                )}
                            </div>
                        </button>
                        {expandedSections.contactInfo && (
                            <div className="px-6 py-6">
                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <table className="w-full">
                                        <tbody className="divide-y divide-slate-200">
                                            {formData.contact.email && (
                                                <tr className="bg-slate-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Email</td>
                                                    <td className="px-4 py-3 text-sm text-slate-900">{formData.contact.email}</td>
                                                </tr>
                                            )}
                                            {formData.contact.phone && (
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Phone</td>
                                                    <td className="px-4 py-3 text-sm text-slate-900">{formData.contact.phone}</td>
                                                </tr>
                                            )}
                                            {!formData.contact.email && !formData.contact.phone && (
                                                <tr className="bg-slate-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 w-1/3">Contact Info</td>
                                                    <td className="px-4 py-3 text-sm text-slate-500 italic">No contact information provided</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditStep(2)}
                                        className="text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                                    >
                                        Edit Contact Info
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Attachments Accordion */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        <button
                            type="button"
                            className="w-full px-6 py-5 text-left bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200 rounded-t-xl border-b border-slate-200"
                            onClick={() => onToggleSection('attachments')}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                        <PaperClipIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Supporting Documents</h3>
                                </div>
                                {expandedSections.attachments ? (
                                    <ChevronDownIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                ) : (
                                    <ChevronRightIcon className="h-6 w-6 text-slate-600 transition-transform duration-200" />
                                )}
                            </div>
                        </button>
                        {expandedSections.attachments && (
                            <div className="px-6 py-6">
                                {formData.attachments.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {formData.attachments.map((file, index) => (
                                                    <tr key={index} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-sm text-slate-900">
                                                            <div className="flex items-center space-x-3">
                                                                <PaperClipIcon className="h-4 w-4 text-[#0051FF]" />
                                                                <span className="font-medium">{file.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-[#0051FF] font-medium">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <PaperClipIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm">No attachments added</p>
                                    </div>
                                )}
                                {formData.attachments.length > 0 && (
                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditStep(3)}
                                            className="text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                                        >
                                            Edit Attachments
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 