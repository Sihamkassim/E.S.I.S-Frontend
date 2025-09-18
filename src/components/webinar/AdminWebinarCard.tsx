import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Webinar } from '../../store/useWebinarstore';

interface AdminWebinarCardProps {
  webinar: Webinar;
  onEdit: () => void;
  onViewApplicants: () => void;
}

const AdminWebinarCard: React.FC<AdminWebinarCardProps> = ({ webinar, onEdit, onViewApplicants }) => {
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
  
  const imageUrl = webinar.image || placeholderImages[parseInt(webinar.id.toString()) % placeholderImages.length];
  const applicantsCount = webinar._count?.tickets ?? 0;
  const capacity = webinar.capacity ?? '∞';

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 w-full flex flex-col ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Image */}
      <div className="relative">
        <img src={imageUrl} alt={webinar.title} className="w-full h-48 object-cover"/>
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
        <div className="flex gap-3 mt-auto">
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
        </div>
      </div>
    </div>
  );
};

export default AdminWebinarCard;