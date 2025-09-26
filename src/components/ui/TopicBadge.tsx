import React from 'react';
import {
    ChartBarIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface TopicBadgeProps {
    label: string;
    confidence?: number | null;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showConfidence?: boolean;
    interactive?: boolean;
}

export const TopicBadge: React.FC<TopicBadgeProps> = ({
    label,
    confidence,
    onClick,
    size = 'md',
    showConfidence = true,
    interactive = false
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const confidenceColor = confidence && confidence > 0.8
        ? 'text-emerald-600'
        : confidence && confidence > 0.6
            ? 'text-yellow-600'
            : 'text-slate-500';

    const badgeContent = (
        <div className={`flex items-center space-x-2 ${sizeClasses[size]} bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 hover:from-purple-200 hover:to-pink-200 rounded-full font-medium transition-all duration-200 ${interactive ? 'cursor-pointer' : ''}`}>
            <ChartBarIcon className={`${iconSizes[size]} text-purple-600`} />
            <span className="truncate max-w-32">
                {label}
            </span>
            {showConfidence && confidence && (
                <span className={`text-xs font-semibold ${confidenceColor}`}>
                    {Math.round(confidence * 100)}%
                </span>
            )}
            {interactive && (
                <EyeIcon className={`${iconSizes[size]} text-purple-600 opacity-60`} />
            )}
        </div>
    );

    if (onClick && interactive) {
        return (
            <button
                onClick={onClick}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full"
                title={`View ${label} topic`}
            >
                {badgeContent}
            </button>
        );
    }

    return badgeContent;
};
