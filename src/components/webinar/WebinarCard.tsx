import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Webinar, useWebinarStore } from '../../store/useWebinarstore';
import TicketModal from './TicketModal';
import WebinarApplyModal from './WebinarApplyModal';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface WebinarCardProps {
  webinar: Webinar;
  showDescription?: boolean;
  featured?: boolean;
  applicationStatus?: {
    hasApplied: boolean;
    application: {
      id: number;
      status: 'Applied' | 'Approved' | 'Rejected' | 'Completed';
      createdAt: string;
      ticket: any | null;
    } | null;
  };
  isLoadingStatus?: boolean;
  onApplyClick?: () => void;
  statusBadge?: React.ReactNode;
}

const WebinarCard: React.FC<WebinarCardProps> = ({
  webinar,
  applicationStatus: appStatus, // Renamed to avoid conflict
  isLoadingStatus = false,
  onApplyClick,
  statusBadge
}) => {
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

  // Use application status ticket if available, otherwise use store ticket
  const effectiveTicket = appStatus?.application?.ticket || ticket;

  if (!webinar || !webinar.title || !webinar.schedule) {
    return (
      <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/20 w-[280px] h-[320px] flex items-center justify-center">
        <p className="text-gray-200 text-center">Incomplete webinar data</p>
      </div>
    );
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(`/login?redirect=/webinars/${webinar.id}`);
      return;
    }

    // If custom apply handler provided, use it
    if (onApplyClick) {
      onApplyClick();
      return;
    }

    // Otherwise use default modal behavior
    setShowApplyModal(true);
  };

  const handleViewTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (effectiveTicket) setShowTicketModal(true);
  };

  const handleMakePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!webinar.price) return;
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

  const getButtonState = () => {
    const isUpcoming = new Date(webinar.schedule) >= new Date();
    const hasApplied = appStatus?.hasApplied;
    const application = appStatus?.application;

    if (!isUpcoming) {
      return {
        text: 'Event Ended',
        disabled: true,
        variant: 'disabled' as const
      };
    }

    if (isLoadingStatus) {
      return {
        text: 'Checking...',
        disabled: true,
        variant: 'loading' as const
      };
    }

    if (hasApplied) {
      switch (application?.status) {
        case 'Applied':
          return {
            text: 'Application Pending',
            disabled: true,
            variant: 'pending' as const
          };
        case 'Approved':
          return {
            text: 'View Ticket',
            disabled: false,
            variant: 'approved' as const
          };
        case 'Rejected':
          return {
            text: 'Application Rejected',
            disabled: true,
            variant: 'rejected' as const
          };
        case 'Completed':
          return {
            text: 'Completed',
            disabled: true,
            variant: 'completed' as const
          };
        default:
          return {
            text: 'Applied',
            disabled: true,
            variant: 'applied' as const
          };
      }
    }

    return {
      text: 'Register Now',
      disabled: false,
      variant: 'register' as const
    };
  };

  const getButtonStyles = (variant: string) => {
    const baseStyles = "w-full px-4 py-2 rounded-md border transition-all duration-200 font-medium";

    switch (variant) {
      case 'disabled':
      case 'pending':
      case 'rejected':
      case 'completed':
      case 'applied':
        return `${baseStyles} border-gray-400 text-gray-300 bg-gray-600/30 cursor-not-allowed`;
      case 'loading':
        return `${baseStyles} border-blue-400 text-blue-300 bg-blue-600/30 cursor-not-allowed`;
      case 'approved':
        return `${baseStyles} border-green-400 text-green-300 bg-green-900/30 hover:bg-green-900/50 cursor-pointer`;
      case 'register':
      default:
        return `${baseStyles} border-white/40 text-white hover:bg-white/20 cursor-pointer`;
    }
  };

  const buttonState = getButtonState();

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

  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1$/, '') || '';
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

  // Generate status badge if not provided
  const renderStatusBadge = () => {
    if (statusBadge) return statusBadge;

    if (!appStatus?.hasApplied || !appStatus.application) return null;

    const applicationStatus = appStatus.application.status; // Fixed variable name

    const statusConfig = {
      Applied: {
        icon: Clock,
        color: 'text-yellow-300',
        bgColor: 'bg-yellow-900/50',
        text: 'Applied'
      },
      Approved: {
        icon: CheckCircle,
        color: 'text-green-300',
        bgColor: 'bg-green-900/50',
        text: 'Approved'
      },
      Rejected: {
        icon: AlertCircle,
        color: 'text-red-300',
        bgColor: 'bg-red-900/50',
        text: 'Rejected'
      },
      Completed: {
        icon: CheckCircle,
        color: 'text-blue-300',
        bgColor: 'bg-blue-900/50',
        text: 'Completed'
      }
    };

    const config = statusConfig[applicationStatus];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  return (
    <>
      {/* Transparent card with image */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg w-[280px] h-[420px] flex flex-col justify-end group cursor-pointer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => {
          // Navigate to webinar detail page or show details
          navigate(`/webinars/${webinar.id}`);
        }}
      >
        {/* Status Badge */}
        {(appStatus?.hasApplied || statusBadge) && (
          <div className="absolute top-3 right-3 z-20">
            {renderStatusBadge()}
          </div>
        )}

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

        {/* Content */}
        <div className="relative z-10 p-6 backdrop-blur-md bg-white/10 border-t border-white/20">
          {/* Date */}
          <span className="block text-xs text-gray-200 mb-2">
            {formatDate(webinar.schedule)}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
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

          {/* Price */}
          {webinar.price && webinar.price > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-200">Price:</span>
              <span className="text-lg font-bold text-white">
                {webinar.price.toLocaleString()} ETB
              </span>
            </div>
          )}

          {/* Application Info */}
          {appStatus?.hasApplied && appStatus.application && (
            <div className="mb-3 p-2 rounded-lg text-xs bg-black/30 text-gray-300">
              Applied on {new Date(appStatus.application.createdAt).toLocaleDateString()}
            </div>
          )}

          {/* Button */}
          <button
            onClick={buttonState.variant === 'approved' ? handleViewTicket : handleRegisterClick}
            disabled={buttonState.disabled}
            className={getButtonStyles(buttonState.variant)}
          >
            {buttonState.variant === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              buttonState.text
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
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
      {showTicketModal && effectiveTicket && (
        <TicketModal
          open={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          webinar={webinar}
          ticket={effectiveTicket}
        />
      )}
    </>
  );
};

export default WebinarCard;