import { Link } from 'react-router-dom';
import { Article } from '../../services/articleService';
import { useState } from 'react';

interface AdminArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onPublish: (article: Article) => void;
}

export const AdminArticleCard = ({ article, onEdit, onDelete, onPublish }: AdminArticleCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get author information
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
  
  // Use fallback image if no image
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

  // Determine status and styling if published or is draft
  const getStatusInfo = () => {
    switch (article.status) {
      case 'PUBLISHED':
        return {
          text: 'Published',
          class: 'bg-green-100 text-green-800 border-green-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'DRAFT':
        return {
          text: 'Draft',
          class: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        };
      default:
        return {
          text: 'Unknown',
          class: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null
        };
    }
  };

  // const statusInfo = getStatusInfo();

  return (
    <article className="bg-background rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow">
      {/* Status Badge */}
      {/* <div className="absolute top-3 left-3 z-100">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.class}`}>
          {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
          {statusInfo.text}
        </span>
      </div> */}

      {featuredImageUrl && (
        <Link to={`/dashboard/articles/${article.slug}`} className="block h-48 overflow-hidden relative">
          <img
            src={featuredImageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </Link>
      )}
      
      {/* Image */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <time dateTime={article.publishedAt || article.createdAt}>
            {formatDate(article.publishedAt || article.createdAt)}
          </time>
          {article.category && (
            <>
              <span>•</span>
              <span className="text-primary">
                {article.category.name}
              </span>
            </>
          )}
        </div>
        
        {/* Title */}
        <Link to={`/dashboard/articles/${article.slug}`}>
          <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        {article.summary && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  // Hide the avatar if it fails to load
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

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex space-x-2">
            {/* Edit Button */}
            <Link
              to={`/dashboard/admin-articles/${article.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            
            {/* Publish Button - only show if draft */}
            {article.status === 'DRAFT' && (
              <button
                onClick={() => onPublish(article)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Publish
              </button>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(article)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};