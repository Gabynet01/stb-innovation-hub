import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import {
    DocumentTextIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowDownTrayIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { Document, Template, DocumentCreate } from '@/types/api';

interface DocumentFilters {
    template_id: string;
    status: string;
}

export const DocumentsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-900 mb-2">Document Generation</h1>
                <p className="text-primary-600">Generate AI-powered reports and documents from your innovation data</p>
            </div>

            {/* Coming Soon Message */}
            <div className="text-center py-16">
                <DocumentTextIcon className="h-24 w-24 text-primary-400 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-primary-900 mb-4">Coming Soon</h2>
                <p className="text-lg text-primary-600 mb-6 max-w-2xl mx-auto">
                    The document generation feature is currently under development. This will allow you to create
                    comprehensive reports including innovation summaries, cluster analysis, trend reports, and
                    executive dashboards using AI-powered insights.
                </p>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-medium text-primary-900 mb-3">Planned Features</h3>
                    <ul className="text-left text-primary-700 space-y-2">
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full mr-3"></span>
                            AI-generated innovation summary reports
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full mr-3"></span>
                            Cluster analysis and pattern recognition reports
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full mr-3"></span>
                            Trend analysis and forecasting documents
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full mr-3"></span>
                            Executive dashboard reports with key metrics
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full mr-3"></span>
                            Multiple output formats (PDF, DOCX, HTML)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}; 