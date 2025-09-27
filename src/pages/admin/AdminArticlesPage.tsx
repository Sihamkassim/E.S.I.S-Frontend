import { Loader2, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminArticleCard } from '../../components/articles/AdminArticleCard';
import { useTheme } from '../../hooks/useTheme';
import { Article, articleService, ArticleListResponse } from '../../services/articleService';

const AdminArticles: React.FC = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchAdminArticles();
  }, [pagination.page, activeTab]);

  const fetchAdminArticles = async () => {
    try {
      setLoading(true);
      
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
      }
      // 'all' tab shows all statuses (no filter)
      
      const response: ArticleListResponse = await articleService.getAdminArticles(filters);
      setArticles(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        pages: response.meta.pages
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditModalOpen(true);
  };

  const handleDelete = async (article: Article) => {
    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await articleService.deleteArticle(article.id);
        // Refetch articles to update the list
        fetchAdminArticles();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete article');
      }
    }
  };

  const handlePublish = async (article: Article) => {
    try {
      await articleService.publishArticle(article.id);
      // Refetch articles to update the list
      fetchAdminArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article');
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

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    // First filter by search query (client-side)
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.summary?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (article.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (article.category?.name.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.pages;
    const currentPage = pagination.page;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed
    if (startPage > 2) pages.push('...');
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) pages.push('...');
    
    // Always show last page if there is more than one page
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  if (loading && articles.length === 0) {
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
          Error fetching articles: {error}
        </p>
        <button
          onClick={fetchAdminArticles}
          className="ml-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Retry
        </button>
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
              Manage Articles
            </h1>
            <p className={`mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and publish articles for your blog. 
              Showing {pagination.total} total articles.
            </p>
          </div>
          <Link
            to="/dashboard/admin-articles/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
          >
            <PlusCircle size={18} />
            Create New Article
          </Link>
        </div>
        
        {/* Search and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4">
          <input
            type="text"
            placeholder="Search by title, content, category..."
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
                onClick={() => handleTabChange('all')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                All ({pagination.total})
              </button>
              <button
                onClick={() => handleTabChange('published')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'published'
                    ? 'border-primary text-primary'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 dark:hover:text-gray-300`
                }`}
              >
                Published
              </button>
              <button
                onClick={() => handleTabChange('drafts')}
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

        {/* Loading indicator for page changes */}
        {loading && articles.length > 0 && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {filteredArticles.map(article => (
                <AdminArticleCard 
                  key={article.id} 
                  article={article} 
                  onEdit={() => handleEdit(article)}
                  onDelete={() => handleDelete(article)}
                  onPublish={() => handlePublish(article)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing page {pagination.page} of {pagination.pages} •{' '}
                  {pagination.total} total articles
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
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

                  {/* Page Numbers */}
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

                  {/* Next Button */}
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
          <div className="text-center py-20">
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchQuery 
                ? 'No articles found matching your search.'
                : `No articles found in "${activeTab}" tab.`}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleTabChange('all')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                View All Articles
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminArticles;