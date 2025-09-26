import React, { useState, useEffect } from 'react';
import { Topic, TopicCreate } from '@/types/api';
import { Button, Input, Textarea } from '@/components/ui';
import { XMarkIcon, TagIcon } from '@heroicons/react/24/outline';

interface TopicFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (topic: TopicCreate | Partial<Topic>) => Promise<void>;
    isEditing: boolean;
    topic?: Topic | null;
}

export const TopicFormModal: React.FC<TopicFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isEditing,
    topic
}) => {
    const [formData, setFormData] = useState({
        label: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (topic && isEditing) {
            setFormData({
                label: topic.label,
                description: topic.description || ''
            });
        } else {
            setFormData({
                label: '',
                description: ''
            });
        }
        setErrors({});
    }, [topic, isEditing, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.label.trim()) {
            newErrors.label = 'Topic label is required';
        } else if (formData.label.length > 255) {
            newErrors.label = 'Topic label must be less than 255 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Failed to save topic:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="px-6 py-4 bg-blue-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <TagIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {isEditing ? 'Edit Topic' : 'Create Topic'}
                                    </h3>
                                    <p className="text-blue-100">
                                        {isEditing ? 'Update topic information' : 'Add a new topic'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-blue-100 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topic Label *
                            </label>
                            <Input
                                type="text"
                                value={formData.label}
                                onChange={(e) => handleInputChange('label', e.target.value)}
                                placeholder="Enter topic label..."
                                error={errors.label}
                                maxLength={255}
                            />
                            {errors.label && (
                                <p className="mt-1 text-sm text-red-600">{errors.label}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter topic description (optional)..."
                                rows={3}
                                error={errors.description}
                                maxLength={1000}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !formData.label.trim()}
                                className="min-w-[100px]"
                            >
                                {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};