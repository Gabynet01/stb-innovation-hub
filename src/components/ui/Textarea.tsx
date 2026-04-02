import React from 'react';
import {
    formFieldDefaultVariant,
    formFieldEmphasisVariant,
    formFieldErrorClasses,
} from './formFieldClasses';

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
    const baseClasses = [
        'w-full',
        'bg-white border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'placeholder:text-slate-400',
        'resize-vertical'
    ];

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2.5 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base'
    };

    const variantClasses = {
        default: formFieldDefaultVariant,
        success: formFieldEmphasisVariant,
        warning: formFieldEmphasisVariant,
        danger: formFieldEmphasisVariant,
    };

    const errorClasses = error ? formFieldErrorClasses : '';

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
                    <p className="text-sm text-red-600">{error}</p>
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