import { Loader2, PlusCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminWebinarCard from '../../components/webinar/AdminWebinarCard';
import EditWebinarModal from '../../components/webinar/EditWebinarModal';
import ViewApplicantsModal from '../../components/webinar/ViewApplicantsModal';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar } from '../../store/useWebinarstore';

const AdminWebinars: React.FC = () => {
  const { theme } = useTheme();
  const { 
    adminWebinars, 
    loading, 
    error, 
    fetchAdminWebinars 
  } = useWebinarStore();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isApplicantsModalOpen, setApplicantsModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);


  useEffect(() => {
    fetchAdminWebinars();
  }, [fetchAdminWebinars]);

  const handleEdit = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setEditModalOpen(true);
  };

  const handleViewApplicants = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setApplicantsModalOpen(true);
  };

  const filteredWebinars = useMemo(() => {
    if (!adminWebinars) return [];
    
    return adminWebinars
      .filter(webinar => {
        // Tab-based filtering
        if (activeTab === 'published') return webinar.isPublished;
        if (activeTab === 'drafts') return !webinar.isPublished;
        return true; // 'all' tab
      })
      .filter(webinar => 
        // Search query filtering
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (webinar.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (webinar.speaker?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
  }, [adminWebinars, activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Error fetching webinars: {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Manage Webinars
            </h1>
            <p className={`mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and publish tech sessions for the community.
            </p>
          </div>
          <Link
            to="/dashboard/admin-webinars/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
          >
            <PlusCircle size={18} />
            Create New Webinar
          </Link>
        </div>
        
        {/* Search and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4">
          <input
              type="text"
              placeholder="Search by title, speaker..."
              className={`w-full sm:w-72 px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'published'
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'drafts'
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                Drafts
              </button>
            </nav>
          </div>
        </div>


        {/* Webinars Grid */}
        {filteredWebinars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {filteredWebinars.map(webinar => (
                <AdminWebinarCard 
                  key={webinar.id} 
                  webinar={webinar} 
                  onEdit={() => handleEdit(webinar)}
                  onViewApplicants={() => handleViewApplicants(webinar)}
                />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchQuery 
                ? 'No webinars found matching your search.'
                : `No webinars found in "${activeTab}" tab.`}
            </p>
          </div>
        )}
      </div>
      <EditWebinarModal
        webinar={selectedWebinar}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <ViewApplicantsModal
        webinar={selectedWebinar}
        isOpen={isApplicantsModalOpen}
        onClose={() => setApplicantsModalOpen(false)}
      />
    </>
  );
};

export default AdminWebinars;