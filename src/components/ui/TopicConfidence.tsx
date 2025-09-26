import React from 'react';
import { Topic } from '@/types/api';

interface TopicConfidenceProps {
    topic: Topic;
    confidence: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const TopicConfidence: React.FC<TopicConfidenceProps> = ({
    topic,
    confidence,
    showLabel = true,
    size = 'sm',
    className = ''
}) => {
    const getConfidenceColor = (conf: number) => {
        if (conf >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
        if (conf >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (conf >= 0.4) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-2 py-1 text-xs';
            case 'md':
                return 'px-3 py-1.5 text-sm';
            case 'lg':
                return 'px-4 py-2 text-base';
            default:
                return 'px-2 py-1 text-xs';
        }
    };

    const confidencePercentage = Math.round(confidence * 100);
    const colorClasses = getConfidenceColor(confidence);
    const sizeClasses = getSizeClasses();

    return (
        <div className={`inline-flex items-center rounded-full border ${colorClasses} ${sizeClasses} ${className}`}>
            {showLabel && (
                <span className="font-medium mr-1">{topic.label}</span>
            )}
            <span className="text-xs opacity-75">
                {confidencePercentage}%
            </span>
        </div>
    );
};
