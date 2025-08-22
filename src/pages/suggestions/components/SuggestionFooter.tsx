import React from 'react';
import { Button } from '@/components/ui';

interface SuggestionFooterProps {
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const SuggestionFooter: React.FC<SuggestionFooterProps> = ({
    onClose,
    onEdit,
    onDelete
}) => {
    return (
        <div className="border-t border-slate-100 bg-slate-50 px-8 py-6">
            <div className="flex items-center justify-end space-x-3">
                <Button
                    onClick={onClose}
                    variant="secondary"
                    size="md"
                    className="px-6"
                >
                    Close
                </Button>
                <Button
                    onClick={onEdit}
                    variant="primary"
                    size="md"
                    className="px-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    Edit Suggestion
                </Button>
                <Button
                    onClick={onDelete}
                    variant="danger"
                    size="md"
                    className="px-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}; 