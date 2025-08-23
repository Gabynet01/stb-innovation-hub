import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Input } from '../../../../components/ui';
import { FormData } from '../../../../hooks';

interface ContactInfoStepProps {
    formData: FormData;
    errors: Record<string, string>;
    onInputChange: (field: keyof FormData, value: any) => void;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
    formData,
    errors,
    onInputChange
}) => {
    return (
        <div className="mb-8">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Contact Information</h2>
                <p className="text-slate-600">Provide your contact details so we can follow up on your suggestion</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            value={formData.contact.email || ''}
                            onChange={(e) => onInputChange('contact', { email: e.target.value || null })}
                            placeholder="your.email@company.com"
                            inputSize="lg"
                            variant={errors.email ? 'danger' : 'default'}
                        />
                        {errors.email && (
                            <p className="text-[#0051FF] text-sm mt-2 flex items-center">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Phone Number
                        </label>
                        <Input
                            type="tel"
                            value={formData.contact.phone || ''}
                            onChange={(e) => onInputChange('contact', { phone: e.target.value || null })}
                            placeholder="+260955123456"
                            inputSize="lg"
                            variant={errors.phone ? 'danger' : 'default'}
                        />
                        {errors.phone && (
                            <p className="text-[#0051FF] text-sm mt-2 flex items-center">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Contact Error */}
                {errors.contact && (
                    <div className="bg-gradient-to-r from-[#0051FF]/5 to-[#0047E6]/10 border border-[#0051FF]/20 rounded-xl p-4 mt-6">
                        <p className="text-[#0051FF] text-sm flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            {errors.contact}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}; 