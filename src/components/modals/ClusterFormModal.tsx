import React, { useState, useEffect } from 'react';
import { Cluster } from '@/types/api';
import { Button, Input, Textarea } from '@/components/ui';
import {
    XMarkIcon,
    SparklesIcon,
    TagIcon,
    ChartBarIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

interface ClusterFormModalProps {
    cluster: Cluster | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (clusterData: Partial<Cluster>) => void;
    isEditing: boolean;
}

export const ClusterFormModal: React.FC<ClusterFormModalProps> = ({
    cluster,
    isOpen,
    onClose,
    onSave,
    isEditing
}) => {
    const [formData, setFormData] = useState({
        kind: 'EMBEDDING' as 'EMBEDDING' | 'TAG' | 'TOPIC' | 'FUSION',
        title: '',
        description: '',
        tags: [] as string[],
        weight: 0,
        status: 'NEW' as 'NEW' | 'IN_REVIEW' | 'IN_PROGRESS' | 'CLOSED' | 'ARCHIVED',
        primary_topic_id: '',
        fusion_params: null as any
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (cluster && isEditing) {
            setFormData({
                kind: cluster.kind,
                title: cluster.title || '',
                description: cluster.description || '',
                tags: cluster.tags || [],
                weight: cluster.weight || 0,
                status: cluster.status,
                primary_topic_id: cluster.primary_topic_id || '',
                fusion_params: cluster.fusion_params
            });
        } else {
            setFormData({
                kind: 'EMBEDDING',
                title: '',
                description: '',
                tags: [],
                weight: 0,
                status: 'NEW',
                primary_topic_id: '',
                fusion_params: null
            });
        }
    }, [cluster, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const getClusterKindIcon = (kind: string) => {
        switch (kind) {
            case 'EMBEDDING': return <SparklesIcon className="h-5 w-5" />;
            case 'TAG': return <TagIcon className="h-5 w-5" />;
            case 'TOPIC': return <ChartBarIcon className="h-5 w-5" />;
            case 'FUSION': return <BoltIcon className="h-5 w-5" />;
            default: return <SparklesIcon className="h-5 w-5" />;
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

    if (!isOpen) return null;

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
                                    {getClusterKindIcon(formData.kind)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {isEditing ? 'Edit Cluster' : 'Create New Cluster'}
                                    </h2>
                                    <p className="text-blue-100">
                                        {isEditing ? 'Update cluster information' : 'Add a new AI cluster'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-blue-100 transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Kind Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Cluster Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['EMBEDDING', 'TAG', 'TOPIC', 'FUSION'].map((kind) => (
                                    <button
                                        key={kind}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, kind: kind as any }))}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${formData.kind === kind
                                            ? `border-blue-500 bg-blue-50 ${getClusterKindColor(kind)} text-white`
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {getClusterKindIcon(kind)}
                                            <span className="font-medium capitalize">{kind.toLowerCase()}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Cluster Title
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter cluster title..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter cluster description..."
                                rows={3}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tags
                            </label>
                            <div className="flex space-x-2 mb-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add a tag..."
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} variant="outline">
                                    Add
                                </Button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 text-slate-400 hover:text-slate-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Weight
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.0"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="NEW">New</option>
                                <option value="IN_REVIEW">In Review</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="CLOSED">Closed</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        {/* Primary Topic ID */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Primary Topic ID (Optional)
                            </label>
                            <Input
                                value={formData.primary_topic_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, primary_topic_id: e.target.value }))}
                                placeholder="Enter topic ID..."
                            />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            {isEditing ? 'Update cluster information' : 'Create a new cluster for AI analysis'}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                className="flex items-center space-x-2"
                            >
                                <span>{isEditing ? 'Update Cluster' : 'Create Cluster'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
