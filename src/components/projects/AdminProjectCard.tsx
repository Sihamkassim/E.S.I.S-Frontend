import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import type { Project } from '@/types/projectTypes';
import React, { useState } from 'react';

interface Props {
  project: Project;
  onOpenDetail?: (slug: string) => void;
}

const statusColors: Record<string,string> = {
  PENDING: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  SUBMITTED: 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-300',
  CHANGES_REQUESTED: 'bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-300',
  FEATURED: 'bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-300'
};

const AdminProjectCard: React.FC<Props> = ({ project, onOpenDetail }) => {
  const { approve, unfeature, reject, requestChanges, remove, actionLoading } = useAdminProjectsStore();
  const [showReject, setShowReject] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const canApprove = ['SUBMITTED','CHANGES_REQUESTED','PENDING','REJECTED'].includes(project.status);
  const canFeature = project.status === 'APPROVED';
  const canUnfeature = project.status === 'FEATURED';
  const canReject = ['SUBMITTED','PENDING','CHANGES_REQUESTED'].includes(project.status);
  const canRequestChanges = ['SUBMITTED','PENDING'].includes(project.status);

  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <img src={project.coverImage || '/placeholder-cover.jpg'} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base line-clamp-1">{project.title}</h3>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[project.status] || 'bg-gray-200'}`}>{project.status}</span>
            {project.featuredAt && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white">Featured</span>}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">{project.summary}</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {project.stack?.slice(0,4).map(s => <span key={s} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{s}</span>)}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-500 flex items-center gap-2">
            <span>Team: {project.teamName}</span>
            { (project as any).unresolvedFlagsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-300">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"/></svg>
                <span className="text-[9px] font-semibold">{(project as any).unresolvedFlagsCount}</span>
              </span>
            ) }
          </div>
          {project.modNotes && <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">Notes: {project.modNotes}</div>}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mt-auto">
        <button onClick={()=> onOpenDetail?.(project.slug)} className="px-2.5 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-medium">View</button>
        {canApprove && <button disabled={actionLoading} onClick={()=> approve(project.id, false)} className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-medium disabled:opacity-50">Approve</button>}
        {canFeature && <button disabled={actionLoading} onClick={()=> approve(project.id, true)} className="px-2.5 py-1 rounded-md bg-purple-600 text-white text-xs font-medium disabled:opacity-50">Feature</button>}
        {canUnfeature && <button disabled={actionLoading} onClick={()=> unfeature(project.id)} className="px-2.5 py-1 rounded-md bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-white text-xs font-medium disabled:opacity-50">Unfeature</button>}
        {canReject && <button disabled={actionLoading} onClick={()=> { setShowReject(true); setReason(''); }} className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-medium disabled:opacity-50">Reject</button>}
        {canRequestChanges && <button disabled={actionLoading} onClick={()=> { setShowChanges(true); setMessage(''); }} className="px-2.5 py-1 rounded-md bg-amber-500 text-white text-xs font-medium disabled:opacity-50">Request Changes</button>}
        <button disabled={actionLoading} onClick={()=> remove(project.id)} className="px-2.5 py-1 rounded-md bg-gray-300 dark:bg-gray-600 text-xs font-medium disabled:opacity-50">Delete</button>
      </div>

      {showReject && (
        <div className="mt-3 space-y-2">
          <textarea value={reason} onChange={e=> setReason(e.target.value)} placeholder="Reason for rejection" className="w-full text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
          <div className="flex gap-2">
            <button disabled={!reason || actionLoading} onClick={()=> { reject(project.id, reason); setShowReject(false); }} className="px-3 py-1.5 rounded bg-red-600 text-white text-xs disabled:opacity-50">Confirm Reject</button>
            <button onClick={()=> setShowReject(false)} className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">Cancel</button>
          </div>
        </div>
      )}
      {showChanges && (
        <div className="mt-3 space-y-2">
          <textarea value={message} onChange={e=> setMessage(e.target.value)} placeholder="Change request message" className="w-full text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
          <div className="flex gap-2">
            <button disabled={!message || actionLoading} onClick={()=> { requestChanges(project.id, message); setShowChanges(false); }} className="px-3 py-1.5 rounded bg-amber-500 text-white text-xs disabled:opacity-50">Send Request</button>
            <button onClick={()=> setShowChanges(false)} className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectCard;
