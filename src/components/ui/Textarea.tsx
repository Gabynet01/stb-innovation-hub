import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    inputSize?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    rows?: number;
    maxLength?: number;
    showCharacterCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    inputSize = 'md',
    variant = 'default',
    rows = 4,
    maxLength,
    showCharacterCount = false,
    className,
    ...props
}) => {
    // Base classes
    const baseClasses = [
        'w-full',
        'border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'placeholder:text-slate-400',
        'resize-vertical'
    ];

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    // Variant classes - using Standard Bank electric blue
    const variantClasses = {
        default: 'border-slate-300 focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        success: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        warning: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        danger: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20'
    };

    // Error state - using Standard Bank electric blue
    const errorClasses = error ? 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20' : '';

    // Combine all classes
    const textareaClasses = [
        ...baseClasses,
        sizeClasses[inputSize],
        variantClasses[variant],
        errorClasses,
        'rounded-lg',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <div className="relative">
                <textarea
                    className={textareaClasses}
                    rows={rows}
                    maxLength={maxLength}
                    {...props}
                />
            </div>

            <div className="flex justify-between items-center">
                {error && (
                    <p className="text-sm text-[#0051FF] flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {showCharacterCount && maxLength && (
                    <span className="text-sm text-slate-500">
                        {props.value?.toString().length || 0} / {maxLength}
                    </span>
                )}
            </div>

            {helperText && !error && (
                <p className="text-sm text-slate-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 