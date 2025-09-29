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
    <div className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 p-8 relative transition-colors">
        <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100 tracking-tight">Application Status</h2>
        <div className="mb-5">
          <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">{status}</span>
        </div>
        <p className="text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">{statusDescriptions[status] || 'Status update not available.'}</p>
        {status === 'Draft' && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/30 rounded-md p-3 mb-6 leading-snug">This application is incomplete. Open it to finish and submit.</div>
        )}
        <div className="flex justify-end gap-3">
          {status === 'Draft' && (
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition">Close</button>
          )}
          {status !== 'Draft' && (
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">Done</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusModal;
