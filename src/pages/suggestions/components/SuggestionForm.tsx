import React from 'react';
import { Stepper, ConfirmationModal } from '../../../components/ui';
import { useConfirmation, useSuggestionForm, SuggestionFormData } from '../../../hooks';
import { Suggestion } from '../../../types/api';
import {
    BasicInfoStep,
    ContactInfoStep,
    AttachmentsStep,
    ReviewStep,
    FormNavigation,
    FormStatus
} from './form-steps';
import { formSteps } from '../../../constants';

interface SuggestionFormProps {
    onSubmit: (suggestion: SuggestionFormData) => Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
    error?: string | null;
    editingSuggestion?: Suggestion | null;
}

export const SuggestionForm: React.FC<SuggestionFormProps> = ({
    onSubmit,
    onCancel,
    loading = false,
    error,
    editingSuggestion
}) => {
    const {
        currentStep,
        formData,
        errors,
        expandedSections,
        handleInputChange,
        handleFileUpload,
        removeAttachment,
        nextStep,
        prevStep,
        canSubmit,
        toggleSection,
        resetForm,
        goToStep
    } = useSuggestionForm(editingSuggestion || null, loading);

    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

    const handleSubmit = () => {
        if (!canSubmit()) return;

        const message = editingSuggestion
            ? 'Are you sure you want to update this suggestion?'
            : 'Are you sure you want to submit this suggestion?';

        showConfirmation({
            title: editingSuggestion ? 'Update Suggestion' : 'Submit Your Idea',
            message: message,
            type: 'question'
        }, async () => {
            const suggestionData: SuggestionFormData = {
                author_type: formData.author_type!,
                category: formData.category!,
                title: formData.title.trim(),
                body: formData.body.trim(),
                contact: {
                    email: formData.contact.email,
                    phone: formData.contact.phone
                },
                attachments: formData.attachments
            };

            await onSubmit(suggestionData);
        });
    };

    const handleClearForm = () => {
        showConfirmation({
            title: 'Clear Form',
            message: 'Are you sure you want to clear the form? This action cannot be undone.',
            type: 'warning'
        }, resetForm);
    };

    const handleEditStep = (step: number) => {
        // Navigate to the specified step for editing
        goToStep(step);
    };

    return (
        <div className="min-h-screen relative">
            <div className="max-w-5xl mx-auto">
                {/* Clean Progress Steps */}
                <Stepper
                    steps={formSteps}
                    currentStep={currentStep}
                    loading={loading}
                />

                {/* Status Display */}
                <FormStatus error={error} loading={loading} />

                {/* Step Content */}
                {currentStep === 1 && (
                    <BasicInfoStep
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                    />
                )}

                {currentStep === 2 && (
                    <ContactInfoStep
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                    />
                )}

                {currentStep === 3 && (
                    <AttachmentsStep
                        formData={formData}
                        onFileUpload={handleFileUpload}
                        onRemoveAttachment={removeAttachment}
                    />
                )}

                {currentStep === 4 && (
                    <ReviewStep
                        formData={formData}
                        expandedSections={expandedSections}
                        onToggleSection={toggleSection}
                        onEditStep={handleEditStep}
                    />
                )}

                {/* Navigation */}
                <FormNavigation
                    currentStep={currentStep}
                    canSubmit={canSubmit()}
                    loading={loading}
                    editingSuggestion={!!editingSuggestion}
                    onPrevStep={prevStep}
                    onNextStep={nextStep}
                    onSubmit={handleSubmit}
                    onClearForm={handleClearForm}
                />
            </div>

            {/* Confirmation Modal */}
            {confirmation && (
                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={hideConfirmation}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                    type={confirmation.type}
                />
            )}
        </div>
    );
}; 