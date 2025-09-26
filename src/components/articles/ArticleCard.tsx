import { Link } from 'react-router-dom';
import { Article } from '../../services/articleService';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Author information
  const authorName = article.author?.profile?.name || 'Unknown Author';
  const avatarUrl = article.author?.profile?.avatarUrl;

  // fallback images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000',
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000'
  ];

  // Handle featured image with fallback
  const getFeaturedImageUrl = () => {
    if (!article.featuredImage) return null;
    
    return article.featuredImage;
  };

  let featuredImageUrl = getFeaturedImageUrl();
  
  // Use fallback image if article doesnt have featured image
  if (!featuredImageUrl || imageError) {
    let index = 0;
    if (typeof article.id === 'number') {
      index = article.id % placeholderImages.length;
    } else if (typeof article.id === 'string') {
      index =
        [...String(article.id)].reduce((sum, c) => sum + c.charCodeAt(0), 0) %
        placeholderImages.length;
    }
    featuredImageUrl = placeholderImages[index];
  }

  return (
    <article className="bg-background rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow">
      {featuredImageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <time dateTime={article.publishedAt || article.createdAt}>
            {formatDate(article.publishedAt || article.createdAt)}
          </time>
          {article.category && (
            <>
              <span>•</span>
              <Link
                to={`/category/${article.category.slug}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {article.category.name}
              </Link>
            </>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
          <Link
            to={`${article.slug}`}
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </Link>
        </h2>
        
        {article.summary && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  // Hide avatar if it fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <span className="text-sm text-foreground">
              {authorName}
            </span>
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-1">
              {article.tags.slice(0, 2).map(({ tag }) => (
                <span
                  key={tag.id}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
              {article.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{article.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};