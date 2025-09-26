import React from 'react';
import { Cluster } from '@/types/api';
import { Button } from '@/components/ui';
import {
    XMarkIcon,
    SparklesIcon,
    TagIcon,
    ChartBarIcon,
    BoltIcon,
    CalendarIcon,
    UsersIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

interface ClusterDetailModalProps {
    cluster: Cluster | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (cluster: Cluster) => void;
}

export const ClusterDetailModal: React.FC<ClusterDetailModalProps> = ({
    cluster,
    isOpen,
    onClose,
    onEdit
}) => {
    if (!isOpen || !cluster) return null;

    const getClusterKindIcon = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING': return <SparklesIcon className="h-6 w-6" />;
            case 'TAG': return <TagIcon className="h-6 w-6" />;
            case 'TOPIC': return <ChartBarIcon className="h-6 w-6" />;
            case 'FUSION': return <BoltIcon className="h-6 w-6" />;
            default: return <SparklesIcon className="h-6 w-6" />;
        }
    };

    const getClusterKindColor = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING': return 'from-blue-500 to-indigo-600';
            case 'TAG': return 'from-emerald-500 to-green-600';
            case 'TOPIC': return 'from-purple-500 to-pink-600';
            case 'FUSION': return 'from-orange-500 to-red-600';
            default: return 'from-slate-500 to-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'IN_PROGRESS': return 'bg-green-100 text-green-800 border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'ARCHIVED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-blue-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    {getClusterKindIcon(cluster.kind)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {cluster.title || `Cluster ${cluster.id.slice(0, 8)}`}
                                    </h2>
                                    <p className="text-blue-100 capitalize">{cluster.kind.toLowerCase()} cluster</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(cluster.status)}`}>
                                    {cluster.status.replace('_', ' ')}
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-600">
                                {cluster.description || 'No description available for this cluster.'}
                            </p>
                        </div>

                        {/* Tags */}
                        {cluster.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {cluster.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <UsersIcon className="h-5 w-5 text-slate-500" />
                                    <h4 className="font-medium text-slate-900">Weight</h4>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{cluster.weight.toFixed(2)}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CalendarIcon className="h-5 w-5 text-slate-500" />
                                    <h4 className="font-medium text-slate-900">Created</h4>
                                </div>
                                <p className="text-sm text-slate-600">
                                    {new Date(cluster.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Primary Topic */}
                        {cluster.primary_topic_id && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Primary Topic</h3>
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <p className="text-purple-800 font-medium">
                                        Topic ID: {cluster.primary_topic_id}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Fusion Parameters */}
                        {cluster.fusion_params && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Fusion Parameters</h3>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <pre className="text-sm text-slate-600 whitespace-pre-wrap">
                                        {JSON.stringify(cluster.fusion_params, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Metadata</h3>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Cluster ID:</span>
                                    <span className="font-mono text-sm text-slate-900">{cluster.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Last Updated:</span>
                                    <span className="text-slate-900">
                                        {new Date(cluster.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Cluster created on {new Date(cluster.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => onEdit(cluster)}
                                className="flex items-center space-x-2"
                            >
                                <PencilIcon className="h-4 w-4" />
                                <span>Edit Cluster</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
