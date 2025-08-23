import React from 'react';
import { Suggestion } from '@/types/api';
import { ConfirmationModal } from '@/components/ui';
import { useConfirmation } from '@/hooks/useConfirmation';
import { SuggestionHeader } from './SuggestionHeader';
import { SuggestionContent } from './SuggestionContent';
import { SuggestionFooter } from './SuggestionFooter';

interface SuggestionDetailProps {
    suggestion: Suggestion;
    onClose: () => void;
    onEdit?: (suggestion: Suggestion) => void;
    onDelete?: (id: string) => void;
}

export const SuggestionDetail: React.FC<SuggestionDetailProps> = ({
    suggestion,
    onClose,
    onEdit,
    onDelete
}) => {
    const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

    const handleDelete = () => {
        showConfirmation({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this suggestion? This action cannot be undone.',
            type: 'danger'
        }, () => {
            onDelete?.(suggestion.id);
            onClose();
        });
    };

    const handleEdit = () => {
        onEdit?.(suggestion);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                    <SuggestionHeader
                        suggestion={suggestion}
                        onClose={onClose}
                    />

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                        <SuggestionContent suggestion={suggestion} />
                    </div>

                    <SuggestionFooter
                        onClose={onClose}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
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
        </>
    );
}; 