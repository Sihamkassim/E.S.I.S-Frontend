import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Webinar, useWebinarStore } from '../../store/useWebinarstore';
import TicketModal from './TicketModal';
import WebinarApplyModal from './WebinarApplyModal';

interface WebinarCardProps {
  webinar: Webinar;
  showDescription?: boolean;
  featured?: boolean;
}

const WebinarCard: React.FC<WebinarCardProps> = ({ webinar }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const getTicketForWebinar = useWebinarStore(s => s.getTicketForWebinar);
  const ticket = getTicketForWebinar(webinar.id);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { initializeWebinarPayment } = useWebinarStore();
  const paymentInitWebinarId = useWebinarStore(s => s.paymentInitWebinarId);
  const applyingWebinarId = useWebinarStore(s => s.applyingWebinarId);
  const userApplications = useWebinarStore(s => s.userWebinarApplications) || [];

  const pendingPaidApplication = useMemo(() => {
    return userApplications.find(a => {
      const same = a.webinarId.toString() === webinar.id.toString();
      if (!same) return false;
      const status = (a.status || '').toString();
      const needsPayment = a.requiresPayment || webinar.requiresPayment;
      return needsPayment && (status === 'Applied' || status === 'Approved');
    });
  }, [userApplications, webinar.id, webinar.requiresPayment]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/webinars/${webinar.id}`);
      return;
    }
    setShowApplyModal(true);
  };

  const handleViewTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    if (ticket) setShowTicketModal(true);
  };

  const handleMakePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pendingPaidApplication || !webinar.price) return;
    try {
      const paymentInit = await initializeWebinarPayment?.(webinar.id, webinar.price);
      const checkoutUrl = paymentInit?.data?.checkout_url || paymentInit?.data?.data?.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error('Payment init failed', err);
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

  // Placeholder images (keep deterministic selection by id for variety)
  const placeholderImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000',
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000'
  ];

  const pickPlaceholder = () => {
    let index = 0;
    if (typeof webinar.id === 'number') {
      index = webinar.id % placeholderImages.length;
    } else if (typeof webinar.id === 'string') {
      index = [...webinar.id].reduce((sum, c) => sum + c.charCodeAt(0), 0) % placeholderImages.length;
    }
    return placeholderImages[index];
  };

  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1$/,'') || '';
  const resolveImage = (raw?: string | null): string => {
    if (!raw) return pickPlaceholder();
    if (/^https?:\/\//i.test(raw)) return raw; // absolute already
    // Strip any absolute filesystem prefix and keep uploads segment
    let working = raw.replace(/\\/g, '/');
    const idx = working.lastIndexOf('uploads');
    if (idx !== -1) working = working.slice(idx);
    const sanitized = working
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/')
      .replace(/^\/+/, '');
    const base = BACKEND_URL.replace(/\/+$/, '');
    if (base) return `${base}/${sanitized}`;
    return `${window.location.origin}/${sanitized}`;
  };

  const imageUrl = resolveImage(webinar.image);

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

          {/* Buttons logic */}
          {ticket ? (
            <button
              onClick={handleViewTicket}
              className="w-full px-4 py-2 rounded-md border border-green-400 text-green-300 bg-green-900/30 hover:bg-green-900/50 transition"
            >
              View Ticket
            </button>
          ) : pendingPaidApplication ? (
            <button
              onClick={handleMakePayment}
              disabled={paymentInitWebinarId === webinar.id || applyingWebinarId === webinar.id}
              className="w-full px-4 py-2 rounded-md border border-yellow-400 text-yellow-200 bg-yellow-900/30 hover:bg-yellow-900/50 disabled:opacity-60 transition"
            >
              {paymentInitWebinarId === webinar.id ? 'Redirecting...' : 'Make Payment'}
            </button>
          ) : (
            <button
              onClick={handleRegisterClick}
              disabled={applyingWebinarId === webinar.id}
              className="w-full px-4 py-2 rounded-md border border-white/40 text-white hover:bg-white/20 disabled:opacity-60 transition"
            >
              {applyingWebinarId === webinar.id ? 'Submitting...' : 'Register Now'}
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showApplyModal && (
        <WebinarApplyModal
          webinar={webinar}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          onTicketIssued={() => {
            setShowApplyModal(false);
            setShowTicketModal(true);
          }}
        />
      )}
      {showTicketModal && ticket && (
        <TicketModal
          open={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          webinar={webinar}
          ticket={ticket}
        />
      )}
    </>
  );
};

export default WebinarCard;
