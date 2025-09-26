import React from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ProcessingStatusProps {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    jobId?: string;
    className?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
    status,
    jobId,
    className = ''
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: ClockIcon,
                    text: 'Pending',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                };
            case 'PROCESSING':
                return {
                    icon: ClockIcon,
                    text: 'Processing',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                };
            case 'COMPLETED':
                return {
                    icon: CheckCircleIcon,
                    text: 'Completed',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                };
            case 'FAILED':
                return {
                    icon: XCircleIcon,
                    text: 'Failed',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                };
            default:
                return {
                    icon: ExclamationTriangleIcon,
                    text: 'Unknown',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}>
            <Icon className="w-3 h-3 mr-1" />
            <span>{config.text}</span>
            {jobId && (
                <span className="ml-1 text-xs opacity-75">
                    ({jobId.slice(0, 8)}...)
                </span>
            )}
        </div>
    );
};
