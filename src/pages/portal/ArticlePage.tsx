import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService, Article } from '../../services/articleService';
import { Spinner } from '../../components/Spinner';
import { ArticleCard } from '../../components/articles/ArticleCard';

// Fallback image for articles without featured images
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const articleData = await articleService.getArticleBySlug(slug);
        setArticle(articleData);
        
        // Fetch related articles
        try {
          const related = await articleService.getRelatedArticles(articleData.id);
          setRelatedArticles(related);
        } catch (err) {
          console.error('Error fetching related articles:', err);
        }
        
        setError(null);
      } catch (err) {
        setError('Article not found');
        console.error('Error fetching article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== FALLBACK_IMAGE) {
      target.src = FALLBACK_IMAGE;
      setImageError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'The article you are looking for does not exist.'}
          </p>
          <Link
            to="/tech-updates"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className='mb-8'>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            ← Back to All Articles
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <time dateTime={article.publishedAt || article.createdAt}>
              {formatDate(article.publishedAt || article.createdAt)}
            </time>
            
            {article.category && (
              <Link
                to={`/category/${article.category.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {article.category.name}
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              {article.author?.profile?.avatarUrl && (
                <img
                  src={article.author.profile.avatarUrl}
                  alt={article.author.profile.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span>{article.author?.profile?.name || 'Unknown Author'}</span>
            </div>
          </div>

          {/* Always render the image container but conditionally set the src */}
          <div className="rounded-lg overflow-hidden mb-6 shadow-md">
            <img
              src={article.featuredImage || FALLBACK_IMAGE}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={handleImageError}
            />
          </div>
        </header>

        <div className='mb-12 dark:text-white/80'>
          {article.content }
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="px-4 py-2 bg-secondary text-white rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 2).map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};