import React, { useState, useEffect } from 'react';
import { apiService } from '@/services';
import { CompactErrorWithToast, useSnackbar } from '@/components/ui';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ArrowPathIcon,
    EyeIcon,
    PlayIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Job, JobFilters } from '@/types/api';

export const JobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [retryingJobs, setRetryingJobs] = useState<Set<string>>(new Set());
    const { showSnackbar } = useSnackbar();

    const [filters, setFilters] = useState<JobFilters>({
        status: '',
        job_type: '',
        page: 1,
        page_size: 20
    });

    // Fetch jobs
    useEffect(() => {
        const fetchJobsData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('Fetching jobs with filters:', filters);

                // Since backend only returns jobs when status filter is provided,
                // we need to fetch jobs by each status and combine them
                const allStatuses = ['QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED'];
                let allJobs: Job[] = [];
                let jobStats: any = {};

                if (filters.status) {
                    // If status filter is provided, use it
                    const jobsResponse = await apiService.jobs.getJobs(filters);
                    console.log('Jobs API response:', jobsResponse);

                    if (jobsResponse.ok && jobsResponse.data) {
                        allJobs = jobsResponse.data;
                        console.log('Jobs data received:', allJobs);
                    }
                } else {
                    // If no status filter, fetch all statuses
                    const jobPromises = allStatuses.map(status =>
                        apiService.jobs.getJobs({ ...filters, status })
                    );

                    const jobResponses = await Promise.all(jobPromises);
                    console.log('All job responses:', jobResponses);

                    // Combine all jobs
                    allJobs = jobResponses
                        .filter(response => response.ok && response.data)
                        .flatMap(response => response.data || []);

                    console.log('Combined jobs data:', allJobs);
                }

                setJobs(allJobs);

                // Calculate stats from all jobs
                jobStats = allJobs.reduce((acc: any, job: Job) => {
                    acc[job.status] = (acc[job.status] || 0) + 1;
                    return acc;
                }, {});
                setStats(jobStats);
                console.log('Calculated job stats:', jobStats);

                // If no jobs found, show a helpful message
                if (allJobs.length === 0) {
                    console.log('No jobs found. This could mean:');
                    console.log('1. No jobs have been created yet');
                    console.log('2. Backend is not running');
                    console.log('3. Jobs API endpoint is not working');
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
            case 'QUEUED': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'RUNNING': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'SUCCEEDED': return 'bg-green-100 text-green-800 border-green-300';
            case 'FAILED': return 'bg-red-100 text-red-800 border-red-300';
            case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'QUEUED': return <ClockIcon className="h-4 w-4" />;
            case 'RUNNING': return <PlayIcon className="h-4 w-4" />;
            case 'SUCCEEDED': return <CheckCircleIcon className="h-4 w-4" />;
            case 'FAILED': return <ExclamationTriangleIcon className="h-4 w-4" />;
            case 'CANCELLED': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    const getJobTypeDisplayName = (type: string) => {
        switch (type) {
            case 'PROCESS_SUGGESTION': return 'Process Suggestion';
            case 'GENERATE_TOPIC_EMBEDDING': return 'Generate Topic Embedding';
            case 'CLUSTERING': return 'Clustering';
            case 'DOCUMENT_GENERATION': return 'Document Generation';
            default: return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    const getJobTypeColor = (type: string) => {
        switch (type) {
            case 'PROCESS_SUGGESTION': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'GENERATE_TOPIC_EMBEDDING': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
            case 'CLUSTERING': return 'bg-pink-100 text-pink-800 border-pink-300';
            case 'DOCUMENT_GENERATION': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            job.type.toLowerCase().includes(searchLower) ||
            job.id.toLowerCase().includes(searchLower) ||
            job.status.toLowerCase().includes(searchLower)
        );
    });

    const handleRetryJob = async (jobId: string) => {
        try {
            // Clear any previous retry errors
            // Add job to retrying set
            setRetryingJobs(prev => new Set(prev).add(jobId));

            const response = await apiService.jobs.retryJob(jobId);
            if (response.ok) {
                // Refresh jobs list
                const jobsResponse = await apiService.jobs.getJobs(filters);
                if (jobsResponse.ok && jobsResponse.data) {
                    setJobs(jobsResponse.data);
                }
            } else {
                console.error('Failed to retry job:', response);
                showSnackbar({ type: 'error', title: 'Retry failed', message: response.meta?.message || 'Unknown error' });
            }
        } catch (err) {
            console.error('Failed to retry job:', err);
            showSnackbar({ type: 'error', title: 'Retry failed', message: err instanceof Error ? err.message : 'Unknown error' });
        } finally {
            // Remove job from retrying set
            setRetryingJobs(prev => {
                const newSet = new Set(prev);
                newSet.delete(jobId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Jobs</h2>
                    <p className="text-gray-600">Fetching background job information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <CompactErrorWithToast
                error={error}
                title="Unable to load jobs"
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="relative overflow-hidden">
                {/* Elegant Background with Stanbic Bank Blue */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0051FF] via-[#0047E6] to-[#0038CC]"></div>

                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-8 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Background Jobs</h1>
                            <p className="text-white/70 mt-1">
                                Monitor and manage system background processing tasks
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs"
                        >
                            <ArrowPathIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Border with Enhanced Effect */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <ClockIcon className="h-6 w-6 text-white" />
                                </div>
                                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Jobs</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {Object.values(stats || {}).reduce((sum: number, count: any) => sum + (count || 0), 0)}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600 text-sm font-semibold">All Time</span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {stats?.SUCCEEDED || 0}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="text-emerald-600 text-sm font-semibold">
                                    {Object.values(stats || {}).reduce((sum: number, count: any) => sum + (count || 0), 0) > 0
                                        ? `${Math.round(((stats?.SUCCEEDED || 0) / Object.values(stats || {}).reduce((sum: number, count: any) => sum + (count || 0), 0)) * 100)}% Success Rate`
                                        : 'Ready to Process'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Failed</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {stats?.FAILED || 0}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="text-red-600 text-sm font-semibold">
                                    {stats?.FAILED ? 'Needs Attention' : 'All Systems Go'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                                    <PlayIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In Progress</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {(stats?.QUEUED || 0) + (stats?.RUNNING || 0)}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="text-amber-600 text-sm font-semibold">
                                    {stats?.RUNNING ? `${stats.RUNNING} running` : 'Queued for Processing'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12),0_12px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_25px_50px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 transition-all duration-500 overflow-hidden mb-8">
                    <div className="relative p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search jobs by type, ID, or status..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-6 py-3 bg-white/10 text-gray-700 border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-xl transition-all duration-300 font-semibold"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                Filters
                                {showFilters ? (
                                    <ChevronUpIcon className="h-4 w-4 ml-2" />
                                ) : (
                                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                                )}
                            </button>
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">All Status</option>
                                            <option value="QUEUED">Queued</option>
                                            <option value="RUNNING">Running</option>
                                            <option value="SUCCEEDED">Succeeded</option>
                                            <option value="FAILED">Failed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                        <select
                                            value={filters.job_type || ''}
                                            onChange={(e) => setFilters({ ...filters, job_type: e.target.value || null })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">All Types</option>
                                            <option value="PROCESS_SUGGESTION">Process Suggestion</option>
                                            <option value="GENERATE_TOPIC_EMBEDDING">Generate Topic Embedding</option>
                                            <option value="CLUSTERING">Clustering</option>
                                            <option value="DOCUMENT_GENERATION">Document Generation</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Job Queue</h2>
                            <div className="text-sm text-gray-500">
                                {filteredJobs.length} of {jobs.length} jobs
                            </div>
                        </div>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || filters.status || filters.job_type
                                    ? "No jobs match your current search or filter criteria."
                                    : "No background jobs are currently available. This could mean:"}
                            </p>
                            {!(searchTerm || filters.status || filters.job_type) && (
                                <div className="text-left max-w-md mx-auto mb-4">
                                    <ul className="text-sm text-gray-500 space-y-1">
                                        <li>• No jobs have been created yet</li>
                                        <li>• Backend server is not running</li>
                                        <li>• Jobs API endpoint is not working</li>
                                        <li>• Check browser console for API errors</li>
                                    </ul>
                                </div>
                            )}
                            {(searchTerm || filters.status || filters.job_type) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilters({ status: '', job_type: '', page: 1, page_size: 20 });
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getJobTypeColor(job.type)}`}>
                                                    {getJobTypeDisplayName(job.type)}
                                                </span>
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(job.status)} flex items-center space-x-1`}>
                                                    {getStatusIcon(job.status)}
                                                    <span>{job.status}</span>
                                                </span>
                                                {job.attempts > 1 && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                                        {job.attempts} attempts
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">Job ID:</span>
                                                <span className="ml-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate block max-w-xs">
                                                    {job.id}
                                                </span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-gray-500">
                                                <span className="truncate">
                                                    <span className="font-medium">Created:</span>
                                                    <span className="ml-1">{formatDate(job.created_at)}</span>
                                                </span>
                                                <span className="truncate">
                                                    <span className="font-medium">Updated:</span>
                                                    <span className="ml-1">{formatDate(job.updated_at)}</span>
                                                </span>
                                            </div>

                                            {job.last_error && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-start">
                                                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                                        <div className="text-sm text-red-800 min-w-0 flex-1">
                                                            <span className="font-medium">Error:</span>
                                                            <span className="ml-1 break-words">{job.last_error}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                            {job.status === 'FAILED' && (
                                                <button
                                                    onClick={() => handleRetryJob(job.id)}
                                                    disabled={retryingJobs.has(job.id)}
                                                    className={`p-2 rounded-lg transition-colors duration-200 ${retryingJobs.has(job.id)
                                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                        }`}
                                                    title={retryingJobs.has(job.id) ? "Retrying..." : "Retry Job"}
                                                >
                                                    <ArrowPathIcon className={`h-4 w-4 ${retryingJobs.has(job.id) ? 'animate-spin' : ''}`} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setSelectedJob(job)}
                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getJobTypeColor(selectedJob.type)}`}>
                                            {getJobTypeDisplayName(selectedJob.type)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedJob.status)} flex items-center space-x-1 w-fit`}>
                                            {getStatusIcon(selectedJob.status)}
                                            <span>{selectedJob.status}</span>
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job ID</label>
                                    <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedJob.id}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedJob.created_at)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Updated</label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedJob.updated_at)}</p>
                                    </div>
                                </div>

                                {selectedJob.attempts > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Attempts</label>
                                        <p className="text-sm text-gray-900">{selectedJob.attempts}</p>
                                    </div>
                                )}

                                {selectedJob.payload && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payload</label>
                                        <pre className="text-sm text-gray-900 bg-gray-100 p-3 rounded overflow-x-auto">
                                            {JSON.stringify(selectedJob.payload, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                {selectedJob.last_error && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Error Details</label>
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-800">{selectedJob.last_error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            {selectedJob.status === 'FAILED' && (
                                <button
                                    onClick={() => {
                                        handleRetryJob(selectedJob.id);
                                        setSelectedJob(null);
                                    }}
                                    disabled={retryingJobs.has(selectedJob.id)}
                                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${retryingJobs.has(selectedJob.id)
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                >
                                    <ArrowPathIcon className={`h-4 w-4 ${retryingJobs.has(selectedJob.id) ? 'animate-spin' : ''}`} />
                                    <span>{retryingJobs.has(selectedJob.id) ? 'Retrying...' : 'Retry Job'}</span>
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 