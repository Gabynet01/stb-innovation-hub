import React from 'react';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
    rounded?: 'sm' | 'md' | 'full';
    withDot?: boolean;
    removable?: boolean;
    onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className,
    rounded = 'md',
    withDot = false,
    removable = false,
    onRemove,
}) => {
    // Base classes
    const baseClasses = [
        'inline-flex items-center font-medium',
        'transition-all duration-200'
    ];

    // Variant classes
    const variantClasses = {
        default: 'bg-slate-100 text-slate-800 border border-slate-200',
        primary: 'bg-primary text-white border border-blue-600',
        success: 'bg-success text-white border border-emerald-600',
        warning: 'bg-warning text-white border border-amber-600',
        danger: 'bg-danger text-white border border-red-600',
        info: 'bg-info text-white border border-cyan-600',
        neutral: 'bg-slate-200 text-slate-700 border border-slate-300'
    };

    // Size classes
    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm'
    };

    // Rounded classes
    const roundedClasses = {
        sm: 'rounded',
        md: 'rounded-full',
        full: 'rounded-full'
    };

    // Dot classes
    const dotClasses = withDot ? 'pl-1.5' : '';

    // Remove button classes
    const removeButtonClasses = removable ? [
        'ml-1.5 -mr-1',
        'h-4 w-4',
        'rounded-full',
        'inline-flex items-center justify-center',
        'text-current hover:bg-black hover:bg-opacity-10',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
    ] : [];

    // Combine all classes
    const badgeClasses = [
        ...baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        dotClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={badgeClasses}>
            {withDot && (
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5" />
            )}
            {children}
            {removable && (
                <button
                    type="button"
                    className={removeButtonClasses.join(' ')}
                    onClick={onRemove}
                    aria-label="Remove badge"
                >
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </span>
    );
}; 