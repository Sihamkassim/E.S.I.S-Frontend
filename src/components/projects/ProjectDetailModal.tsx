import { usePublicProjectsStore } from '@/store/publicProjectsStore';
import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '../Spinner';
import MediaLightbox from './MediaLightbox';

interface Props {
  slug: string | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<Props> = ({ slug, onClose }) => {
  const { selected, fetchDetail, detailLoading, clearSelected } = usePublicProjectsStore();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (slug) fetchDetail(slug);
  }, [slug, fetchDetail]);

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
        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handler);
    // initial focus
    setTimeout(()=> closeBtnRef.current?.focus(), 30);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (!slug) {
      clearSelected();
    }
  }, [slug, clearSelected]);

  if (!slug) return null;

  const media = (selected as any)?.media || [];

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close project details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {detailLoading || !selected ? (
          <div className="flex h-96 w-full items-center justify-center"><Spinner /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative group">
              <img
                src={selected.coverImage || '/placeholder-cover.jpg'}
                alt={selected.title}
                className="h-72 md:h-full w-full object-cover object-center"
              />
              {selected.status === 'FEATURED' && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-amber-400/90 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 shadow">
                  Featured
                </span>
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3 dark:text-white">{selected.title}</h2>
              {selected.summary && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line leading-relaxed">{selected.summary}</p>
              )}
              {selected.description && (
                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  <h3 className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase">Description</h3>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">{selected.description}</p>
                </div>
              )}
              {(selected.teamMembers || selected.teamName) && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Team</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{selected.teamName}</span>
                    {selected.teamMembers && selected.teamMembers.trim() && (
                      <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">Members: {selected.teamMembers}</span>
                    )}
                  </p>
                </div>
              )}
              {(selected.demoLink || selected.repoLink) && (
                <div className="flex gap-3 mb-6 flex-wrap">
                  {selected.demoLink && (
                    <a href={selected.demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-200 text-xs font-medium hover:bg-primary/20 transition">
                      Live Demo
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" /></svg>
                    </a>
                  )}
                  {selected.repoLink && (
                    <a href={selected.repoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100 text-xs font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition">
                      Source Code
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" /></svg>
                    </a>
                  )}
                </div>
              )}
              {selected.stack && selected.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.stack.map(st => (
                    <span key={st} className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-200 text-xs font-medium px-2.5 py-1 rounded-full">
                      {st}
                    </span>
                  ))}
                </div>
              )}
              {selected.country && (
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">{selected.country}</div>
              )}
              <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">Published {new Date(selected.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Media Gallery</h3>
              {media.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No media available.</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {media.map((m: any, idx: number) => {
                    const isVideo = m.type === 'VIDEO' || (m.url && m.url.match(/\.mp4|\.webm$/));
                    return (
                      <button
                        key={m.id || idx}
                        onClick={() => setLightboxIndex(idx)}
                        className="relative group aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {isVideo ? (
                          <video
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            src={m.url}
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={m.url}
                            alt={selected.title + ' media'}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        )}
                        <span className="absolute inset-0 ring-0 ring-primary/0 group-hover:ring-4 group-hover:ring-primary/30 transition-all" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {lightboxIndex !== null && selected && (
        <MediaLightbox
          items={media.map((m:any)=>({ url: m.url, type: m.type }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i)=> setLightboxIndex(i)}
        />
      )}
    </div>
  );
};

export default ProjectDetailModal;
