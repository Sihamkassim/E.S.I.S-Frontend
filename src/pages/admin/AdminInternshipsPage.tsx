import { Loader2, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { 
  InternshipPosition, 
  internshipCreationService, 
  InternshipListResponse 
} from '../../services/internshipCreationService';
import { AdminInternshipCard } from '../../components/internships/AdminInternshipCard';

const AdminInternships: React.FC = () => {
  const { theme } = useTheme();
  const [internships, setInternships] = useState<InternshipPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<InternshipPosition | null>(null);

  useEffect(() => {
    fetchAdminInternships();
  }, [pagination.page, activeTab]);

  const fetchAdminInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters based on active tab
      const filters: any = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Add status filter based on active tab
      if (activeTab === 'published') {
        filters.status = 'PUBLISHED';
      } else if (activeTab === 'drafts') {
        filters.status = 'DRAFT';
      } else if (activeTab === 'closed') {
        filters.status = 'CLOSED';
      } else if (activeTab === 'archived') {
        filters.status = 'ARCHIVED';
      }
      // For 'all' tab, don't set any status filter - this will return ALL internships
      // including published, drafts, closed, and archived
      
      const response: InternshipListResponse = await internshipCreationService.getAdminInternships(filters);
      
      // Defensive checks for API response
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Ensure data is always an array
      const internshipsData = Array.isArray(response?.data) ? response.data : [];
      
      setInternships(internshipsData);
      
      // Safely update pagination meta
      if (response?.meta) {
        setPagination(prev => ({
          ...prev,
          total: response.meta?.total || 0,
          pages: response.meta?.pages || 0
        }));
      }
      
    } catch (err) {
      console.error('Error fetching internships:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch internships';
      setError(errorMessage);
      setInternships([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (internship: InternshipPosition) => {
    setSelectedInternship(internship);
    setEditModalOpen(true);
  };

  const handleDelete = async (internship: InternshipPosition) => {
    if (window.confirm(`Are you sure you want to delete "${internship.title}"?`)) {
      try {
        await internshipCreationService.deleteInternship(internship.id);
        await fetchAdminInternships(); // Refetch after deletion
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete internship';
        setError(errorMessage);
      }
    }
  };

  const handlePublish = async (internship: InternshipPosition) => {
    try {
      await internshipCreationService.publishInternship(internship.id);
      await fetchAdminInternships(); // Refetch after publish
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish internship';
      setError(errorMessage);
    }
  };

  const handleClose = async (internship: InternshipPosition) => {
    try {
      await internshipCreationService.closeInternship(internship.id);
      await fetchAdminInternships(); // Refetch after close
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to close internship';
      setError(errorMessage);
    }
  };

  // Handle tab change - reset to page 1 when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Safe filtering of internships
  const filteredInternships = useMemo(() => {
    if (!Array.isArray(internships) || internships.length === 0) {
      return [];
    }
    
    if (!searchQuery.trim()) {
      return internships;
    }
    
    const query = searchQuery.toLowerCase();
    return internships.filter(internship => 
      internship.title?.toLowerCase().includes(query) ||
      internship.description?.toLowerCase().includes(query) ||
      internship.department?.toLowerCase().includes(query) ||
      internship.location?.toLowerCase().includes(query) ||
      internship.requirements?.toLowerCase().includes(query) ||
      internship.responsibilities?.toLowerCase().includes(query)
    );
  }, [internships, searchQuery]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination.pages;
    const currentPage = pagination.page;
    
    if (totalPages <= 1) return [1];
    
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed before middle pages
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Calculate display counts
  const displayedCount = filteredInternships.length;
  const totalCount = pagination.total;

  // Show loading state only on initial load
  if (loading && internships.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading internships...
        </p>
      </div>
    );
  }

  // Show error state
  if (error && internships.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
        <button
          onClick={fetchAdminInternships}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Manage Internships
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Create, edit, and publish internship positions
          </p>
        </div>
        <Link
          to="/dashboard/admin-internships/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors shrink-0"
        >
          <PlusCircle size={18} />
          Create New Internship
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className={`ml-4 px-3 py-1 rounded text-sm ${
                theme === 'dark' ? 'text-red-300 hover:bg-red-800' : 'text-red-600 hover:bg-red-100'
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search and Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title, department, location..."
            className={`flex-1 px-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-primary`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap gap-4 sm:gap-8" aria-label="Tabs">
            {[
              { key: 'all', label: 'All', count: totalCount },
              { key: 'published', label: 'Published' },
              { key: 'drafts', label: 'Drafts' },
              { key: 'closed', label: 'Closed' },
              { key: 'archived', label: 'Archived' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : `border-transparent ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading indicator for page changes */}
      {loading && internships.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Results Count */}
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {searchQuery ? (
          <>Showing {displayedCount} of {totalCount} internships matching "{searchQuery}"</>
        ) : (
          <>Showing {displayedCount} of {totalCount} total internships</>
        )}
      </div>

      {/* Internships Grid */}
      {displayedCount > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <AdminInternshipCard 
                key={internship.id} 
                internship={internship} 
                onEdit={() => handleEdit(internship)}
                onDelete={() => handleDelete(internship)}
                onPublish={() => handlePublish(internship)}
                onClose={() => handleClose(internship)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Page {pagination.page} of {pagination.pages} • {totalCount} total
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`p-2 rounded border ${
                    pagination.page === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-300' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`min-w-[40px] px-3 py-2 rounded text-sm font-medium ${
                        page === pagination.page
                          ? 'bg-primary text-white'
                          : page === '...'
                          ? 'cursor-default'
                          : `hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`p-2 rounded border ${
                    pagination.page === pagination.pages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${
                    theme === 'dark' 
                      ? 'border-gray-600 text-gray-300' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className={`text-lg mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {searchQuery 
              ? 'No internships found matching your search.'
              : `No ${activeTab === 'all' ? '' : activeTab} internships found.`}
          </div>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Clear Search
            </button>
          ) : (
            activeTab !== 'all' && (
              <button
                onClick={() => handleTabChange('all')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                View All Internships
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInternships;