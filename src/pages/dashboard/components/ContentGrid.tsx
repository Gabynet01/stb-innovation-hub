import React, { useState } from 'react';
import type { Cluster, Topic, Suggestion } from '../../../types/api';
import { RecentIdeas } from './RecentIdeas';
import { AIInsights } from './AIInsights';
import { IdeaDetailModal } from './IdeaDetailModal';

interface ContentGridProps {
    clusters: Cluster[];
    topics: Topic[];
    suggestions: Suggestion[];
    onViewClusters?: () => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ clusters, topics, suggestions, onViewClusters }) => {
    const [selectedIdea, setSelectedIdea] = useState<Suggestion | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIdeaClick = (suggestion: Suggestion) => {
        setSelectedIdea(suggestion);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIdea(null);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentIdeas
                    suggestions={suggestions}
                    onIdeaClick={handleIdeaClick}
                />
                <AIInsights
                    clusters={clusters}
                    topics={topics}
                    onViewClusters={onViewClusters}
                />
            </div>

            {/* Idea Detail Modal */}
            {selectedIdea && (
                <IdeaDetailModal
                    suggestion={selectedIdea}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </>
    );
}; 