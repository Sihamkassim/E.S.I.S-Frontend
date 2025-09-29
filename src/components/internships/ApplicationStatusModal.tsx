import { X } from 'lucide-react';
import React from 'react';
import { InternshipApplication } from '../../services/internshipService';

interface Props { application: InternshipApplication; onClose: () => void; }

const statusDescriptions: Record<string, string> = {
  Submitted: 'Your application was submitted and is awaiting review.',
  InReview: 'Your application is currently being reviewed by the team.',
  Interview: 'You have been shortlisted for an interview. Expect further communication.',
  Accepted: 'Congratulations! You have been accepted. You will receive onboarding details soon.',
  Rejected: 'Thank you for applying. You were not selected this time.',
  Draft: 'This application is still a draft. Complete and submit it to be considered.'
};

const ApplicationStatusModal: React.FC<Props> = ({ application, onClose }) => {
  const status = application.status;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold mb-2">Application Status</h2>
        <div className="mb-4">
          {/* <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600 mr-2">ID #{application.id}</span> */}
          <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">{status}</span>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{statusDescriptions[status] || 'Status update not available.'}</p>
        {status === 'Draft' && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-4">This application is incomplete. Open it to finish and submit.</div>
        )}
        <div className="flex justify-end gap-2">
          {status === 'Draft' && (
            <button onClick={onClose} className="px-4 py-2 text-sm rounded border">Close</button>
          )}
          {status !== 'Draft' && (
            <button onClick={onClose} className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">Done</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;
