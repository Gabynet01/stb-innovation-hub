import React, { useCallback, useEffect, useState } from 'react';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarProps {
    id: string;
    type: SnackbarType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    }, [id, onClose]);

    useEffect(() => {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
    }, [duration, handleClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-emerald-50 border-emerald-200',
                    icon: 'text-emerald-500',
                    title: 'text-emerald-800',
                    message: 'text-emerald-700',
                    close: 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100'
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    icon: 'text-red-500',
                    title: 'text-red-800',
                    message: 'text-red-700',
                    close: 'text-red-400 hover:text-red-600 hover:bg-red-100'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50 border-amber-200',
                    icon: 'text-amber-500',
                    title: 'text-amber-800',
                    message: 'text-amber-700',
                    close: 'text-amber-400 hover:text-amber-600 hover:bg-amber-100'
                };
            case 'info':
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    icon: 'text-blue-500',
                    title: 'text-blue-800',
                    message: 'text-blue-700',
                    close: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
                };
            default:
                return {
                    bg: 'bg-slate-50 border-slate-200',
                    icon: 'text-slate-500',
                    title: 'text-slate-800',
                    message: 'text-slate-700',
                    close: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'error':
                return <ExclamationTriangleIcon className="w-5 h-5" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5" />;
            case 'info':
                return <InformationCircleIcon className="w-5 h-5" />;
            default:
                return <InformationCircleIcon className="w-5 h-5" />;
        }
    };

    const styles = getTypeStyles();

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${isVisible && !isExiting
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }`}
        >
            <div className={`${styles.bg} border rounded-lg shadow-lg p-4`}>
                <div className="flex items-start space-x-3">
                    <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                        {getIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className={`${styles.title} font-semibold text-sm`}>
                            {title}
                        </h4>
                        {message && (
                            <p className={`${styles.message} text-sm mt-1`}>
                                {message}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleClose}
                        className={`${styles.close} p-1 rounded-full transition-colors duration-200 flex-shrink-0`}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Snackbar; 