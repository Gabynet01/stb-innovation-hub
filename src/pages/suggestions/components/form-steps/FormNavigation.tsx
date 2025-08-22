import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../../components/ui';

interface FormNavigationProps {
    currentStep: number;
    canSubmit: boolean;
    loading: boolean;
    editingSuggestion: boolean;
    onPrevStep: () => void;
    onNextStep: () => void;
    onSubmit: () => void;
    onClearForm: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
    currentStep,
    canSubmit,
    loading,
    editingSuggestion,
    onPrevStep,
    onNextStep,
    onSubmit,
    onClearForm
}) => {
    return (
        <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <div className="flex items-center space-x-4">
                {currentStep > 1 ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onPrevStep}
                        className="px-8 py-3 text-slate-700 hover:text-slate-900 border-slate-300 hover:border-slate-400"
                    >
                        ← Previous Step
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onClearForm}
                        className="px-6 py-3 text-slate-600 hover:text-slate-800 border-slate-300 hover:border-slate-400"
                    >
                        Clear Form
                    </Button>
                )}
            </div>

            {currentStep < 4 ? (
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={onNextStep}
                    className="px-10 py-3 bg-gradient-to-r from-[#0051FF] to-[#0047E6] hover:from-[#0047E6] hover:to-[#0038CC] shadow-lg hover:shadow-xl"
                >
                    Continue to Next Step →
                </Button>
            ) : (
                <div className="text-center space-y-4">
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        icon={loading ? undefined : PlusIcon}
                        className="px-12 py-4 bg-gradient-to-r from-[#0051FF] to-[#0047E6] hover:from-[#0047E6] hover:to-[#0038CC] shadow-lg hover:shadow-xl text-lg font-semibold"
                        disabled={!canSubmit || loading}
                        onClick={onSubmit}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Submitting Your Idea...</span>
                            </div>
                        ) : (
                            editingSuggestion ? 'Update Suggestion' : 'Submit Your Idea'
                        )}
                    </Button>

                    {!canSubmit && (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 font-medium">
                                Please complete all required fields to submit
                            </p>
                            <div className="text-xs text-slate-500 space-y-1 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
                                <p className="font-medium">Missing fields:</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {/* This would need to be dynamically generated based on actual missing fields */}
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Required fields missing</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}; 