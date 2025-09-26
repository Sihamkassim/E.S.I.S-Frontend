import { Loader2, PlusCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminArticleCard } from '../../components/articles/AdminArticleCard';
import { useTheme } from '../../hooks/useTheme';
import { Article, articleService } from '../../services/articleService';

const AdminArticles: React.FC = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getAdminArticles();
      setArticles(response.data);
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
        // Remove article from list
        setArticles(articles.filter(a => a.id !== article.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete article');
      }
    }
  };

  const handlePublish = async (article: Article) => {
    try {
      const updatedArticle = await articleService.publishArticle(article.id);
      // Update article in list
      setArticles(articles.map(a => a.id === article.id ? updatedArticle : a));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article');
    }
  };

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    return articles
      .filter(article => {
        // Tab-based filtering
        if (activeTab === 'published') return article.publishedAt !== null;
        if (activeTab === 'drafts') return article.publishedAt === null;
        return true; // 'all' tab
      })
      .filter(article => 
        // Search query filtering
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.summary?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (article.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (article.category?.name.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
  }, [articles, activeTab, searchQuery]);

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
          Error fetching articles: {error}
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
              Manage Articles
            </h1>
            <p className={`mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and publish articles for your blog.
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

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
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
        ) : (
          <div className="text-center py-20">
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchQuery 
                ? 'No articles found matching your search.'
                : `No articles found in "${activeTab}" tab.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminArticles;