import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface FormStatusProps {
    error?: string | null;
    loading?: boolean;
}

export const FormStatus: React.FC<FormStatusProps> = ({ error, loading }) => {
    if (!error && !loading) return null;

    return (
        <>
            {/* Error Display */}
            {error && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-800 mb-1">Submission Failed</h3>
                            <p className="text-red-700">{error}</p>
                            <p className="text-sm text-red-600 mt-2">Please review your information and try again.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Progress */}
            {loading && (
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">Submitting Your Suggestion</h3>
                            <p className="text-blue-700">Please wait while we process your submission...</p>
                            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 