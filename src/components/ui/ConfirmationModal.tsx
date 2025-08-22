import React from 'react';
import {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    QuestionMarkCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'question';

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: ConfirmationType;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'question',
    confirmText,
    cancelText,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    iconBg: 'bg-red-100',
                    confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    title: 'text-red-900',
                    message: 'text-red-700'
                };
            case 'warning':
                return {
                    icon: 'text-amber-500',
                    iconBg: 'bg-amber-100',
                    confirmButton: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
                    title: 'text-amber-900',
                    message: 'text-amber-700'
                };
            case 'info':
                return {
                    icon: 'text-blue-500',
                    iconBg: 'bg-blue-100',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    title: 'text-blue-900',
                    message: 'text-blue-700'
                };
            case 'question':
            default:
                return {
                    icon: 'text-slate-500',
                    iconBg: 'bg-slate-100',
                    confirmButton: 'bg-[#0051FF] hover:bg-[#0047E6] focus:ring-[#0051FF]',
                    title: 'text-slate-900',
                    message: 'text-slate-700'
                };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <ExclamationTriangleIcon className="h-8 w-8" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-8 w-8" />;
            case 'info':
                return <InformationCircleIcon className="h-8 w-8" />;
            case 'question':
            default:
                return <QuestionMarkCircleIcon className="h-8 w-8" />;
        }
    };

    const getDefaultText = () => {
        switch (type) {
            case 'danger':
                return {
                    confirm: 'Delete',
                    cancel: 'Cancel'
                };
            case 'warning':
                return {
                    confirm: 'Proceed',
                    cancel: 'Cancel'
                };
            case 'info':
                return {
                    confirm: 'OK',
                    cancel: 'Cancel'
                };
            case 'question':
            default:
                return {
                    confirm: 'Confirm',
                    cancel: 'Cancel'
                };
        }
    };

    const styles = getTypeStyles();
    const defaultText = getDefaultText();

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                    onClick={handleClose}
                />

                {/* Modal */}
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-xl ${styles.iconBg}`}>
                                    <div className={styles.icon}>
                                        {getIcon()}
                                    </div>
                                </div>
                                <h3 className={`text-lg font-semibold ${styles.title}`}>
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        <p className={`text-sm ${styles.message}`}>
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="w-full sm:w-32 h-10 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {cancelText || defaultText.cancel}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`w-full sm:w-32 h-10 px-4 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${styles.confirmButton}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                confirmText || defaultText.confirm
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 