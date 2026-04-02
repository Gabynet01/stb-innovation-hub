import React from 'react';
import {
    formFieldDefaultVariant,
    formFieldEmphasisVariant,
    formFieldErrorClasses,
} from './formFieldClasses';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ComponentType<{ className?: string }>;
    rightIcon?: React.ComponentType<{ className?: string }>;
    inputSize?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    inputSize = 'md',
    variant = 'default',
    className,
    ...props
}) => {
    // Base classes — depth + Stanbic-tinted border (default state lifts on hover/focus)
    const baseClasses = [
        'w-full',
        'bg-white border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'placeholder:text-slate-400'
    ];

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2.5 text-sm min-h-[40px]',
        md: 'px-4 py-3 text-sm min-h-[44px]',
        lg: 'px-4 py-3.5 text-base min-h-[48px]'
    };

    const variantClasses = {
        default: formFieldDefaultVariant,
        success: formFieldEmphasisVariant,
        warning: formFieldEmphasisVariant,
        danger: formFieldEmphasisVariant,
    };

    const errorClasses = error ? formFieldErrorClasses : '';

    // Icon padding
    const iconPadding = {
        left: LeftIcon ? 'pl-10' : '',
        right: RightIcon ? 'pr-10' : ''
    };

    // Combine all classes
    const inputClasses = [
        ...baseClasses,
        sizeClasses[inputSize],
        variantClasses[variant],
        errorClasses,
        iconPadding.left,
        iconPadding.right,
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
                {LeftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LeftIcon className="h-5 w-5 text-slate-400" />
                    </div>
                )}

                <input
                    className={inputClasses}
                    {...props}
                />

                {RightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <RightIcon className="h-5 w-5 text-slate-400" />
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-sm text-slate-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 