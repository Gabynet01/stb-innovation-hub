import React from 'react';
import { Button } from '@/components/ui';
import { LightBulbIcon, PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
    hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
    return (
        <div className="text-center py-20">
            <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <LightBulbIcon className="h-12 w-12 text-slate-400" />
                </div>

                {/* Content */}
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    {hasFilters ? 'No suggestions found' : 'No suggestions yet'}
                </h3>

                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {hasFilters
                        ? 'Try adjusting your filters to see more results. Sometimes the best ideas are hidden behind different criteria.'
                        : 'Be the first to share an innovative idea! Your suggestion could be the next big breakthrough for our organization.'}
                </p>

                {/* Action Button */}
                <div className="space-y-4">
                    {!hasFilters && (
                        <Button
                            variant="primary"
                            size="xl"
                            className="px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
                        >
                            <PlusIcon className="h-6 w-6 mr-3" />
                            Submit First Suggestion
                        </Button>
                    )}

                    {hasFilters && (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500">
                                💡 Try these filter combinations:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                                    All Statuses
                                </span>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                    All Categories
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                                    All Types
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full bg-slate-300 animate-pulse`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}; 