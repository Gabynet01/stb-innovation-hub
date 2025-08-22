import React from 'react';

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
    // Base classes
    const baseClasses = [
        'w-full',
        'border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'placeholder:text-slate-400'
    ];

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    // Variant classes - using Stanbic Bank electric blue
    const variantClasses = {
        default: 'border-slate-300 focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        success: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        warning: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20',
        danger: 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20'
    };

    // Error state - using Stanbic Bank electric blue
    const errorClasses = error ? 'border-[#0051FF] focus:border-[#0051FF] focus:ring-[#0051FF]/20' : '';

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
                <p className="text-sm text-[#0051FF] flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="text-sm text-slate-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 