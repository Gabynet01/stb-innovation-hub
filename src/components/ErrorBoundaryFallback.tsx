import React, { useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from './ui/SnackbarProvider';

interface ErrorBoundaryFallbackProps {
    error: Error | null;
    onRetry: () => void;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ error, onRetry }) => {
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        showSnackbar({
            type: 'error',
            title: 'Something went wrong',
            message: error?.message || 'An unexpected error occurred. Please try again.',
            duration: 8000
        });
    }, [error?.message, showSnackbar]);

    return (
        <div className="flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-sm text-gray-600 mb-4">
                    We've shown an error notification. You can try again or reload the page.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#0051FF] hover:bg-[#0047E6]"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Try again
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                        Reload page
                    </button>
                </div>
            </div>
        </div>
    );
};
