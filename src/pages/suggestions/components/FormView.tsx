import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { SuggestionForm } from './SuggestionForm';
import { Suggestion } from '@/types/api';

interface FormViewProps {
    selectedSuggestion: Suggestion | null;
    onSubmit: (suggestionData: any) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export const FormView: React.FC<FormViewProps> = ({
    selectedSuggestion,
    onSubmit,
    onCancel,
    loading
}) => {
    return (
        <div>
            <div className="ml-4 mb-6">
                <button
                    onClick={onCancel}
                    className="group inline-flex items-center space-x-2 text-[#0051FF] hover:text-[#0033A1] transition-colors duration-200 font-medium"
                >
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    <span>Back to Suggestions</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <SuggestionForm
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    editingSuggestion={selectedSuggestion}
                    loading={loading}
                />
            </div>
        </div>
    );
}; 