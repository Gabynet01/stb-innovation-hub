import React, { useState, useMemo, useEffect } from 'react';
import { useClusters } from '@/hooks';
import { Cluster, ClusterCreate } from '@/types/api';
import { LoadingSpinner, CompactErrorWithToast, useSnackbar, ListPagination, ITEMS_PER_PAGE } from '@/components/ui';
import { useConfirmation } from '@/hooks';
import { useRefreshSidebarCounts } from '@/contexts/SidebarCountsContext';
import { ClusterFormModal } from '@/components/modals/ClusterFormModal';
import { ClusterDetailModal } from '@/components/modals/ClusterDetailModal';
import { ClusterList, ClusterFilters } from './clusters/components';
import { PlusIcon } from '@heroicons/react/24/outline';

const ClustersPage: React.FC = () => {
  const {
    clusters,
    loading,
    error,
    createCluster,
    updateCluster,
    deleteCluster
  } = useClusters();

  const { showConfirmation } = useConfirmation();
  const refreshSidebarCounts = useRefreshSidebarCounts();
  const { showSnackbar } = useSnackbar();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter clusters
  const filteredClusters = useMemo(() => {
    let filtered = clusters;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cluster =>
        (cluster.title && cluster.title.toLowerCase().includes(query)) ||
        (cluster.description && cluster.description.toLowerCase().includes(query)) ||
        cluster.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply kind filter
    if (kindFilter) {
      filtered = filtered.filter(cluster => cluster.kind === kindFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(cluster => cluster.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
  }, [clusters, searchQuery, kindFilter, statusFilter]);

  // Paginate filtered list
  const paginatedClusters = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClusters.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClusters, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, kindFilter, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Event Handlers
  const handleCreateClick = () => {
    setSelectedCluster(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setShowEditModal(true);
  };

  const handleEditFromDetail = (cluster: Cluster) => {
    setShowDetailModal(false); // Close detail modal first
    setSelectedCluster(cluster);
    setShowEditModal(true);
  };

  const handleViewClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (!cluster) return;

    showConfirmation(
      {
        title: 'Delete Cluster',
        message: `Are you sure you want to delete "${cluster.title || `Cluster ${cluster.id.slice(0, 8)}`}"? This action cannot be undone.`
      },
      () => {
        deleteCluster(clusterId).then(() => refreshSidebarCounts());
      }
    );
  };

  const handleCreateCluster = async (clusterData: Partial<Cluster>) => {
    try {
      await createCluster(clusterData as ClusterCreate);
      setShowCreateModal(false);
      refreshSidebarCounts();
      showSnackbar({ type: 'success', title: 'Cluster created', message: 'The cluster has been created successfully.' });
    } catch (err) {
      showSnackbar({ type: 'error', title: 'Failed to create cluster', message: err instanceof Error ? err.message : 'Please try again.' });
    }
  };

  const handleEditCluster = async (clusterData: Partial<Cluster>) => {
    if (!selectedCluster) return;

    try {
      await updateCluster(selectedCluster.id, clusterData);
      setShowEditModal(false);
      setSelectedCluster(null);
      refreshSidebarCounts();
      showSnackbar({ type: 'success', title: 'Cluster updated', message: 'The cluster has been updated successfully.' });
    } catch (err) {
      showSnackbar({ type: 'error', title: 'Failed to update cluster', message: err instanceof Error ? err.message : 'Please try again.' });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setKindFilter('');
    setStatusFilter('');
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedCluster(null);
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
        title="Failed to load clusters"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
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
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">AI Clusters</h1>
              <p className="text-white/70 mt-1">
                View and manage AI-generated clusters of suggestions
              </p>
            </div>
            <button
              onClick={handleCreateClick}
              className="px-6 py-3 md:px-4 md:py-2.5 sm:px-3 sm:py-2 font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-sm md:text-xs"
            >
              <PlusIcon className="h-4 w-4 md:h-3.5 md:w-3.5 sm:h-3 sm:w-3 mr-2 md:mr-1.5 sm:mr-1 inline" />
              <span>Create Cluster</span>
            </button>
          </div>
        </div>

        {/* Decorative Bottom Border with Enhanced Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
        </div>
      </div>

      {/* Filters */}
      <ClusterFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        kindFilter={kindFilter}
        onKindFilterChange={setKindFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Clusters List */}
      <ClusterList
        clusters={paginatedClusters}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick}
      />
      <ListPagination
        currentPage={currentPage}
        totalItems={filteredClusters.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        itemLabel="clusters"
      />

      {/* Modals */}
      {showCreateModal && (
        <ClusterFormModal
          isOpen={showCreateModal}
          onClose={handleCloseModals}
          onSave={handleCreateCluster}
          cluster={null}
          isEditing={false}
        />
      )}

      {showEditModal && selectedCluster && (
        <ClusterFormModal
          isOpen={showEditModal}
          onClose={handleCloseModals}
          onSave={handleEditCluster}
          cluster={selectedCluster}
          isEditing={true}
        />
      )}

      {showDetailModal && selectedCluster && (
        <ClusterDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseModals}
          cluster={selectedCluster}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
};

export { ClustersPage };
export default ClustersPage;
