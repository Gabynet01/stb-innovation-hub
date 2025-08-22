import React, { useState } from 'react';
import { Button } from '@/components/ui';
import {
    XMarkIcon,
    PaperClipIcon,
    EyeIcon,
    DocumentIcon,
    PhotoIcon,
    FilmIcon
} from '@heroicons/react/24/outline';

interface Attachment {
    name?: string;
    type?: string;
    mimeType?: string;
    url?: string;
    data?: string;
    content?: string;
}

interface AttachmentViewerProps {
    attachments: Attachment[];
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments }) => {
    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);

    const handleAttachmentClick = (attachment: Attachment) => {
        setSelectedAttachment(attachment);
        setShowAttachmentModal(true);
    };

    const closeAttachmentModal = () => {
        setShowAttachmentModal(false);
        setSelectedAttachment(null);
    };

    const getAttachmentIcon = (attachment: Attachment) => {
        const type = attachment.type || attachment.mimeType || '';
        if (type.startsWith('image/')) return PhotoIcon;
        if (type.startsWith('video/')) return FilmIcon;
        if (type.startsWith('text/') || type.includes('pdf') || type.includes('document')) return DocumentIcon;
        return PaperClipIcon;
    };

    const getAttachmentIconColor = (attachment: Attachment) => {
        const type = attachment.type || attachment.mimeType || '';
        if (type.startsWith('image/')) return 'text-green-600';
        if (type.startsWith('video/')) return 'text-purple-600';
        if (type.startsWith('text/') || type.includes('pdf') || type.includes('document')) return 'text-blue-600';
        return 'text-slate-600';
    };

    const renderAttachmentContent = (attachment: Attachment) => {
        const type = attachment.type || attachment.mimeType || '';

        if (type.startsWith('image/')) {
            return (
                <div className="flex items-center justify-center">
                    <img
                        src={attachment.url || attachment.data}
                        alt={attachment.name || 'Attachment'}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                        onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAxMDBMMTAwIDUwTDE1MCAxMDBMMTAwIDE1MFYxMDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                    />
                </div>
            );
        }

        if (type.startsWith('video/')) {
            return (
                <div className="flex items-center justify-center">
                    <video
                        controls
                        className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                        src={attachment.url || attachment.data}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        if (type.includes('pdf')) {
            return (
                <div className="flex items-center justify-center h-[70vh]">
                    <iframe
                        src={attachment.url || attachment.data}
                        className="w-full h-full rounded-lg shadow-lg"
                        title={attachment.name || 'PDF Document'}
                    />
                </div>
            );
        }

        // Default text/document view
        return (
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center space-x-3 mb-4">
                    <DocumentIcon className="h-8 w-8 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{attachment.name || 'Document'}</h3>
                        <p className="text-sm text-slate-500 truncate">{type || 'Unknown type'}</p>
                    </div>
                </div>
                {attachment.content ? (
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border">
                        {attachment.content}
                    </pre>
                ) : (
                    <div className="text-center py-12">
                        <DocumentIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-500">Preview not available for this file type</p>
                        <p className="text-sm text-slate-400 mt-2 truncate">
                            {attachment.name || 'Attachment'} • {type || 'Unknown type'}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((attachment, index) => {
                    const AttachmentIcon = getAttachmentIcon(attachment);
                    const iconColor = getAttachmentIconColor(attachment);

                    return (
                        <div
                            key={index}
                            className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#0051FF]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => handleAttachmentClick(attachment)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-[#0051FF]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0051FF]/20 transition-colors duration-200`}>
                                    <AttachmentIcon className={`h-5 w-5 ${iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#0051FF] transition-colors duration-200">
                                        {attachment.name || `Attachment ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {attachment.type || attachment.mimeType || 'Unknown type'}
                                    </p>
                                </div>
                                <EyeIcon className="h-4 w-4 text-slate-400 group-hover:text-[#0051FF] transition-colors duration-200" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Attachment View Modal */}
            {showAttachmentModal && selectedAttachment && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div className="flex items-center space-x-3">
                                {(() => {
                                    const AttachmentIcon = getAttachmentIcon(selectedAttachment);
                                    const iconColor = getAttachmentIconColor(selectedAttachment);
                                    return (
                                        <div className={`w-10 h-10 bg-[#0051FF]/10 rounded-lg flex items-center justify-center`}>
                                            <AttachmentIcon className={`h-6 w-6 ${iconColor}`} />
                                        </div>
                                    );
                                })()}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {selectedAttachment.name || 'Attachment'}
                                    </h3>
                                    <p className="text-sm text-slate-500 truncate">
                                        {selectedAttachment.type || selectedAttachment.mimeType || 'Unknown type'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeAttachmentModal}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {renderAttachmentContent(selectedAttachment)}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="flex items-center justify-end space-x-3">
                                <Button
                                    onClick={closeAttachmentModal}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Close
                                </Button>
                                {selectedAttachment.url && (
                                    <Button
                                        onClick={() => window.open(selectedAttachment.url, '_blank')}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Open in New Tab
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 