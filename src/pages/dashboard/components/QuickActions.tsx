import React from 'react';
import { LightBulbIcon, SparklesIcon, DocumentTextIcon, RocketLaunchIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface QuickActionsProps {
    onViewClusters?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onViewClusters }) => {
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
                    {/* Submit New Idea */}
                    <button className="group flex items-center justify-center p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-500 transform hover:scale-105">
                        <LightBulbIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Submit Idea</div>
                            <div className="text-blue-100 text-sm">Share your innovation</div>
                        </div>
                    </button>

                    {/* Explore AI Insights */}
                    <button
                        onClick={onViewClusters}
                        className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                        title="View AI clusters and insights"
                    >
                        <SparklesIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">AI Insights</div>
                            <div className="text-gray-600 text-sm">Discover patterns</div>
                        </div>
                    </button>

                    {/* Innovation Pipeline */}
                    <button className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg">
                        <ChartBarIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Pipeline View</div>
                            <div className="text-gray-600 text-sm">Track progress</div>
                        </div>
                    </button>

                    {/* Generate Report */}
                    <button className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-green-300 hover:text-green-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg">
                        <DocumentTextIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Generate Report</div>
                            <div className="text-gray-600 text-sm">AI-powered insights</div>
                        </div>
                    </button>

                    {/* Team Collaboration */}
                    <button className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg">
                        <UsersIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Team Hub</div>
                            <div className="text-gray-600 text-sm">Collaborate & share</div>
                        </div>
                    </button>

                    {/* Innovation Challenges */}
                    <button className="group flex items-center justify-center p-6 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 hover:border-pink-300 hover:text-pink-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg">
                        <RocketLaunchIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="text-left">
                            <div className="font-bold text-lg">Challenges</div>
                            <div className="text-gray-600 text-sm">Solve problems</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}; 