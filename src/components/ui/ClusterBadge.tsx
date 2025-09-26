import React from 'react';
import {
    SparklesIcon,
    TagIcon,
    ChartBarIcon,
    BoltIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

interface ClusterBadgeProps {
    kind: string;
    title?: string | null;
    confidence?: number | null;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    showConfidence?: boolean;
    interactive?: boolean;
}

export const ClusterBadge: React.FC<ClusterBadgeProps> = ({
    kind,
    title,
    confidence,
    onClick,
    size = 'md',
    showConfidence = true,
    interactive = false
}) => {
    const getClusterConfig = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING':
                return {
                    icon: SparklesIcon,
                    color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
                    hoverColor: 'hover:from-blue-200 hover:to-indigo-200',
                    iconColor: 'text-blue-600',
                    label: 'AI Similarity'
                };
            case 'TAG':
                return {
                    icon: TagIcon,
                    color: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
                    hoverColor: 'hover:from-emerald-200 hover:to-green-200',
                    iconColor: 'text-emerald-600',
                    label: 'Tag Grouping'
                };
            case 'TOPIC':
                return {
                    icon: ChartBarIcon,
                    color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200',
                    hoverColor: 'hover:from-purple-200 hover:to-pink-200',
                    iconColor: 'text-purple-600',
                    label: 'Topic Based'
                };
            case 'FUSION':
                return {
                    icon: BoltIcon,
                    color: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200',
                    hoverColor: 'hover:from-orange-200 hover:to-red-200',
                    iconColor: 'text-orange-600',
                    label: 'AI Fusion'
                };
            default:
                return {
                    icon: SparklesIcon,
                    color: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200',
                    hoverColor: 'hover:from-slate-200 hover:to-gray-200',
                    iconColor: 'text-slate-600',
                    label: kind
                };
        }
    };

    const config = getClusterConfig(kind);
    const Icon = config.icon;

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
        <div className={`flex items-center space-x-2 ${sizeClasses[size]} ${config.color} ${config.hoverColor} border rounded-full font-medium transition-all duration-200 ${interactive ? 'cursor-pointer' : ''}`}>
            <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
            <span className="truncate max-w-32">
                {title || config.label}
            </span>
            {showConfidence && confidence && (
                <span className={`text-xs font-semibold ${confidenceColor}`}>
                    {Math.round(confidence * 100)}%
                </span>
            )}
            {interactive && (
                <EyeIcon className={`${iconSizes[size]} ${config.iconColor} opacity-60`} />
            )}
        </div>
    );

    if (onClick && interactive) {
        return (
            <button
                onClick={onClick}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                title={`View ${title || config.label} cluster`}
            >
                {badgeContent}
            </button>
        );
    }

    return badgeContent;
};
