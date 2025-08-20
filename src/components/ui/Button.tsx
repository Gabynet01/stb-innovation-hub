import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
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
    rounded = 'md',
    className,
    disabled,
    ...props
}) => {
    // Base classes
    const baseClasses = [
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed'
    ];

    // Variant classes
    const variantClasses = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl transition-all duration-200',
        secondary: 'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500 shadow-lg hover:shadow-xl transition-all duration-200',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transition-all duration-200',
        warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-lg hover:shadow-xl transition-all duration-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 transition-all duration-200',
        outline: 'bg-transparent text-primary-600 border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-500 transition-all duration-200'
    };

    // Size classes
    const sizeClasses = {
        xs: 'px-2.5 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
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
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full'
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = [
        ...baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        widthClasses,
        className
    ].filter(Boolean).join(' ');

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