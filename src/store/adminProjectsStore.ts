import { normalizeProjectMedia } from '@/lib/mediaPath';
import { approveProject, deleteProject, getAdminProjects, rejectProject, requestProjectChanges } from '@/services/projectsService';
import type { Project, ProjectMeta } from '@/types/projectTypes';
import { create } from 'zustand';

interface AdminFilters {
	status?: string;
	search?: string; // local search across title/summary/team
	tag?: string;
	stack?: string;
	country?: string;
	page: number;
	limit: number;
}

interface AdminProjectsState {
	projects: Project[];
	meta?: ProjectMeta;
	loading: boolean;
	actionLoading: boolean;
	error: string | null;
	filters: AdminFilters;
	token?: string; // to be set from outside (auth store) if needed
	setToken: (t: string) => void;
	setFilters: (f: Partial<AdminFilters>) => void;
	resetFilters: () => void;
	fetch: () => Promise<void>;
	approve: (id: number, featured?: boolean) => Promise<void>;
	unfeature: (id: number) => Promise<void>; // toggles FEATURED -> APPROVED
	reject: (id: number, reason: string) => Promise<void>;
	requestChanges: (id: number, message: string) => Promise<void>;
	remove: (id: number) => Promise<void>;
	localSearchResults: () => Project[];
}

export const useAdminProjectsStore = create<AdminProjectsState>((set, get) => ({
	projects: [],
	meta: undefined,
	loading: false,
	actionLoading: false,
	error: null,
	filters: { page: 1, limit: 10 },
	setToken: (t) => set({ token: t }),
	setFilters: (f) => set(state => ({ filters: { ...state.filters, ...f, page: f.page ?? state.filters.page } })),
	resetFilters: () => set({ filters: { page: 1, limit: 10 } }),
	async fetch() {
		const { token, filters } = get();
		if (!token) { set({ error: 'Missing admin token' }); return; }
		set({ loading: true, error: null });
		try {
			const params: Record<string, any> = {};
			if (filters.status) params.status = filters.status;
			if (filters.tag) params.tag = filters.tag;
			if (filters.stack) params.stack = filters.stack;
			if (filters.country) params.country = filters.country;
			if (filters.search) params.search = filters.search; // server-side search
			params.page = filters.page;
			params.limit = filters.limit;
			const { data, meta } = await getAdminProjects(params, token);
			const normalized = data.map(p => normalizeProjectMedia(p));
			set({ projects: normalized, meta, loading: false });
		} catch (e: any) {
			set({ error: e.message || 'Failed to load admin projects', loading: false });
		}
	},
	async approve(id, featured) {
		const { token, projects } = get();
		if (!token) return;
		set({ actionLoading: true });
		try {
			const resp = await approveProject(id, featured, token);
			const updated: Project = resp.data;
			set({ projects: projects.map(p => p.id === id ? { ...p, status: updated.status, featuredAt: updated.featuredAt } : p), actionLoading: false });
		} catch (e: any) {
			set({ error: e.message || 'Approve failed', actionLoading: false });
		}
	},
	async unfeature(id) {
		// call approve with featured false
		await get().approve(id, false);
	},
	async reject(id, reason) {
		const { token, projects } = get();
		if (!token) return;
		set({ actionLoading: true });
		try {
			const resp = await rejectProject(id, reason, token);
			const updated: Project = resp.data;
			set({ projects: projects.map(p => p.id === id ? { ...p, status: updated.status, modNotes: updated.modNotes } : p), actionLoading: false });
		} catch (e: any) {
			set({ error: e.message || 'Reject failed', actionLoading: false });
		}
	},
	async requestChanges(id, message) {
		const { token, projects } = get();
		if (!token) return;
		set({ actionLoading: true });
		try {
			const resp = await requestProjectChanges(id, message, token);
			const updated: Project = resp.data;
			set({ projects: projects.map(p => p.id === id ? { ...p, status: updated.status, modNotes: updated.modNotes } : p), actionLoading: false });
		} catch (e: any) {
			set({ error: e.message || 'Request changes failed', actionLoading: false });
		}
	},
	async remove(id) {
		const { token, projects } = get();
		if (!token) return;
		set({ actionLoading: true });
		try {
			await deleteProject(id, token);
			set({ projects: projects.filter(p => p.id !== id), actionLoading: false });
		} catch (e: any) {
			set({ error: e.message || 'Delete failed', actionLoading: false });
		}
	},
	localSearchResults() {
		const { projects, filters } = get();
		if (!filters.search) return projects;
		const q = filters.search.toLowerCase();
		return projects.filter(p =>
			p.title.toLowerCase().includes(q) ||
			(p.summary?.toLowerCase().includes(q)) ||
			(p.teamName?.toLowerCase().includes(q))
		);
	}
}));

