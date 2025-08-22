import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    shadow?: 'none' | 'soft' | 'medium' | 'large' | 'xl';
    border?: 'none' | 'subtle' | 'medium' | 'strong';
    hover?: boolean;
    gradient?: boolean;
    rounded?: 'sm' | 'md' | 'lg' | 'xl';
    animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    padding = 'md',
    shadow = 'soft',
    border = 'subtle',
    hover = false,
    gradient = false,
    rounded = 'lg',
    animate = false,
}) => {
    // Base classes
    const baseClasses = [
        'bg-white',
        'transition-all duration-200',
        animate ? 'animate-fade-in' : ''
    ];

    // Padding classes
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
    };

    // Shadow classes
    const shadowClasses = {
        none: '',
        soft: 'shadow-soft',
        medium: 'shadow-medium',
        large: 'shadow-large',
        xl: 'shadow-xl'
    };

    // Border classes
    const borderClasses = {
        none: '',
        subtle: 'border-subtle',
        medium: 'border-medium',
        strong: 'border-strong'
    };

    // Rounded classes
    const roundedClasses = {
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl'
    };

    // Hover effects with Stanbic Bank electric blue
    const hoverClasses = hover ? [
        'hover:shadow-large',
        'hover:scale-[1.02]',
        'hover:border-[#0051FF]/20',
        'hover:shadow-[#0051FF]/5'
    ] : [];

    // Gradient background with Stanbic Bank electric blue accents
    const backgroundClasses = gradient ? 'bg-gradient-to-br from-white via-slate-50 to-[#0051FF]/5' : 'bg-white';

    // Combine all classes
    const cardClasses = [
        ...baseClasses,
        backgroundClasses,
        paddingClasses[padding],
        shadowClasses[shadow],
        borderClasses[border],
        roundedClasses[rounded],
        ...hoverClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses}>
            {children}
        </div>
    );
}; 