import React, { useState, useCallback, useRef } from 'react';
import {
    LightBulbIcon,
    UserIcon,
    DocumentTextIcon,
    PaperClipIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Input, Textarea, Select } from '../ui';
import { AuthorType, Category } from '@/types/api';

// Form data interface that matches the API spec exactly
export interface SuggestionFormData {
    author_type: AuthorType;
    category: Category;
    title: string;
    body: string;
    contact: {
        email: string;
        phone?: string;
    };
    attachments?: Record<string, any>[] | null;
}

interface SuggestionFormProps {
    onSubmit: (data: SuggestionFormData) => Promise<void>;
    loading?: boolean;
}

interface FormErrors {
    title?: string;
    body?: string;
    author_type?: string;
    category?: string;
    contact?: {
        email?: string;
        phone?: string;
    };
    attachments?: string;
}

const CATEGORIES = [
    { value: Category.UX, label: 'User Experience', description: 'Improvements to customer interfaces' },
    { value: Category.PRODUCT, label: 'Product & Services', description: 'New products or service enhancements' },
    { value: Category.SERVICE, label: 'Service & Support', description: 'Customer service improvements' },
    { value: Category.OPERATIONAL, label: 'Operational & Process', description: 'Internal process optimization' },
    { value: Category.OTHER, label: 'Other', description: 'General improvements' }
];

const AUTHOR_TYPES = [
    { value: AuthorType.STAFF, label: 'Staff Member', description: 'Stanbic Bank employee' },
    { value: AuthorType.CUSTOMER, label: 'Customer', description: 'Stanbic Bank customer' }
];



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SuggestionForm: React.FC<SuggestionFormProps> = ({ onSubmit, loading = false }) => {
    const [formData, setFormData] = useState<SuggestionFormData>({
        author_type: AuthorType.STAFF,
        category: Category.OTHER,
        title: '',
        body: '',
        contact: { email: '', phone: '' },
        attachments: null
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters long';
        } else if (formData.title.trim().length > 120) {
            newErrors.title = 'Title must be less than 120 characters';
        }

        // Body validation
        if (!formData.body.trim()) {
            newErrors.body = 'Description is required';
        } else if (formData.body.trim().length < 10) {
            newErrors.body = 'Description must be at least 10 characters long';
        } else if (formData.body.trim().length > 10000) {
            newErrors.body = 'Description must be less than 10,000 characters';
        }

        // Email validation
        if (!formData.contact.email.trim()) {
            newErrors.contact = { ...newErrors.contact, email: 'Email is required' };
        } else if (!EMAIL_REGEX.test(formData.contact.email.trim())) {
            newErrors.contact = { ...newErrors.contact, email: 'Please enter a valid email address' };
        }

        // Phone validation (optional but validate format if provided)
        if (formData.contact.phone && formData.contact.phone.trim()) {
            const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
            if (!phoneRegex.test(formData.contact.phone.trim())) {
                newErrors.contact = { ...newErrors.contact, phone: 'Please enter a valid phone number' };
            }
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await onSubmit(formData);
                // Reset form on successful submission
                setFormData({
                    author_type: AuthorType.STAFF,
                    category: Category.OTHER,
                    title: '',
                    body: '',
                    contact: { email: '', phone: '' },
                    attachments: null
                });
                setErrors({});
            } catch (error) {
                // Error handling is done in the parent component
                console.error('Form submission failed:', error);
            }
        }
    }, [formData, validateForm, onSubmit]);

    const handleInputChange = useCallback((field: keyof SuggestionFormData, value: any) => {
        if (field === 'contact') {
            setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, ...value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field as keyof FormErrors]: undefined }));
        }
    }, [errors]);

    const clearError = useCallback((field: keyof FormErrors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        // Transform File objects to match API spec format
        const fileData = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        }));
        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...fileData]
        }));
    }, []);

    const removeFile = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index) || []
        }));
    }, []);



    return (
        <Card padding="xl" shadow="large" animate>
            <div className="text-center mb-10">
                <div className="inline-flex p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl mb-6">
                    <LightBulbIcon className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
                    Share Your Innovation
                </h2>
                <p className="text-neutral-600 text-lg">
                    Have an idea that could transform Stanbic Bank Zambia? We'd love to hear it!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Author Type and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Select
                        label="I am a"
                        options={AUTHOR_TYPES}
                        placeholder="Select your role"
                        value={formData.author_type}
                        onChange={(e) => handleInputChange('author_type', e.target.value as AuthorType)}
                        leftIcon={UserIcon}
                    />

                    <Select
                        label="Category"
                        options={CATEGORIES}
                        placeholder="Select a category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value as Category)}

                    />
                </div>

                {/* Title */}
                <Input
                    label="Suggestion Title"
                    placeholder="Brief, descriptive title for your suggestion"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    onFocus={() => clearError('title')}
                    error={errors.title}
                    leftIcon={LightBulbIcon}
                    inputSize="lg"
                    maxLength={120}
                />

                {/* Description */}
                <Textarea
                    label="Detailed Description"
                    placeholder="Describe your suggestion in detail. What problem does it solve? How would it work? What are the benefits?"
                    value={formData.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    onFocus={() => clearError('body')}
                    error={errors.body}
                    rows={6}
                    maxLength={10000}
                    showCharacterCount
                    inputSize="lg"
                />





                {/* File Attachments */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-neutral-900">
                        Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-primary-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer">
                        <PaperClipIcon className="h-10 w-10 text-primary-400 mx-auto mb-3" />
                        <p className="text-sm text-primary-600 mb-2 font-medium">
                            Drop files here or click to browse
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose Files
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                        />
                    </div>

                    {/* File List */}
                    {formData.attachments && formData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {formData.attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-xl border border-neutral-200 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center space-x-3">
                                        <PaperClipIcon className="h-5 w-5 text-primary-500" />
                                        <span className="text-sm font-medium text-neutral-700">{file.name}</span>
                                        <span className="text-xs text-neutral-500">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-neutral-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="your.email@stanbicbank.co.zm"
                        value={formData.contact.email}
                        onChange={(e) => handleInputChange('contact', { email: e.target.value })}
                        onFocus={() => clearError('contact')}
                        error={errors.contact?.email}
                        leftIcon={DocumentTextIcon}
                        required
                    />

                    <Input
                        label="Phone Number (Optional)"
                        type="tel"
                        placeholder="+260 955 123 456"
                        value={formData.contact.phone || ''}
                        onChange={(e) => handleInputChange('contact', { phone: e.target.value })}
                        onFocus={() => clearError('contact')}
                        error={errors.contact?.phone}
                        leftIcon={UserIcon}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    fullWidth
                    className="h-14 text-lg font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Innovation Suggestion'}
                </Button>

                {/* Form Footer */}
                <div className="text-center pt-6 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        Your suggestion will be reviewed by our innovation team.
                        We'll get back to you within 5 business days.
                    </p>
                </div>
            </form>
        </Card>
    );
}; 