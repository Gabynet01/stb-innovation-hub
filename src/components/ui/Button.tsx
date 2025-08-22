import React from 'react';
import { classNames } from '../../utils/classNames';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline' | 'gradient';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    iconPosition?: 'left' | 'right';
    children: React.ReactNode;
    fullWidth?: boolean;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    children,
    fullWidth = false,
    rounded = 'lg',
    className,
    disabled,
    ...props
}) => {
    // Base classes
    const baseClasses = [
        'inline-flex items-center justify-center font-semibold transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transform hover:scale-[1.02] active:scale-[0.98]'
    ];

    // Variant classes - Clean Professional Design
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/30 shadow-md hover:shadow-lg',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/30 shadow-sm hover:shadow-md',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/30 shadow-md hover:shadow-lg',
        warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500/30 shadow-md hover:shadow-lg',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 shadow-md hover:shadow-lg',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500/30',
        outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-500/30 transition-all duration-300',
        gradient: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/30 shadow-md hover:shadow-lg'
    };

    // Size classes
    const sizeClasses = {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-lg'
    };

    // Icon size classes
    const iconSizeClasses = {
        xs: 'h-3.5 w-3.5',
        sm: 'h-4 w-4',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6'
    };

    // Rounded classes
    const roundedClasses = {
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        full: 'rounded-full'
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = classNames(
        ...baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        widthClasses,
        className
    );

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizeClasses[size]}`} />
            )}

            {Icon && !loading && iconPosition === 'left' && (
                <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
            )}

            {children}

            {Icon && !loading && iconPosition === 'right' && (
                <Icon className={`${iconSizeClasses[size]} ${children ? 'ml-2' : ''}`} />
            )}
        </button>
    );
}; 