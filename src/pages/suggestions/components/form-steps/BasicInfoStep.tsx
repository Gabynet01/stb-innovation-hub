import React from 'react';
import { UserIcon, TagIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Input, Textarea } from '../../../../components/ui';
import { FormData } from '../../../../hooks';
import { categoryOptions, authorTypeOptions } from '../../../../constants';

interface BasicInfoStepProps {
    formData: FormData;
    errors: Record<string, string>;
    onInputChange: (field: keyof FormData, value: any) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    return (
        <div className="mb-8">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0051FF] to-[#0047E6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <UserIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Basic Information</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Tell us about your innovative suggestion. Start with the essential details that will help us understand your idea.
                </p>
            </div>

            <div className="space-y-10 bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                {/* Author Type and Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-lg font-semibold text-slate-800 mb-4">
                            <UserIcon className="h-5 w-5 inline mr-2 text-[#0051FF]" />
                            I am a *
                        </label>
                        <div className="grid grid-cols-1 gap-4">
                            {authorTypeOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${formData.author_type === option.value
                                        ? 'border-[#0051FF] bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 shadow-lg'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                                        }`}
                                    onClick={() => onInputChange('author_type', option.value)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full mr-4 border-2 flex-shrink-0 transition-all duration-300 box-border ${formData.author_type === option.value
                                            ? 'bg-[#0051FF] border-[#0051FF]'
                                            : 'bg-white border-slate-300'
                                            }`} />
                                        <div>
                                            <p className="font-semibold text-slate-900 text-lg">{option.label}</p>
                                            <p className="text-slate-600 mt-1">{option.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.author_type && (
                            <p className="text-red-600 text-sm flex items-center mt-3 bg-red-50 px-3 py-2 rounded-lg">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                                {errors.author_type}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-slate-800 mb-4">
                            <TagIcon className="h-5 w-5 inline mr-2 text-[#0051FF]" />
                            Category *
                        </label>
                        <div className="space-y-4">
                            {categoryOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${formData.category === option.value
                                        ? 'border-[#0051FF] bg-gradient-to-r from-[#0051FF]/10 to-[#0047E6]/20 shadow-lg'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                                        }`}
                                    onClick={() => onInputChange('category', option.value)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full mr-4 border-2 flex-shrink-0 transition-all duration-300 box-border ${formData.category === option.value
                                            ? 'bg-[#0051FF] border-[#0051FF]'
                                            : 'bg-white border-slate-300'
                                            }`} />
                                        <div>
                                            <p className="font-semibold text-slate-900 text-lg">{option.label}</p>
                                            <p className="text-slate-600 mt-1">{option.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.category && (
                            <p className="text-red-600 text-sm flex items-center mt-3 bg-red-50 px-3 py-2 rounded-lg">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                                {errors.category}
                            </p>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-lg font-semibold text-slate-800 mb-4">
                        Suggestion Title *
                    </label>
                    <Input
                        value={formData.title}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        placeholder="Give your suggestion a clear, descriptive title..."
                        maxLength={120}
                        inputSize="lg"
                        variant={errors.title ? 'danger' : 'default'}
                        className="text-lg"
                    />
                    <div className="flex justify-between items-center mt-2">
                        {errors.title && (
                            <p className="text-[#0051FF] text-sm flex items-center">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                {errors.title}
                            </p>
                        )}
                        <span className="text-xs text-slate-500 ml-auto">
                            {formData.title.length}/120
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-lg font-semibold text-slate-800 mb-4">
                        Detailed Description *
                    </label>
                    <Textarea
                        value={formData.body}
                        onChange={(e) => onInputChange('body', e.target.value)}
                        placeholder="Describe your suggestion in detail. What problem does it solve? What are the expected benefits? How would you implement it?"
                        rows={8}
                        maxLength={10000}
                        variant={errors.body ? 'danger' : 'default'}
                        className="text-base"
                    />
                    <div className="flex justify-between items-center mt-2">
                        {errors.body && (
                            <p className="text-[#0051FF] text-sm flex items-center">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                {errors.body}
                            </p>
                        )}
                        <span className="text-xs text-slate-500 ml-auto">
                            {formData.body.length}/10,000
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 