import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { APP_CONFIG } from '@/constants';

interface DashboardHeroProps {
    systemStatus?: string;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ systemStatus = 'operational' }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'operational':
                return 'bg-green-500';
            case 'degraded':
                return 'bg-yellow-500';
            case 'down':
                return 'bg-red-500';
            default:
                return 'bg-blue-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'operational':
                return 'All Systems Operational';
            case 'degraded':
                return 'Performance Degraded';
            case 'down':
                return 'System Maintenance';
            default:
                return 'System Status';
        }
    };

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>
            <div className="relative text-center py-16 px-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <LightBulbIcon className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
                    {APP_CONFIG.name}
                </h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
                    Welcome to {APP_CONFIG.name}. Share ideas, explore AI-powered insights, and help shape the future at Stanbic Bank.
                </p>

                {/* System Status Indicator */}
                <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus)} animate-pulse`}></div>
                        <span className="text-sm font-medium text-gray-700">{getStatusText(systemStatus)}</span>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>AI Processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Real-time Updates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span>Smart Clustering</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 