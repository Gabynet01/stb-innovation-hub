import React from 'react';
import { Button } from '@/components/ui';
import { SuggestionDetail } from './SuggestionDetail';
import { Suggestion } from '@/types/api';

interface DetailViewProps {
    selectedSuggestion: Suggestion;
    onEdit: (suggestion: Suggestion) => void;
    onDelete: (id: string) => Promise<void>;
    onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
    selectedSuggestion,
    onEdit,
    onDelete,
    onBack
}) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 -ml-6">
                <Button
                    onClick={onBack}
                    variant="secondary"
                    className="mb-4"
                >
                    ← Back to Suggestions
                </Button>
            </div>
            <SuggestionDetail
                suggestion={selectedSuggestion}
                onEdit={() => onEdit(selectedSuggestion)}
                onDelete={() => onDelete(selectedSuggestion.id)}
                onClose={onBack}
            />
        </div>
    );
}; 