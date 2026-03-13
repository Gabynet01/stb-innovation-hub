import React, { useState, useMemo } from 'react';
import { useTemplates } from '@/hooks';
import { Template, TemplateCreate } from '@/types/api';
import { Button, LoadingSpinner, CompactErrorWithToast, useSnackbar } from '@/components/ui';
import { useConfirmation } from '@/hooks';
import { useRefreshSidebarCounts } from '@/contexts/SidebarCountsContext';
import { TemplateFormModal, TemplateDetailModal, TemplateUploadModal } from '@/components/modals';
import { TemplateList } from './templates/components/TemplateList';
import { TemplateFilters } from './templates/components/TemplateFilters';
import { PlusIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const TemplatesPage: React.FC = () => {
    const {
        templates,
        loading,
        error,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        uploadTemplate,
        getTemplateKinds
    } = useTemplates();

    const { showConfirmation } = useConfirmation();
    const refreshSidebarCounts = useRefreshSidebarCounts();
    const { showSnackbar } = useSnackbar();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [kindFilter, setKindFilter] = useState('');
    const [activeOnly, setActiveOnly] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [templateKinds, setTemplateKinds] = useState<string[]>([]);

    // Load template kinds on mount
    React.useEffect(() => {
        const loadKinds = async () => {
            const kinds = await getTemplateKinds();
            if (kinds) {
                setTemplateKinds(kinds);
            }
        };
        loadKinds();
    }, [getTemplateKinds]);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        let filtered = templates || [];

        // Extract variables from template content for filtering
        const extractVariables = (content: string): string[] => {
            const variableRegex = /\{\{([^}]+)\}\}/g;
            const matches = content.match(variableRegex);
            if (matches) {
                return Array.from(new Set(matches)); // Remove duplicates
            }
            return [];
        };

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(template => {
                const templateContent = template.content_markdown || template.content || '';
                const variables = extractVariables(templateContent);

                return template.name.toLowerCase().includes(query) ||
                    (template.description && template.description.toLowerCase().includes(query)) ||
                    variables.some(variable => variable.toLowerCase().includes(query));
            });
        }

        // Apply kind filter
        if (kindFilter) {
            filtered = filtered.filter(template => {
                const templateContent = template.content_markdown || template.content || '';
                const variables = extractVariables(templateContent);

                return variables.some(variable => variable.toLowerCase().includes(kindFilter.toLowerCase()));
            });
        }

        // Apply active filter
        if (activeOnly) {
            // For now, we'll show all templates as active
            // This can be enhanced when the backend supports active/inactive status
        }

        // Sort by creation date (newest first)
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return filtered;
    }, [templates, searchQuery, kindFilter, activeOnly]);

    // Event Handlers
    const handleCreateClick = () => {
        setSelectedTemplate(null);
        setShowCreateModal(true);
    };

    const handleUploadClick = () => {
        setShowUploadModal(true);
    };

    const handleEditClick = (template: Template) => {
        setSelectedTemplate(template);
        setShowEditModal(true);
    };

    const handleEditFromDetail = (template: Template) => {
        setShowDetailModal(false); // Close detail modal first
        setSelectedTemplate(template);
        setShowEditModal(true);
    };

    const handleViewClick = (template: Template) => {
        setSelectedTemplate(template);
        setShowDetailModal(true);
    };

    const handleDeleteClick = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        showConfirmation(
            {
                title: 'Delete Template',
                message: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`
            },
            () => {
                deleteTemplate(templateId).then(() => refreshSidebarCounts());
            }
        );
    };

    const handleCreateTemplate = async (templateData: TemplateCreate | Partial<Template>) => {
        try {
            await createTemplate(templateData as TemplateCreate);
            setShowCreateModal(false);
            refreshSidebarCounts();
            showSnackbar({ type: 'success', title: 'Template created', message: 'The template has been created successfully.' });
        } catch (err) {
            showSnackbar({ type: 'error', title: 'Failed to create template', message: err instanceof Error ? err.message : 'Please try again.' });
        }
    };

    const handleEditTemplate = async (templateData: TemplateCreate | Partial<Template>) => {
        if (!selectedTemplate) return;

        try {
            // Convert TemplateCreate to Partial<Template> for update
            const updateData: Partial<Template> = {
                name: templateData.name,
                description: templateData.description,
                content_markdown: 'content_markdown' in templateData ? templateData.content_markdown : (templateData as any).content,
                version: 'version' in templateData ? templateData.version : undefined,
                kind: 'kind' in templateData ? templateData.kind : undefined,
                engine: 'engine' in templateData ? templateData.engine : undefined,
                active: 'active' in templateData ? templateData.active : undefined
            };

            await updateTemplate(selectedTemplate.id, updateData);
            setShowEditModal(false);
            setSelectedTemplate(null);
            refreshSidebarCounts();
            showSnackbar({ type: 'success', title: 'Template updated', message: 'The template has been updated successfully.' });
        } catch (err) {
            showSnackbar({ type: 'error', title: 'Failed to update template', message: err instanceof Error ? err.message : 'Please try again.' });
        }
    };

    const handleUploadTemplate = async (data: { file: File; template_name: string; template_description?: string; version: string; kind: string }) => {
        try {
            await uploadTemplate(data);
            setShowUploadModal(false);
            refreshSidebarCounts();
            showSnackbar({ type: 'success', title: 'Template uploaded', message: 'The template has been uploaded successfully.' });
        } catch (err) {
            showSnackbar({ type: 'error', title: 'Failed to upload template', message: err instanceof Error ? err.message : 'Please try again.' });
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setKindFilter('');
        setActiveOnly(true);
    };

    const handleCloseModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDetailModal(false);
        setShowUploadModal(false);
        setSelectedTemplate(null);
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
            <CompactErrorWithToast
                error={error}
                title="Failed to load templates"
                onRetry={() => window.location.reload()}
            />
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-6 lg:mb-0">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <DocumentTextIcon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                                        Document Templates
                                    </h1>
                                    <p className="text-white/70 mt-1">
                                        Create and manage templates for AI-generated reports
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-white/70">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <span>{templates.length} templates</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                    <span>Active system</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-2 sm:gap-1">
                            <button
                                onClick={handleUploadClick}
                                className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs"
                            >
                                <DocumentArrowUpIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                                <span>Upload Template</span>
                            </button>
                            <button
                                onClick={handleCreateClick}
                                className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs"
                            >
                                <PlusIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
                                <span>Create Template</span>
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
            <TemplateFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                kindFilter={kindFilter}
                onKindFilterChange={setKindFilter}
                activeOnly={activeOnly}
                onActiveOnlyChange={setActiveOnly}
                templateKinds={templateKinds}
                onClearFilters={handleClearFilters}
            />

            {/* Templates List */}
            <TemplateList
                templates={filteredTemplates}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onView={handleViewClick}
            />

            {/* Modals */}
            {showCreateModal && (
                <TemplateFormModal
                    isOpen={showCreateModal}
                    onClose={handleCloseModals}
                    onSave={handleCreateTemplate}
                    template={null}
                    isEditing={false}
                />
            )}

            {showEditModal && selectedTemplate && (
                <TemplateFormModal
                    isOpen={showEditModal}
                    onClose={handleCloseModals}
                    onSave={handleEditTemplate}
                    template={selectedTemplate}
                    isEditing={true}
                />
            )}

            {showDetailModal && selectedTemplate && (
                <TemplateDetailModal
                    isOpen={showDetailModal}
                    onClose={handleCloseModals}
                    template={selectedTemplate}
                    onEdit={handleEditFromDetail}
                />
            )}

            {showUploadModal && (
                <TemplateUploadModal
                    isOpen={showUploadModal}
                    onClose={handleCloseModals}
                    onUpload={handleUploadTemplate}
                />
            )}
        </div>
    );
};

export { TemplatesPage };
export default TemplatesPage; 