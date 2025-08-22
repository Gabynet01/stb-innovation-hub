import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ArrowPathIcon,
    EyeIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { Job, JobFilters } from '@/types/api';

export const JobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);

    const [filters, setFilters] = useState<JobFilters>({
        status: '',
        job_type: '',
        page: 1,
        page_size: 20
    });

    // Fetch jobs and stats
    useEffect(() => {
        const fetchJobsData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch jobs and stats in parallel
                const [jobsResponse, statsResponse] = await Promise.all([
                    apiService.jobs.getJobs(filters),
                    apiService.jobs.getJobStats()
                ]);

                if (jobsResponse.ok && jobsResponse.data) {
                    setJobs(jobsResponse.data);
                }

                if (statsResponse.ok && statsResponse.data) {
                    setStats(statsResponse.data);
                }
            } catch (err) {
                console.error('Failed to fetch jobs data:', err);
                setError('Failed to fetch jobs data. Please try again.');
                setJobs([]);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchJobsData();
    }, [filters]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'running': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <ClockIcon className="h-4 w-4" />;
            case 'running': return <PlayIcon className="h-4 w-4" />;
            case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
            case 'failed': return <ExclamationTriangleIcon className="h-4 w-4" />;
            case 'cancelled': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const handleRetryJob = async (jobId: string) => {
        try {
            const response = await apiService.jobs.retryJob(jobId);
            if (response.ok) {
                // Refresh jobs list
                const jobsResponse = await apiService.jobs.getJobs(filters);
                if (jobsResponse.ok && jobsResponse.data) {
                    setJobs(jobsResponse.data);
                }
            }
        } catch (err) {
            console.error('Failed to retry job:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-900 mb-2">Background Jobs</h1>
                <p className="text-primary-600">Monitor and manage background processing jobs</p>
            </div>

            {/* Quick Stats */}
            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-primary-50 rounded-md">
                                <ClockIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-primary-600">Total Jobs</p>
                                <p className="text-xl font-semibold text-primary-900">{stats.total_jobs || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-md">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-primary-600">Completed</p>
                                <p className="text-xl font-semibold text-green-600">
                                    {stats.jobs_by_status?.completed || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-50 rounded-md">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-primary-600">Failed</p>
                                <p className="text-xl font-semibold text-red-600">
                                    {stats.jobs_by_status?.failed || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-50 rounded-md">
                                <ClockIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-primary-600">Avg Time</p>
                                <p className="text-xl font-semibold text-blue-600">
                                    {stats.average_processing_time ? `${Math.round(stats.average_processing_time)}s` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-800 text-sm">
                            Job statistics are not yet available. This feature is under development.
                        </span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
                <div className="flex items-center space-x-4">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={filters.job_type || ''}
                        onChange={(e) => setFilters({ ...filters, job_type: e.target.value || null })}
                        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="suggestion_processing">Suggestion Processing</option>
                        <option value="clustering">Clustering</option>
                        <option value="document_generation">Document Generation</option>
                    </select>
                </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-lg border border-primary-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-primary-900">Job Queue</h2>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <ClockIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary-900 mb-2">No jobs found</h3>
                        <p className="text-primary-600">
                            No background jobs match your current filters. Try adjusting your search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex items-center justify-between p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors duration-150">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-primary-100 rounded-md">
                                        <ClockIcon className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-primary-900">{job.job_type}</h3>
                                        <p className="text-xs text-primary-500">ID: {job.id}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="text-xs text-primary-500">Created: {formatDate(job.created_at)}</span>
                                            <span className="text-xs text-primary-500">Updated: {formatDate(job.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)} flex items-center space-x-1`}>
                                        {getStatusIcon(job.status)}
                                        <span className="capitalize">{job.status}</span>
                                    </span>

                                    {job.progress !== null && (
                                        <div className="text-xs text-primary-500">
                                            {job.progress}%
                                        </div>
                                    )}

                                    {job.status === 'failed' && (
                                        <button
                                            onClick={() => handleRetryJob(job.id)}
                                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-150"
                                            title="Retry Job"
                                        >
                                            <ArrowPathIcon className="h-4 w-4" />
                                        </button>
                                    )}

                                    <button className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-150">
                                        <EyeIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}; 