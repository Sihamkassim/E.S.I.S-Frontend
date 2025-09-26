import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import type { Project } from '@/types/projectTypes';
import React, { useState } from 'react';

interface Props {
  project: Project;
  onOpenDetail?: (id: number) => void;
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
    <div className="flex flex-col w-full rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="w-full mb-4">
        <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={project.coverImage || '/placeholder-cover.jpg'} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-2 mb-4">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="relative pr-4 max-w-full">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg leading-snug break-words hyphens-auto">
                {project.title}
              </h3>
              <span className="absolute top-0 right-0 text-[10px] text-gray-400">#{project.id}</span>
            </div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[project.status] || 'bg-gray-200'}`}>{project.status}</span>
            {project.featuredAt && <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-600 text-white">Featured</span>}
            {(project as any).unresolvedFlagsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-300 text-[11px]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"/></svg>
                {(project as any).unresolvedFlagsCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug line-clamp-3 break-words">{project.summary || 'No summary provided.'}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.stack?.slice(0,8).map(s => <span key={s} className="text-[11px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded max-w-[120px] truncate" title={s}>{s}</span>)}
          </div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400 space-y-0.5">
            <div className="flex flex-wrap gap-x-1">
              <span className="font-medium text-gray-500 dark:text-gray-300">Team:</span>
              <span className="break-words">{project.teamName}</span>
            </div>
            {project.country && (
              <div className="flex flex-wrap gap-x-1">
                <span className="font-medium text-gray-500 dark:text-gray-300">Country:</span>
                <span>{project.country}</span>
              </div>
            )}
            {project.submittedAt && (
              <div className="flex flex-wrap gap-x-1">
                <span className="font-medium text-gray-500 dark:text-gray-300">Submitted:</span>
                <span>{new Date(project.submittedAt).toLocaleDateString()}</span>
              </div>
            )}
            {project.featuredAt && (
              <div className="flex flex-wrap gap-x-1">
                <span className="font-medium text-gray-500 dark:text-gray-300">Featured:</span>
                <span>{new Date(project.featuredAt).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-1">
              <span className="font-medium text-gray-500 dark:text-gray-300">Status:</span>
              <span>{project.status}</span>
            </div>
            <div className="flex flex-wrap gap-x-1">
              <span className="font-medium text-gray-500 dark:text-gray-300">Created:</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.tags.slice(0,6).map(t => <span key={t.tag.slug} className="text-[10px] uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded max-w-[110px] truncate" title={t.tag.name}>{t.tag.name}</span>)}
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2 text-[11px]">
            {project.demoLink && <a href={project.demoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">Demo</a>}
            {project.repoLink && <a href={project.repoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">Repo</a>}
          </div>
          {project.modNotes && <div className="text-[11px] text-amber-600 dark:text-amber-400 pt-1 break-words">Notes: {project.modNotes}</div>}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
  <button onClick={()=> onOpenDetail?.(project.id)} className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-medium">View</button>
        {canApprove && <button disabled={actionLoading} onClick={()=> approve(project.id, false)} className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium disabled:opacity-50">Approve</button>}
        {canFeature && <button disabled={actionLoading} onClick={()=> approve(project.id, true)} className="px-3 py-1.5 rounded-md bg-purple-600 text-white text-xs font-medium disabled:opacity-50">Feature</button>}
        {canUnfeature && <button disabled={actionLoading} onClick={()=> unfeature(project.id)} className="px-3 py-1.5 rounded-md bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-white text-xs font-medium disabled:opacity-50">Unfeature</button>}
        {canReject && <button disabled={actionLoading} onClick={()=> { setShowReject(true); setReason(''); }} className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium disabled:opacity-50">Reject</button>}
        {canRequestChanges && <button disabled={actionLoading} onClick={()=> { setShowChanges(true); setMessage(''); }} className="px-3 py-1.5 rounded-md bg-amber-500 text-white text-xs font-medium disabled:opacity-50">Request Changes</button>}
        <button disabled={actionLoading} onClick={()=> remove(project.id)} className="px-3 py-1.5 rounded-md bg-gray-300 dark:bg-gray-600 text-xs font-medium disabled:opacity-50">Delete</button>
      </div>

      {showReject && (
        <div className="mt-4 space-y-2">
          <textarea value={reason} onChange={e=> setReason(e.target.value)} placeholder="Reason for rejection" className="w-full text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
          <div className="flex gap-2">
            <button disabled={!reason || actionLoading} onClick={()=> { reject(project.id, reason); setShowReject(false); }} className="px-3 py-1.5 rounded bg-red-600 text-white text-xs disabled:opacity-50">Confirm Reject</button>
            <button onClick={()=> setShowReject(false)} className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">Cancel</button>
          </div>
        </div>
      )}
      {showChanges && (
        <div className="mt-4 space-y-2">
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
