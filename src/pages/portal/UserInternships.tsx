import React, { useEffect, useMemo, useState } from 'react';
import ApplicationForm from '../../components/internships/ApplicationForm';
import ApplicationStatusModal from '../../components/internships/ApplicationStatusModal';
import { useTheme } from '../../hooks/useTheme';
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
  <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col gap-4 transition-colors" aria-labelledby={`int-${position.id}-title`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-center flex-wrap">
          {position.status === 'PUBLISHED' && !application && <StatusBadge status="New" />}
          {application && <StatusBadge status={application.status} />}
          {position.status === 'CLOSED' && <StatusBadge status="Closed" />}
          {isDraftPosition && <StatusBadge status="Draft" />}
          <h3 id={`int-${position.id}-title`} className="font-semibold text-base leading-snug text-slate-800 dark:text-slate-100">{position.title}</h3>
        </div>
  <div className="text-[13px] text-slate-600 dark:text-slate-400 font-medium flex flex-col items-end">
          {deadline && <span>Deadline: {deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
          {dateRange && <span className="text-[10px] text-slate-400">{dateRange}</span>}
        </div>
      </div>

  <div className="flex flex-wrap gap-2 text-xs">
        {position.isRemote && <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded">Remote</span>}
        {!position.isRemote && position.location && <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded">{position.location}</span>}
        {position.isPaid && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded">Paid</span>}
        {position.stipendAmount != null && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">${position.stipendAmount}</span>}
        {position.maxApplicants && <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">Max {position.maxApplicants}</span>}
        {position.department && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">{position.department}</span>}
        {application && <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded">You applied</span>}
      </div>

      {description && (
  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {truncatedDesc}
        </p>
      )}
      {requirements && (
  <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-medium text-slate-600 dark:text-slate-300">Requirements:</span> {truncatedReq}</p>
      )}
      {responsibilities && (
  <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-medium text-slate-600 dark:text-slate-300">Responsibilities:</span> {truncatedResp}</p>
      )}
      {(description.length > 140 || requirements.length > 100 || responsibilities.length > 120) && (
  <button onClick={() => setOpen(o => !o)} className="self-start text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
          {open ? 'Show less' : 'Show more'}
        </button>
      )}

  <div className="mt-1 flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
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
            className={`text-sm border rounded-md px-4 py-2 font-medium transition ${position.status !== 'PUBLISHED' ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400'}`}
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

  const { theme } = useTheme();
  const [view, setView] = useState<'grid'|'list'>('grid');
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedPositions = filtered.slice((page-1)*pageSize, page*pageSize);
  // Applications pagination
  const [appPage, setAppPage] = useState(1);
  const appPageSize = 4;
  const totalAppPages = Math.ceil(applications.length / appPageSize);
  const paginatedApps = applications.slice((appPage-1)*appPageSize, appPage*appPageSize);

  return (
    <div className={`p-6 space-y-10 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
      <div>
        <h1 className="text-2xl font-bold">Internships</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your internships</p>
        {/* Toolbar under heading */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {/* View toggle icons */}
            <button
              type="button"
              aria-label="List view"
              onClick={()=>setView('list')}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-md border text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${view==='list' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white hover:bg-blue-600/90' : ''}`}
            >
              {/* List Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Grid view"
              onClick={()=>setView('grid')}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-md border text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${view==='grid' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white hover:bg-blue-600/90' : ''}`}
            >
              {/* Grid Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search role"
              value={search}
              onChange={e => {setPage(1); setSearch(e.target.value);}}
              className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <select className="border border-slate-200 dark:border-slate-700 rounded px-2 py-2 text-sm dark:bg-slate-800 dark:text-slate-100">
              <option>Deadline</option>
              <option value="latest">Latest</option>
              <option value="soonest">Soonest</option>
            </select>
          </div>
        </div>
      </div>

      <section className="space-y-4">
  <h2 className="text-xl font-semibold tracking-tight">All Positions</h2>
        <div className={view==='grid' ? 'grid gap-4 md:grid-cols-2' : 'flex flex-col gap-4'}>
          {(loadingPositions || loadingApplications) && positions.length === 0 && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded" />)}
            </div>
          )}
          {!loadingPositions && paginatedPositions.map(p => (
            <InternshipCard
              key={p.id}
              position={p}
              application={appByPosition[p.id]}
              onApply={handleApply}
            />
          ))}
          {!loadingPositions && paginatedPositions.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No internships found.</div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center mt-4">
            <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-2 py-1 border rounded disabled:opacity-50 border-slate-200 dark:border-slate-700">Prev</button>
            {Array.from({length:totalPages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)} className={`px-2 py-1 border rounded border-slate-200 dark:border-slate-700 ${page===i+1?'bg-blue-600 text-white dark:bg-blue-500':''}`}>{i+1}</button>
            ))}
            <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-2 py-1 border rounded disabled:opacity-50 border-slate-200 dark:border-slate-700">Next</button>
          </div>
        )}
      </section>

      <section className="space-y-4">
  <h2 className="text-xl font-semibold tracking-tight">My Applications</h2>
        <div className="grid gap-4">
          {applications.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-400 py-4">You haven't started any applications yet.</div>}
          {paginatedApps.map(app => {
            const pos = app.internshipId ? positions.find(p => p.id === app.internshipId) : undefined;
            return (
              <div key={app.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 flex flex-col gap-3 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    <StatusBadge status={app.status} />
                    <h3 className="font-medium text-base leading-snug">{pos?.title || 'General Application'}</h3>
                  </div>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{pos?.department || pos?.location || ''}</div>
                <div className="flex gap-2 mt-2">
                  {app.status === 'Draft' && (
                    <button onClick={() => setActiveAppId(app.id)} className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Continue</button>
                  )}
                  {app.status !== 'Draft' && (
                    <button onClick={() => setActiveStatusAppId(app.id)} className="text-sm px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/40">View status</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Applications pagination */}
        {totalAppPages > 1 && (
          <div className="flex gap-2 justify-center mt-4">
            <button disabled={appPage===1} onClick={()=>setAppPage(appPage-1)} className="px-2 py-1 border rounded disabled:opacity-50 border-slate-200 dark:border-slate-700">Prev</button>
            {Array.from({length:totalAppPages}).map((_,i)=>(
              <button key={i} onClick={()=>setAppPage(i+1)} className={`px-2 py-1 border rounded border-slate-200 dark:border-slate-700 ${appPage===i+1?'bg-blue-600 text-white dark:bg-blue-500':''}`}>{i+1}</button>
            ))}
            <button disabled={appPage===totalAppPages} onClick={()=>setAppPage(appPage+1)} className="px-2 py-1 border rounded disabled:opacity-50 border-slate-200 dark:border-slate-700">Next</button>
          </div>
        )}
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
