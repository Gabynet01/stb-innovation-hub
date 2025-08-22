import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
    error: string | null;
    title?: string;
    onRetry?: () => void;
    retryText?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    title = "Failed to load content",
    onRetry,
    retryText = "Try Again",
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl'
    };

    const subTextSizes = {
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl'
    };

    const buttonSizes = {
        sm: 'px-6 py-3 text-sm',
        md: 'px-8 py-4 text-base',
        lg: 'px-10 py-5 text-lg'
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="relative">
                    <ExclamationTriangleIcon className={`${sizeClasses[size]} text-red-500 mx-auto mb-6`} />
                    <div className="absolute -inset-4 bg-red-50 rounded-full opacity-50"></div>
                </div>
                <p className={`text-red-600 font-bold mb-2 ${textSizes[size]}`}>{title}</p>
                <p className={`mt-3 text-gray-600 mb-8 ${subTextSizes[size]}`}>{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${buttonSizes[size]}`}
                    >
                        {retryText}
                    </button>
                )}
            </div>
        </div>
    );
}; 