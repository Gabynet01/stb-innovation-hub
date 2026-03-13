import React from 'react';
import { SparklesIcon, EyeIcon } from '@heroicons/react/24/outline';

interface AIInsightsProps {
    onViewClusters?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ onViewClusters }) => {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                            <SparklesIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">AI Insights</h2>
                            <p className="text-gray-600 text-lg font-medium">Smart patterns & trends discovered</p>
                        </div>
                    </div>
                    <button
                        onClick={onViewClusters}
                        className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200 group"
                        title="View all AI clusters"
                    >
                        <EyeIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                </div>
            </div>

            <div className="p-8">
                <p className="text-gray-600 mb-6">
                    Explore AI-generated clusters and topics from submitted ideas. View patterns and insights discovered by the system.
                </p>
                <button
                    onClick={onViewClusters}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    View AI Clusters
                </button>
            </div>
        </div>
    );
};
