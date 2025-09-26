import type { Project } from '@/types/projectTypes';
import React from 'react';

interface Props {
  project: Project;
  onClick?: (p: Project) => void;
  priority?: boolean;
}

const FeaturedProjectCard: React.FC<Props> = ({ project, onClick }) => {
  const cover = project.coverImage || '/placeholder-cover.jpg';
  return (
    <button
      aria-label={`Open project ${project.title}`}
      onClick={() => onClick?.(project)}
      className="group relative w-full overflow-hidden rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/40 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 opacity-90 group-hover:opacity-95 transition-opacity" />
      <img
        src={cover}
        alt={project.title}
        className="h-72 w-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/90 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Featured
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-white/85 text-sm line-clamp-2 mb-3 max-w-prose">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack?.slice(0,4).map(st => (
            <span key={st} className="bg-white/15 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur border border-white/20">
              {st}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

export default FeaturedProjectCard;
