import { normalizeProjectMedia } from '@/lib/mediaPath';
import { getProjectBySlug, getProjects as getPublicProjects } from '@/services/projectsService';
import type { Project, ProjectMeta } from '@/types/projectTypes';
import { create } from 'zustand';

interface PublicProjectsState {
  projects: Project[];
  featured: Project[];
  meta?: ProjectMeta;
  loading: boolean;
  error: string | null;
  selected?: (Project & { media?: any[] }) | null;
  detailLoading: boolean;
  fetch: (params?: Record<string, any>) => Promise<void>;
  fetchDetail: (slug: string) => Promise<void>;
  clearSelected: () => void;
}

export const usePublicProjectsStore = create<PublicProjectsState>((set, get) => ({
  projects: [],
  featured: [],
  meta: undefined,
  loading: false,
  error: null,
  selected: null,
  detailLoading: false,
  async fetch(params = {}) {
    set({ loading: true, error: null });
    try {
  const { data, meta } = await getPublicProjects(params);
  const normalized = data.map(p => normalizeProjectMedia(p));
  const featured = normalized.filter(p => p.status === 'FEATURED');
  set({ projects: normalized, featured, meta, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load projects', loading: false });
    }
  },
  async fetchDetail(slug: string) {
    // If already selected same slug, skip
    if (get().selected?.slug === slug) return;
    set({ detailLoading: true, error: null });
    try {
  const detail = normalizeProjectMedia(await getProjectBySlug(slug));
  set({ selected: detail, detailLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load project', detailLoading: false });
    }
  },
  clearSelected() { set({ selected: null }); },
}));
