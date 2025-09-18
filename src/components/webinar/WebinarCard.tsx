import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Webinar } from '../../store/useWebinarstore';
import WebinarApplyModal from './WebinarApplyModal';

interface WebinarCardProps {
  webinar: Webinar;
  showDescription?: boolean;
  featured?: boolean;
}

const WebinarCard: React.FC<WebinarCardProps> = ({ webinar }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!webinar || !webinar.title || !webinar.schedule) {
    return (
      <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/20 w-[280px] h-[320px] flex items-center justify-center">
        <p className="text-gray-200 text-center">Incomplete webinar data</p>
      </div>
    );
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/webinars/${webinar.id}`);
    } else {
      setShowApplyModal(true);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return 'Date unavailable';
    }
  };

  // fallback images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000',
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000'
  ];

  let imageUrl = webinar.image;
  if (!imageUrl) {
    let index = 0;
    if (typeof webinar.id === 'number') {
      index = webinar.id % placeholderImages.length;
    } else if (typeof webinar.id === 'string') {
      index =
        [...webinar.id].reduce((sum, c) => sum + c.charCodeAt(0), 0) %
        placeholderImages.length;
    }
    imageUrl = placeholderImages[index];
  }

  return (
    <>
      {/* Transparent card with image */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg w-[280px] h-[420px] flex flex-col justify-end group"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

        {/* Content */}
        <div className="relative z-10 p-6 backdrop-blur-md bg-white/10 border-t border-white/20">
          {/* Date */}
          <span className="block text-xs text-gray-200 mb-2">
            {formatDate(webinar.schedule)}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2">
            {webinar.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-200 line-clamp-2 mb-3">
            {webinar.description}
          </p>

          {/* Speaker */}
          {webinar.speaker && (
            <p className="text-sm text-gray-100 mb-3">
              🎤 {webinar.speaker}
            </p>
          )}

          {/* Transparent Button */}
          <button
            onClick={handleRegisterClick}
            className="w-full px-4 py-2 rounded-md border border-white/40 text-white hover:bg-white/20 transition"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showApplyModal && (
        <WebinarApplyModal
          webinar={webinar}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default WebinarCard;
