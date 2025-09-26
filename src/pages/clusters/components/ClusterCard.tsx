import React from 'react';
import { Cluster } from '@/types/api';
import { EyeIcon, PencilIcon, TrashIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ClusterCardProps {
    cluster: Cluster;
    onEdit: (cluster: Cluster) => void;
    onDelete: (clusterId: string) => void;
    onView: (cluster: Cluster) => void;
}

const ClusterCard: React.FC<ClusterCardProps> = ({
    cluster,
    onEdit,
    onDelete,
    onView
}) => {
    const getClusterKindColor = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING':
                return 'from-blue-500 to-blue-600';
            case 'TAG':
                return 'from-green-500 to-green-600';
            case 'TOPIC':
                return 'from-purple-500 to-purple-600';
            case 'FUSION':
                return 'from-orange-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getClusterKindIcon = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'TAG':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                );
            case 'TOPIC':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'FUSION':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'IN_REVIEW':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'IN_PROGRESS':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'CLOSED':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'ARCHIVED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div
            className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer min-h-[320px] flex flex-col"
            onClick={() => onView(cluster)}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20">
                <div className="flex items-center space-x-3">
                    {/* Cluster Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                        <div className={`p-2 bg-gradient-to-r ${getClusterKindColor(cluster.kind)} rounded-lg text-white`}>
                            {getClusterKindIcon(cluster.kind)}
                        </div>
                    </div>

                    {/* Cluster Info */}
                    <div>
                        <span className="text-sm font-semibold text-gray-900">
                            {cluster.kind.charAt(0).toUpperCase() + cluster.kind.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs text-gray-600 ml-2 font-medium">
                            {new Date(cluster.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${getStatusColor(cluster.status)} shadow-sm`}>
                        {cluster.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-white/30 to-white/10">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                    {cluster.title || `Cluster ${cluster.id.slice(0, 8)}`}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1 font-medium">
                    {cluster.description && cluster.description.length > 120
                        ? `${cluster.description.substring(0, 120)}...`
                        : cluster.description || 'No description available'
                    }
                </p>

                {/* Tags */}
                {cluster.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {cluster.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                                #{tag}
                            </span>
                        ))}
                        {cluster.tags.length > 3 && (
                            <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-500 rounded-full font-medium">
                                +{cluster.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <UsersIcon className="w-3 h-3" />
                            <span>Weight: {cluster.weight.toFixed(2)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Created: {new Date(cluster.created_at).toLocaleDateString()}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(cluster);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <EyeIcon className="w-4 h-4" />
                            <span>View</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(cluster);
                            }}
                            className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(cluster.id);
                        }}
                        className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClusterCard;
