import React, { useState } from 'react';
import { SuggestionList } from './SuggestionList';
import { SuggestionForm } from './SuggestionForm';
import { useSuggestions } from '@/hooks/useSuggestions';
import {
    ListBulletIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Suggestion, SuggestionCreate } from '@/types/api';

interface Tab {
    id: 'all' | 'submit';
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number | null;
}

export const SuggestionsPage: React.FC = () => {
    const {
        suggestions,
        loading,
        error,
        createSuggestion,
        updateSuggestion,
        deleteSuggestion,
        clearError
    } = useSuggestions();

    const [activeTab, setActiveTab] = useState<'all' | 'submit'>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);

    const handleSubmit = async (data: SuggestionCreate) => {
        try {
            if (editingSuggestion) {
                await updateSuggestion(editingSuggestion.id, data);
                setEditingSuggestion(null);
            } else {
                await createSuggestion(data);
            }
            setShowForm(false);
        } catch (err) {
            console.error('Failed to submit suggestion:', err);
        }
    };

    const handleEdit = (suggestion: Suggestion) => {
        setEditingSuggestion(suggestion);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSuggestion(id);
        } catch (err) {
            console.error('Failed to delete suggestion:', err);
        }
    };

    const tabs: Tab[] = [
        { id: 'all', name: 'All Suggestions', icon: ListBulletIcon, count: suggestions.length },
        { id: 'submit', name: 'Submit New', icon: PlusIcon, count: null },
    ];

    if (showForm) {
        return (
            <SuggestionForm
                onSubmit={handleSubmit}
                loading={loading}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stanbic-900">Innovation Suggestions</h1>
                    <p className="text-corporate-600 mt-2">Share your ideas to improve our services</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-stanbic-600 text-white rounded-lg hover:bg-stanbic-700 transition-colors duration-150 flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Submit Suggestion</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-corporate-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? 'border-stanbic-500 text-stanbic-600'
                                : 'border-transparent text-corporate-500 hover:text-corporate-700 hover:border-corporate-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <tab.icon className="h-5 w-5" />
                                <span>{tab.name}</span>
                                {tab.count !== null && (
                                    <span className="bg-corporate-100 text-corporate-800 py-0.5 px-2 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-500 hover:text-red-700"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Suggestions List */}
            <SuggestionList
                suggestions={suggestions}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}; 