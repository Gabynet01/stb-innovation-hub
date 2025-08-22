import React from 'react';
import { Button } from '@/components/ui';
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
        <div className="max-w-4xl mx-auto">
            <SuggestionForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                editingSuggestion={selectedSuggestion}
                loading={loading}
            />
        </div>
    );
}; 