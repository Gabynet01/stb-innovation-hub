import React from 'react';
import { AIInsights } from './AIInsights';

interface ContentGridProps {
    onViewClusters?: () => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ onViewClusters }) => {
    return (
        <div className="grid grid-cols-1 max-w-4xl">
            <AIInsights onViewClusters={onViewClusters} />
        </div>
    );
};
