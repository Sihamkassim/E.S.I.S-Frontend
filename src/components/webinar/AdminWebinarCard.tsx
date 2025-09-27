import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Webinar } from '../../store/useWebinarstore';

interface AdminWebinarCardProps {
  webinar: Webinar;
  onEdit: () => void;
  onViewApplicants: () => void;
  onTogglePublish?: (publish: boolean) => void;
  onDelete?: () => Promise<void> | void;
}

const AdminWebinarCard: React.FC<AdminWebinarCardProps> = ({ webinar, onEdit, onViewApplicants, onTogglePublish, onDelete }) => {
  const { theme } = useTheme();

  if (!webinar) {
    return null;
  }
  
  const formatDate = (dateString: string): string => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return 'Invalid Date';
    }
  };
  
  const placeholderImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000',
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000'
  ];
  
  // Robust image URL resolution
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/api\/v1$/, '') || '';
  const resolveImage = (raw?: string | null): string => {
    if (!raw) {
      return placeholderImages[parseInt(webinar.id.toString(), 10) % placeholderImages.length];
    }
    // If already absolute
    if (/^https?:\/\//i.test(raw)) return raw;
    // Extract from uploads segment if absolute path leaked
    let working = raw.replace(/\\/g, '/');
    const idx = working.lastIndexOf('uploads');
    if (idx !== -1) working = working.slice(idx);
    const sanitized = working
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/')
      .replace(/^\/+/, '');
    const base = BACKEND_URL.replace(/\/+$/, '');
    if (base) return `${base}/${sanitized}`;
    // Fallback to same origin (may not work in dev if backend is different port)
    return `${window.location.origin}/${sanitized}`;
  };
  const imageUrl = resolveImage(webinar.image);
  const applicantsCount = webinar._count?.tickets ?? 0;
  const capacity = webinar.capacity ?? '∞';

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 w-full flex flex-col ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Image */}
      <div className="relative">
        <img
          src={imageUrl}
            alt={webinar.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = placeholderImages[0];
            }}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold shadow ${webinar.isPublished ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}>
            {webinar.isPublished ? 'Published' : 'Draft'}
          </span>
          {webinar.requiresPayment && (
            <span className="px-2 py-1 rounded-md text-xs font-semibold shadow bg-purple-600 text-white">
              Paid
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{formatDate(webinar.schedule)}</p>
        <h3 className={`text-lg font-bold mb-2 flex-grow ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {webinar.title}
        </h3>
        
        {webinar.speaker && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            By {webinar.speaker}
          </p>
        )}

        {/* Stats */}
        <div className="flex justify-between items-center text-sm border-t border-b border-gray-200 dark:border-gray-700 my-3 py-2">
            <div className="text-center">
                <span className="font-bold block">{applicantsCount}</span>
                <span className="text-gray-500 dark:text-gray-400">Applicants</span>
            </div>
            <div className="text-center">
                <span className="font-bold block">{capacity}</span>
                <span className="text-gray-500 dark:text-gray-400">Capacity</span>
            </div>
            <div className="text-center">
                <span className="font-bold block">{webinar.price ? `$${webinar.price}` : 'Free'}</span>
                <span className="text-gray-500 dark:text-gray-400">Price</span>
            </div>
        </div>

        {/* Action Buttons */}
  <div className="flex gap-3 mt-auto flex-wrap">
          {!webinar.isPublished && onTogglePublish && (
            <button
              onClick={() => onTogglePublish(true)}
              className="flex-1 text-center px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Publish
            </button>
          )}
          {webinar.isPublished && onTogglePublish && (
            <button
              onClick={() => onTogglePublish(false)}
              className="flex-1 text-center px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Unpublish
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 text-center px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onViewApplicants}
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            View Applicants
          </button>
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Delete this webinar? This action cannot be undone.')) {
                  void onDelete();
                }
              }}
              className="flex-1 text-center px-4 py-2 rounded-lg font-medium bg-gray-900/80 hover:bg-black text-white transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWebinarCard;