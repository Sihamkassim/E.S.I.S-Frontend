import type { Project } from '@/types/projectTypes';
import React, { useState } from 'react';
import MediaLightbox from './MediaLightbox';

interface ProjectCardProps {
  project: Project;
  onEdit: (p: Project) => void;
  onSubmit: (p: Project) => void;
  onDelete?: (p: Project) => void; // real delete now (restricted)
  canDelete?: boolean; // computed outside based on role/status
}

const statusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600';
    case 'REJECTED': return 'text-red-600';
    case 'SUBMITTED': return 'text-yellow-600';
    case 'CHANGES_REQUESTED': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

const buildMediaUrl = (url?: string) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url; // already absolute
  const rawBase = import.meta.env.VITE_API_BASE_URL || '';
  let base = rawBase.replace(/\/$/, '');
  // If base ends with /api or /api/v1 and the path starts with /uploads, strip the api segment
  if (url.startsWith('/uploads')) {
    base = base.replace(/\/api(?:\/v\d+)?$/, '');
  }
  if (url.startsWith('/')) return base + url;
  return base + '/' + url;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onSubmit, onDelete, canDelete }) => {
  const editable = project.status === 'PENDING' || project.status === 'CHANGES_REQUESTED';
  const cover = buildMediaUrl(project.coverImage || project.media?.[0]?.url);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mediaItems = (project.media || []).map(m => ({ id: m.id, url: buildMediaUrl(m.url)!, type: m.type.toLowerCase() }));
  return (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-full flex flex-col bg-white dark:bg-gray-900 shadow-sm">
      {/* Cover / header */}
      {cover && (
        <button
          type="button"
          onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          className="mb-3 -mt-1 -mx-1 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        >
          <img
            src={cover}
            alt={project.title}
            className="w-full h-40 object-cover rounded-md"
            loading="lazy"
          />
        </button>
      )}
      {project.media && project.media.length > 1 && (
        <div className="mb-3 -mt-2 -mx-1 grid grid-cols-4 gap-1">
          {project.media.slice(1,5).map(m => {
            const mUrl = buildMediaUrl(m.url);
            const isVideo = m.type.startsWith('video');
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => { const idx = project.media!.findIndex(x => x.id === m.id); setLightboxIndex(idx); setLightboxOpen(true); }}
                className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isVideo ? (
                  <div className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">Video</div>
                ) : (
                  <img src={mUrl} alt={m.type} className="object-cover w-full h-full" loading="lazy" />
                )}
              </button>
            );
          })}
          {project.media.length > 5 && (
            <div className="aspect-video relative bg-gray-200 rounded flex items-center justify-center text-[11px] font-medium text-gray-700">+{project.media.length - 5} more</div>
          )}
        </div>
      )}
      <div className="flex-1 space-y-2">
  <h3 className="text-lg font-semibold leading-snug break-words text-gray-900 dark:text-gray-100">{project.title}</h3>
  <p className="text-xs text-gray-500 dark:text-gray-400">Slug: {project.slug}</p>
  <p className="text-sm text-gray-700 dark:text-gray-300">{project.summary}</p>
  <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
          <span><span className="font-medium">Team:</span> {project.teamName}</span>
          {project.country && <span><span className="font-medium">Country:</span> {project.country}</span>}
          <span><span className="font-medium">Status:</span> <span className={statusColor(project.status)}>{project.status}</span></span>
        </div>
        {project.stack && project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {project.stack.map(s => (
              <span key={s} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {project.tags.map(t => (
              <span key={t.tag.slug} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs px-2 py-0.5 rounded-md">#{t.tag.name}</span>
            ))}
          </div>
        )}
  <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5 mt-2">
          <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
          {project.featuredAt && <p>Featured: {new Date(project.featuredAt).toLocaleDateString()}</p>}
          {project.submittedAt && <p>Submitted: {new Date(project.submittedAt).toLocaleDateString()}</p>}
        </div>
        {project.status === 'CHANGES_REQUESTED' && (
          <div className="mt-2 text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 px-2 py-1 rounded">
            Changes Requested{project.modNotes ? ': ' + project.modNotes : ''}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium overflow-hidden">
            {project.user?.profile?.avatarUrl ? (
              <img src={project.user.profile.avatarUrl} alt={project.user.profile.name} className="w-full h-full object-cover" />
            ) : (
              <span>{project.user?.profile?.name?.slice(0,2).toUpperCase()}</span>
            )}
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            <p className="font-medium leading-tight">{project.user?.profile?.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Owner</p>
          </div>
        </div>
      </div>
      {editable && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <button className="text-blue-600 dark:text-blue-400 hover:underline" onClick={() => onEdit(project)}>Edit</button>
          <button className="text-green-600 dark:text-green-400 hover:underline" onClick={() => onSubmit(project)}>
            {project.status === 'CHANGES_REQUESTED' ? 'Resubmit' : 'Submit'}
          </button>
          {onDelete && canDelete && (
            <button className="text-red-600 dark:text-red-400 hover:underline" onClick={() => onDelete(project)}>Delete</button>
          )}
        </div>
      )}
      {lightboxOpen && mediaItems.length > 0 && (
        <MediaLightbox
          items={mediaItems}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
};

export default ProjectCard;
