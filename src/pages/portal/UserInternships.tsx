import React, { useEffect, useMemo, useState } from 'react';
import ApplicationForm from '../../components/internships/ApplicationForm';
import ApplicationStatusModal from '../../components/internships/ApplicationStatusModal';
import { InternshipApplication, InternshipPosition } from '../../services/internshipService';
import { useInternshipStore } from '../../store/internshipStore';

// Simple badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    New: 'bg-yellow-100 text-yellow-700',
    Draft: 'bg-gray-100 text-gray-600',
    Submitted: 'bg-blue-100 text-blue-600',
    InReview: 'bg-green-100 text-green-600',
    Interview: 'bg-indigo-100 text-indigo-600',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
    Closed: 'bg-red-100 text-red-600'
  };
  const cls = map[status] || 'bg-slate-100 text-slate-600';
  return <span className={`text-xs font-medium px-2 py-1 rounded ${cls}`}>{status}</span>;
};

interface CardProps { position: InternshipPosition; application?: InternshipApplication; onApply: (position: InternshipPosition) => void; }

const InternshipCard: React.FC<CardProps> = ({ position, application, onApply }) => {
  const [open, setOpen] = useState(false);
  const deadline = position.endDate ? new Date(position.endDate) : null;
  const dateRange = [position.startDate, position.endDate]
    .filter(Boolean)
    .map(d => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '')
    .join(' – ');
  const description = position.description || '';
  const requirements = position.requirements || '';
  const responsibilities = position.responsibilities || '';
  const truncatedDesc = description.length > 140 && !open ? description.slice(0, 140) + '…' : description;
  const truncatedReq = requirements.length > 100 && !open ? requirements.slice(0, 100) + '…' : requirements;
  const truncatedResp = responsibilities.length > 120 && !open ? responsibilities.slice(0, 120) + '…' : responsibilities;
  const isDraftPosition = position.status === 'DRAFT';
  return (
    <article className="bg-white border rounded-lg p-5 shadow-sm flex flex-col gap-3" aria-labelledby={`int-${position.id}-title`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-center flex-wrap">
          {position.status === 'PUBLISHED' && !application && <StatusBadge status="New" />}
          {application && <StatusBadge status={application.status} />}
          {position.status === 'CLOSED' && <StatusBadge status="Closed" />}
          {isDraftPosition && <StatusBadge status="Draft" />}
          <h3 id={`int-${position.id}-title`} className="font-semibold text-sm">{position.title}</h3>
        </div>
        <div className="text-xs text-slate-600 font-medium flex flex-col items-end">
          {deadline && <span>Deadline: {deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
          {dateRange && <span className="text-[10px] text-slate-400">{dateRange}</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        {position.isRemote && <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded">Remote</span>}
        {!position.isRemote && position.location && <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded">{position.location}</span>}
        {position.isPaid && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded">Paid</span>}
        {position.stipendAmount != null && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">${position.stipendAmount}</span>}
        {position.maxApplicants && <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">Max {position.maxApplicants}</span>}
        {position.department && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">{position.department}</span>}
        {application && <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded">You applied</span>}
      </div>

      {description && (
        <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">
          {truncatedDesc}
        </p>
      )}
      {requirements && (
        <p className="text-[11px] text-slate-500"><span className="font-medium text-slate-600">Requirements:</span> {truncatedReq}</p>
      )}
      {responsibilities && (
        <p className="text-[11px] text-slate-500"><span className="font-medium text-slate-600">Responsibilities:</span> {truncatedResp}</p>
      )}
      {(description.length > 140 || requirements.length > 100 || responsibilities.length > 120) && (
        <button onClick={() => setOpen(o => !o)} className="self-start text-[11px] text-blue-600 hover:underline">
          {open ? 'Show less' : 'Show more'}
        </button>
      )}

      <div className="mt-1 flex justify-between items-center pt-2 border-t">
        {application ? (
          <button
            onClick={() => onApply(position)}
            className="text-xs text-blue-600 hover:underline"
            aria-label={application.status === 'Draft' ? 'Continue application draft' : 'View application'}
          >
            {application.status === 'Draft' ? 'Continue application' : 'View application'}
          </button>
        ) : (
          <button
            disabled={position.status !== 'PUBLISHED'}
            onClick={() => onApply(position)}
            className={`text-xs border rounded px-3 py-1 font-medium transition ${position.status !== 'PUBLISHED' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            aria-disabled={position.status !== 'PUBLISHED'}
            aria-label={position.status !== 'PUBLISHED' ? 'Position not open for applications' : 'Apply for this internship'}
          >
            {position.status !== 'PUBLISHED' ? 'Not open' : 'Apply now'}
          </button>
        )}
      </div>
    </article>
  );
};

const UserInternships: React.FC = () => {
  const { positions, applications, fetchPositions, fetchApplications, createDraft, loadingPositions, loadingApplications, error } = useInternshipStore();
  const [search, setSearch] = useState('');
  const [creatingFor, setCreatingFor] = useState<number | null>(null);
  const [activeAppId, setActiveAppId] = useState<number | null>(null);
  const [activeStatusAppId, setActiveStatusAppId] = useState<number | null>(null);
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    fetchPositions();
    fetchApplications();
  }, [fetchPositions, fetchApplications]);

  useEffect(() => { if (toast) { const t = setTimeout(()=> setToast(''), 3000); return () => clearTimeout(t); }}, [toast]);

  const appByPosition = useMemo(() => {
    const map: Record<number, InternshipApplication> = {} as any;
    applications.forEach(a => { if (a.internshipId) map[a.internshipId] = a; });
    return map;
  }, [applications]);

  const filtered = useMemo(() => positions.filter(p => p.title.toLowerCase().includes(search.toLowerCase())), [positions, search]);

  const handleApply = async (pos: InternshipPosition) => {
    const existing = appByPosition[pos.id];
    if (existing) {
      if (existing.status === 'Draft') {
        setActiveAppId(existing.id);
        setToast('You already started a draft for this position.');
      } else {
        setActiveStatusAppId(existing.id); // open status modal instead of edit
        setToast('You already applied to this position.');
      }
      return;
    }
    setCreatingFor(pos.id);
    const draft = await createDraft({ internshipId: pos.id });
    setCreatingFor(null);
    if (draft) {
      setToast('Draft created. Complete and submit your application.');
      setActiveAppId(draft.id);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Internships</h1>
          <p className="text-sm text-slate-500">Browse open positions and manage your applications</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search role"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border rounded px-2 py-2 text-sm">
            <option>Deadline</option>
            <option value="latest">Latest</option>
            <option value="soonest">Soonest</option>
          </select>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">All Positions</h2>
        <div className="grid gap-4">
          {(loadingPositions || loadingApplications) && positions.length === 0 && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded" />)}
            </div>
          )}
          {!loadingPositions && filtered.map(p => (
            <InternshipCard
              key={p.id}
              position={p}
              application={appByPosition[p.id]}
              onApply={handleApply}
            />
          ))}
          {!loadingPositions && filtered.length === 0 && (
            <div className="text-sm text-slate-500 py-6 text-center">No internships found.</div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">My Applications</h2>
        <div className="grid gap-4">
          {applications.length === 0 && <div className="text-sm text-slate-500 py-4">You haven't started any applications yet.</div>}
          {applications.map(app => {
            const pos = app.internshipId ? positions.find(p => p.id === app.internshipId) : undefined;
            return (
              <div key={app.id} className="border rounded-lg p-4 bg-white flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    <StatusBadge status={app.status} />
                    <h3 className="font-medium text-sm">{pos?.title || 'General Application'}</h3>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-slate-500">{pos?.department || pos?.location || ''}</div>
                <div className="flex gap-2 mt-2">
                  {app.status === 'Draft' && (
                    <button onClick={() => setActiveAppId(app.id)} className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Continue</button>
                  )}
                  {app.status !== 'Draft' && (
                    <button onClick={() => setActiveStatusAppId(app.id)} className="text-xs px-3 py-1 rounded border">View status</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {toast && <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded text-sm shadow">{toast}</div>}
      {creatingFor && <div className="fixed inset-0 bg-black/20 flex items-center justify-center text-white text-sm">Creating draft...</div>}
      {activeAppId && (
        <ApplicationForm
          application={applications.find(a => a.id === activeAppId)!}
          onClose={() => setActiveAppId(null)}
        />
      )}
      {activeStatusAppId && (
        <ApplicationStatusModal
          application={applications.find(a => a.id === activeStatusAppId)!}
          onClose={() => setActiveStatusAppId(null)}
        />
      )}
    </div>
  );
};

export default UserInternships;
