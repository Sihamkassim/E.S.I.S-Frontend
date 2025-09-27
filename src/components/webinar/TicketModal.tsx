import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Ticket, Webinar } from '../../store/useWebinarstore';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  webinar: Webinar;
  ticket: { code: string; qrCode?: string; issuedAt?: string } | Ticket;
}

export const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, webinar, ticket }) => {
  const { theme } = useTheme();
  if (!open) return null;

  const issuedDate = ticket && (ticket as any).issuedAt ? new Date((ticket as any).issuedAt) : undefined;

  const copyCode = () => {
    navigator.clipboard.writeText(ticket.code).catch(()=>{});
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 rounded-xl shadow-2xl p-6 ${theme==='dark'?'bg-gray-900 text-gray-100':'bg-white text-gray-800'}`}>        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Webinar Ticket</h2>
          <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">Close</button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide opacity-60 mb-1">Webinar</p>
            <h3 className="font-semibold text-lg leading-snug">{webinar.title}</h3>
            {webinar.schedule && (
              <p className="text-sm mt-1 opacity-80">{new Date(webinar.schedule).toLocaleString()}</p>
            )}
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-3">
            <div>
              <p className="text-xs font-medium tracking-wider opacity-70">TICKET CODE</p>
              <p className="font-mono text-lg mt-1 select-all break-all">{ticket.code}</p>
            </div>
            {issuedDate && (
              <p className="text-xs opacity-60">Issued: {issuedDate.toLocaleString()}</p>
            )}
            <div className="flex gap-2">
              <button onClick={copyCode} className="flex-1 px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition">Copy Code</button>
              <button onClick={onClose} className={`px-3 py-2 rounded-md text-sm font-medium ${theme==='dark'?'bg-gray-700 hover:bg-gray-600':'bg-gray-200 hover:bg-gray-300'}`}>Done</button>
            </div>
          </div>
          <p className="text-xs opacity-60 leading-relaxed">Keep this code safe. You may need it for attendance verification or post-event resources.</p>
        </div>
      </div>
    </>
  );
};

export default TicketModal;