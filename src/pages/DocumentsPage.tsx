import React, { useState, useMemo } from 'react';
import { useDocuments } from '@/hooks';
import { Document } from '@/types/api';
import { LoadingSpinner, ErrorState, Message } from '@/components/ui';
import { useConfirmation } from '@/hooks';
import { DocumentGenerationModal, DocumentDetailModal } from '@/components/modals';
import { DocumentList } from './documents/components/DocumentList';
import { DocumentFilters } from './documents/components/DocumentFilters';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const DocumentsPage: React.FC = () => {
    const {
        documents,
        loading,
        error,
        generateDocumentFromCluster,
        generateDocumentFromTopic,
        exportDocument,
        deleteDocument
    } = useDocuments();

    const { showConfirmation } = useConfirmation();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showGenerationModal, setShowGenerationModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [generationType, setGenerationType] = useState<'cluster' | 'topic' | null>(null);
    const [generationMessage, setGenerationMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Filter documents
    const filteredDocuments = useMemo(() => {
        let filtered = documents;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(document => {
                const content = document.draft_content?.markdown || document.content || '';
                return document.title.toLowerCase().includes(query) ||
                    content.toLowerCase().includes(query);
            });
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(document => document.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Sort by creation date (newest first)
        filtered.sort((a, b) => {
            const dateA = new Date(a.created_at || a.generated_at || 0).getTime();
            const dateB = new Date(b.created_at || b.generated_at || 0).getTime();
            return dateB - dateA;
        });

        return filtered;
    }, [documents, searchQuery, statusFilter]);

    // Event Handlers
    const handleGenerateClick = (type: 'cluster' | 'topic') => {
        setGenerationType(type);
        setShowGenerationModal(true);
        setGenerationMessage(null);
    };

    const handleViewClick = (document: Document) => {
        setSelectedDocument(document);
        setShowDetailModal(true);
    };

    const handleDeleteClick = (documentId: string) => {
        const document = documents.find(d => d.id === documentId);
        if (!document) return;

        showConfirmation(
            {
                title: 'Delete Document',
                message: `Are you sure you want to delete "${document.title}"? This action cannot be undone.`
            },
            () => deleteDocument(documentId)
        );
    };

    const handleExportClick = async (doc: Document, format: 'pdf' | 'docx' | 'html' | 'txt' | 'md' = 'pdf') => {
        try {
            const blob = await exportDocument(doc.id, format);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${doc.title}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Failed to export document:', error);
        }
    };

    const handleGenerateDocument = async (data: {
        templateId: string;
        sourceId: string;
        title?: string;
        renderFormat?: 'PDF' | 'DOCX' | 'HTML' | 'TXT' | 'MD';
    }) => {
        try {
            setGenerationMessage(null);

            let success = false;
            if (generationType === 'cluster') {
                success = await generateDocumentFromCluster(data.sourceId, data.templateId, data.title || undefined, data.renderFormat);
            } else if (generationType === 'topic') {
                success = await generateDocumentFromTopic(data.sourceId, data.templateId, data.title || undefined, data.renderFormat);
            }

            if (success) {
                setGenerationMessage({
                    type: 'success',
                    message: `Document generated successfully! It will appear in the list once processing is complete.`
                });
                setShowGenerationModal(false);
                setGenerationType(null);
            } else {
                setGenerationMessage({
                    type: 'error',
                    message: 'Failed to generate document. Please try again.'
                });
            }
        } catch (error) {
            console.error('Failed to generate document:', error);
            setGenerationMessage({
                type: 'error',
                message: `Failed to generate document: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
    };

    const handleCloseModals = () => {
        setShowGenerationModal(false);
        setShowDetailModal(false);
        setSelectedDocument(null);
        setGenerationType(null);
        setGenerationMessage(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <ErrorState
                    error={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <DocumentTextIcon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                                        Document Generation
                                    </h1>
                                    <p className="text-white/70 mt-2 text-lg">
                                        Generate AI-powered reports and documents from your innovation data
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-white/70">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <span>AI-Powered</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                    <span>Multiple Formats</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    <span>Real-time Processing</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-2 sm:gap-1">
                            <button
                                onClick={() => handleGenerateClick('cluster')}
                                disabled={loading}
                                className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <DocumentTextIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                                        <span>Generate from Cluster</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleGenerateClick('topic')}
                                disabled={loading}
                                className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <DocumentTextIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                                        <span>Generate from Topic</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Border with Enhanced Effect */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
                </div>
            </div>

            {/* Filters */}
            <DocumentFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onClearFilters={handleClearFilters}
            />

            {/* Generation Message */}
            {generationMessage && (
                <Message
                    type={generationMessage.type}
                    message={generationMessage.message}
                    onClose={() => setGenerationMessage(null)}
                />
            )}

            {/* Documents List */}
            <DocumentList
                documents={filteredDocuments}
                onView={handleViewClick}
                onDelete={handleDeleteClick}
                onExport={handleExportClick}
            />

            {/* Modals */}
            {showGenerationModal && generationType && (
                <DocumentGenerationModal
                    isOpen={showGenerationModal}
                    onClose={handleCloseModals}
                    onGenerate={handleGenerateDocument}
                    generationType={generationType}
                />
            )}

            {showDetailModal && selectedDocument && (
                <DocumentDetailModal
                    isOpen={showDetailModal}
                    onClose={handleCloseModals}
                    document={selectedDocument}
                    onExport={handleExportClick}
                />
            )}
        </div>
    );
};

export { DocumentsPage };
export default DocumentsPage; 