import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LightBulbIcon, SparklesIcon, DocumentTextIcon, RocketLaunchIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface QuickActionsProps {
    onViewClusters?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onViewClusters }) => {
    const navigate = useNavigate();

    const handleSuggestions = () => navigate('/suggestions');
    const handleClusters = () => (onViewClusters ? onViewClusters() : navigate('/clusters'));
    const handleTopics = () => navigate('/topics');
    const handleDocuments = () => navigate('/documents');
    const handleTemplates = () => navigate('/templates');
    const handleJobs = () => navigate('/jobs');

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm">
                        <RocketLaunchIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                        <span className="text-gray-600 text-sm font-medium">Get started with innovation</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={handleSuggestions}
                        className="group flex items-center justify-center p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-500 transform hover:scale-105"
                    >
                        <LightBulbIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Suggestions</div>
                            <div className="text-blue-100 text-sm">Share & view ideas</div>
                        </div>
                    </button>

                    <button
                        onClick={handleClusters}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="AI Clusters"
                    >
                        <SparklesIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">AI Clusters</div>
                            <div className="text-gray-600 text-sm">Discover patterns</div>
                        </div>
                    </button>

                    <button
                        onClick={handleTopics}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="Topics"
                    >
                        <ChartBarIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Topics</div>
                            <div className="text-gray-600 text-sm">Innovation topics</div>
                        </div>
                    </button>

                    <button
                        onClick={handleDocuments}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-green-300 hover:text-green-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="Documents"
                    >
                        <DocumentTextIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Documents</div>
                            <div className="text-gray-600 text-sm">Generated reports</div>
                        </div>
                    </button>

                    <button
                        onClick={handleTemplates}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="Templates"
                    >
                        <UsersIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Templates</div>
                            <div className="text-gray-600 text-sm">Document templates</div>
                        </div>
                    </button>

                    <button
                        onClick={handleJobs}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-pink-300 hover:text-pink-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="Jobs"
                    >
                        <RocketLaunchIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Jobs</div>
                            <div className="text-gray-600 text-sm">Background jobs</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
