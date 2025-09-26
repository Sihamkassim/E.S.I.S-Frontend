import { normalizeProjectMedia } from '@/lib/mediaPath';
import { getAdminProjectById } from '@/services/projectsService';
import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import type { Project } from '@/types/projectTypes';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Props { id: number | null; onClose: () => void; }

// NOTE: Admin view uses already-fetched project list (includes all statuses) so we look it up locally.
// If not found (e.g. pagination mismatch), we could optionally fetch a single detail endpoint (not implemented yet).

const AdminProjectDetailModal: React.FC<Props> = ({ id, onClose }) => {
  const { projects, token } = useAdminProjectsStore();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const cachedProject: Project | undefined = projects.find(p => p.id === id);
  const [loadedProject, setLoadedProject] = useState<Project | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const project: Project | undefined = loadedProject || cachedProject;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Build a combined media array: cover first (if exists) followed by media entries.
  const combinedMedia = useMemo(() => {
    if (!project) return [] as { id?: number; url: string; type: string }[];
    const items: { id?: number; url: string; type: string }[] = [];
    if (project.coverImage) items.push({ url: project.coverImage, type: 'image', id: -1 });
    if (project.media && project.media.length) items.push(...project.media.map(m => ({ id: m.id, url: m.url, type: m.type })));
    return items;
  }, [project]);

  useEffect(() => {
    // Reset active index when project changes
    setActiveIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (id && closeBtnRef.current) {
      setTimeout(()=> closeBtnRef.current?.focus(), 30);
    }
  }, [id]);

  // Fetch full detail (with media) if not present or media missing.
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!id || !token) return;
      if (loadedProject && loadedProject.id === id) return;
      if (cachedProject && cachedProject.media && cachedProject.media.length > 0) return;
      try {
        setDetailLoading(true); setDetailError(null);
  const full = await getAdminProjectById(id, token);
  const normalized = normalizeProjectMedia(full);
  if (!ignore) setLoadedProject(normalized as Project);
      } catch (e: any) {
        if (!ignore) setDetailError(e.message || 'Failed to load project detail');
      } finally {
        if (!ignore) setDetailLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [id, token, cachedProject, loadedProject]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        else if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close project details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!project && !detailLoading ? (
          <div className="flex h-80 w-full items-center justify-center p-6 text-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Project not found in current list. It may be on another page or was removed.</p>
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">Close</button>
            </div>
          </div>
        ) : detailLoading ? (
          <div className="flex h-80 w-full items-center justify-center p-6">
            <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">Loading project details...</div>
          </div>
        ) : detailError ? (
          <div className="flex h-80 w-full items-center justify-center p-6 text-center">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{detailError}</p>
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">Close</button>
            </div>
          </div>
        ) : (
          // At this branch project is defined (not in loading/error/missing states)
          (() => { const proj = project!; return (
          <div className="flex flex-col md:flex-row">
            {/* Media Column */}
            <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col">
              <div className="relative group bg-black/5 dark:bg-white/5 aspect-video w-full overflow-hidden">
                {combinedMedia.length > 0 ? (
                  combinedMedia[activeIndex]?.type.startsWith('video') ? (
                    <video
                      key={combinedMedia[activeIndex].url}
                      src={combinedMedia[activeIndex].url}
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <img
                      src={combinedMedia[activeIndex].url}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">No media</div>
                )}
                {proj.status === 'FEATURED' && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-400/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-900 shadow">Featured</span>
                )}
                <span className="absolute bottom-3 left-3 text-[10px] font-medium px-2 py-0.5 bg-black/50 text-white rounded-full">{proj.status}</span>
              </div>
              {combinedMedia.length > 1 && (
                <div className="flex gap-2 overflow-x-auto px-3 py-3 bg-gray-50 dark:bg-gray-800/40 scrollbar-thin">
                  {combinedMedia.map((m, idx) => (
                    <button
                      key={m.id ?? idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden ring-1 ring-inset ${idx === activeIndex ? 'ring-blue-500' : 'ring-gray-300 dark:ring-gray-700'} group`}
                      aria-label={`Show media ${idx + 1}`}
                    >
                      {m.type.startsWith('video') ? (
                        <div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-white/80">Video</div>
                      ) : (
                        <img src={m.url} alt="thumb" className="object-cover w-full h-full" />
                      )}
                      {idx === 0 && proj.coverImage && (
                        <span className="absolute top-1 left-1 bg-black/60 text-[9px] px-1.5 py-0.5 rounded text-white">Cover</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Details Column */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col min-h-[32rem]">
              <h2 className="text-xl md:text-2xl font-bold mb-2 dark:text-white break-words leading-snug">{proj.title}</h2>
              {proj.summary && <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 break-words leading-relaxed">{proj.summary}</p>}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-gray-600 dark:text-gray-400 mb-4">
                <div><span className="font-medium text-gray-500 dark:text-gray-300">Team:</span> <span className="break-words">{proj.teamName}</span></div>
                {proj.teamMembers && <div className="col-span-2 text-[11px]"><span className="font-medium text-gray-500 dark:text-gray-300">Members:</span> {proj.teamMembers}</div>}
                {proj.country && <div><span className="font-medium text-gray-500 dark:text-gray-300">Country:</span> {proj.country}</div>}
                {proj.submittedAt && <div><span className="font-medium text-gray-500 dark:text-gray-300">Submitted:</span> {new Date(proj.submittedAt).toLocaleDateString()}</div>}
                <div><span className="font-medium text-gray-500 dark:text-gray-300">Created:</span> {new Date(proj.createdAt).toLocaleDateString()}</div>
                {proj.featuredAt && <div><span className="font-medium text-gray-500 dark:text-gray-300">Featured:</span> {new Date(proj.featuredAt).toLocaleDateString()}</div>}
              </div>
              {proj.stack && proj.stack.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.stack.map(st => <span key={st} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded max-w-[110px] truncate" title={st}>{st}</span>)}
                  </div>
                </div>
              )}
              {proj.tags && proj.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {proj.tags.slice(0,20).map(t => <span key={t.tag.slug} className="text-[10px] uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">{t.tag.name}</span>)}
                  </div>
                </div>
              )}
              {(proj.demoLink || proj.repoLink) && (
                <div className="mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Links</h3>
                  <div className="flex flex-wrap gap-3 text-[11px]">
                    {proj.demoLink && <a href={proj.demoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">Demo</a>}
                    {proj.repoLink && <a href={proj.repoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">Repo</a>}
                  </div>
                </div>
              )}
              {proj.description && (
                <div className="mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line break-words leading-relaxed max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {proj.description}
                  </div>
                </div>
              )}
              {proj.modNotes && <div className="text-[11px] text-amber-600 dark:text-amber-400 mb-4 break-words">Moderator Notes: {proj.modNotes}</div>}
              <div className="mt-auto pt-2">
                <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">Close</button>
              </div>
            </div>
          </div>
          )})()
        )}
      </div>
    </div>
  );
};

export default AdminProjectDetailModal;
