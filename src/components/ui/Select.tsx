import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
    formFieldDefaultVariant,
    formFieldEmphasisVariant,
    formFieldErrorClasses,
} from './formFieldClasses';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    inputSize?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    leftIcon?: React.ComponentType<{ className?: string }>;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options,
    placeholder,
    inputSize = 'md',
    variant = 'default',
    leftIcon: LeftIcon,
    className,
    ...props
}) => {
    const baseClasses = [
        'w-full',
        'bg-white border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'appearance-none'
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
    const iconPadding = LeftIcon ? 'pl-10' : '';

    // Combine all classes
    const selectClasses = [
        ...baseClasses,
        sizeClasses[inputSize],
        variantClasses[variant],
        errorClasses,
        iconPadding,
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

                <select
                    className={selectClasses}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                </div>
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