import React, { useEffect, useRef } from 'react';
import { useSnackbar } from './SnackbarProvider';

interface CompactErrorWithToastProps {
    error: string;
    title?: string;
    onRetry?: () => void;
}

/**
 * Shows the error as a toast and a compact inline retry (no full-page takeover).
 */
export const CompactErrorWithToast: React.FC<CompactErrorWithToastProps> = ({
    error,
    title = 'Failed to load',
    onRetry
}) => {
    const { showSnackbar } = useSnackbar();
    const shownRef = useRef(false);

    useEffect(() => {
        if (!error || shownRef.current) return;
        shownRef.current = true;
        showSnackbar({
            type: 'error',
            title,
            message: error,
            duration: 6000
        });
    }, [error, title, showSnackbar]);

    useEffect(() => {
        if (!error) shownRef.current = false;
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-gray-600 text-sm mb-3">{error}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#0051FF] hover:bg-[#0047E6]"
                >
                    Try again
                </button>
            )}
        </div>
    );
};
