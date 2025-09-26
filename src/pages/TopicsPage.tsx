import React, { useState, useMemo } from 'react';
import { useTopics } from '@/hooks';
import { Topic, TopicCreate } from '@/types/api';
import { Button, LoadingSpinner, ErrorState } from '@/components/ui';
import { useConfirmation } from '@/hooks';
import { TopicFormModal } from '@/components/modals/TopicFormModal';
import { TopicDetailModal } from '@/components/modals/TopicDetailModal';
import { TopicList, TopicFilters } from './topics/components';
import { PlusIcon } from '@heroicons/react/24/outline';

const TopicsPage: React.FC = () => {
    const {
        topics,
        loading,
        error,
        createTopic,
        updateTopic,
        deleteTopic
    } = useTopics();

    const { showConfirmation } = useConfirmation();

    // UI State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('created_at_desc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    // Filter and sort topics
    const filteredAndSortedTopics = useMemo(() => {
        let filtered = topics;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(topic =>
                topic.label.toLowerCase().includes(query) ||
                (topic.description && topic.description.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'created_at_desc':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'created_at_asc':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'updated_at_desc':
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'label_asc':
                    return a.label.localeCompare(b.label);
                case 'label_desc':
                    return b.label.localeCompare(a.label);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [topics, searchQuery, sortBy]);

    // Event Handlers
    const handleCreateClick = () => {
        setSelectedTopic(null);
        setShowCreateModal(true);
    };

    const handleEditClick = (topic: Topic) => {
        setSelectedTopic(topic);
        setShowEditModal(true);
    };

    const handleEditFromDetail = (topic: Topic) => {
        setShowDetailModal(false); // Close detail modal first
        setSelectedTopic(topic);
        setShowEditModal(true);
    };

    const handleViewClick = (topic: Topic) => {
        setSelectedTopic(topic);
        setShowDetailModal(true);
    };

    const handleDeleteClick = (topic: Topic) => {
        showConfirmation(
            {
                title: 'Delete Topic',
                message: `Are you sure you want to delete "${topic.label}"? This action cannot be undone.`
            },
            () => deleteTopic(topic.id)
        );
    };

    const handleCreateTopic = async (topicData: TopicCreate | Partial<Topic>) => {
        try {
            await createTopic(topicData as TopicCreate);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create topic:', error);
        }
    };

    const handleEditTopic = async (topicData: TopicCreate | Partial<Topic>) => {
        if (!selectedTopic) return;

        try {
            await updateTopic(selectedTopic.id, topicData);
            setShowEditModal(false);
            setSelectedTopic(null);
        } catch (error) {
            console.error('Failed to update topic:', error);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSortBy('created_at_desc');
    };

    const handleCloseModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDetailModal(false);
        setSelectedTopic(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <ErrorState
                    error={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden">
                {/* Elegant Background with Stanbic Bank Blue */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0051FF] via-[#0047E6] to-[#0038CC]"></div>

                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-8 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Topics</h1>
                            <p className="text-white/70 mt-1">
                                Manage and organize topics for your suggestions
                            </p>
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs"
                        >
                            <PlusIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                            <span>Create Topic</span>
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Border with Enhanced Effect */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
                </div>
            </div>

            {/* Filters */}
            <TopicFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearFilters={handleClearFilters}
            />

            {/* Topics List */}
            <TopicList
                topics={filteredAndSortedTopics}
                viewMode={viewMode}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onView={handleViewClick}
            />

            {/* Modals */}
            {showCreateModal && (
                <TopicFormModal
                    isOpen={showCreateModal}
                    onClose={handleCloseModals}
                    onSave={handleCreateTopic}
                    isEditing={false}
                />
            )}

            {showEditModal && selectedTopic && (
                <TopicFormModal
                    isOpen={showEditModal}
                    onClose={handleCloseModals}
                    onSave={handleEditTopic}
                    isEditing={true}
                    topic={selectedTopic}
                />
            )}

            {showDetailModal && selectedTopic && (
                <TopicDetailModal
                    isOpen={showDetailModal}
                    onClose={handleCloseModals}
                    topic={selectedTopic}
                    onEdit={handleEditFromDetail}
                    onDelete={(topicId) => handleDeleteClick(selectedTopic)}
                />
            )}
        </div>
    );
};

export { TopicsPage };
export default TopicsPage;
