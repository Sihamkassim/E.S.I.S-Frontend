import {
	addProjectMedia,
	deleteProject as apiDeleteProject,
	updateProject as apiUpdateProject,
	createProjectForm,
	deleteProjectMedia,
	getMyProjects,
	setProjectCover,
	submitProject,
	uploadProjectMedia
} from '@/services/projectsService';
import { create } from 'zustand';
import type { Project, ProjectMeta } from '../types/projectTypes';

// Shape for values used in create form
export interface CreateProjectValues {
	title: string; summary: string; teamName: string; description: string; stack: string; country: string; teamMembers: string; demoLink: string; repoLink: string; media: File | null; mediaFiles?: File[]; coverIndex?: number;
}

interface ProjectStore {
	// Data
	projects: Project[];
	meta: ProjectMeta | null; // currently not used for /me but retained for consistency
	// Selection / UI
	selectedProject: Project | null;
	// Loading flags
	listLoading: boolean;
	createLoading: boolean;
	updateLoading: boolean;
	mediaActionLoading: boolean;
	// Progress
	uploadProgress: number;
	// Errors
	listError: string | null;
	createError: string | null;
	updateError: string | null;
	mediaActionError: string | null;
	// Actions
	fetchMy: () => Promise<void>;
	refresh: () => Promise<void>;
	setSelected: (p: Project | null) => void;
	create: (values: CreateProjectValues) => Promise<boolean>;
	update: (id: number, values: Partial<CreateProjectValues>) => Promise<boolean>;
	remove: (id: number) => Promise<boolean>;
	setCover: (projectId: number, mediaId: number) => Promise<boolean>;
	removeMedia: (projectId: number, mediaId: number) => Promise<boolean>;
	uploadMedia: (projectId: number, files: File[], onProgress?: (pct: number)=>void) => Promise<boolean>;
	addMediaUrl: (projectId: number, payload: { url: string; type?: 'IMAGE' | 'VIDEO' }) => Promise<boolean>;
	submitDraft: (projectId: number) => Promise<boolean>;
}

function getToken() {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('token');
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
	projects: [],
	meta: null,
	selectedProject: null,
	listLoading: false,
	createLoading: false,
	updateLoading: false,
	mediaActionLoading: false,
	uploadProgress: 0,
	listError: null,
	createError: null,
	updateError: null,
	mediaActionError: null,
	setSelected: (p) => set({ selectedProject: p }),
	fetchMy: async () => {
		const token = getToken(); if (!token) return;
		set({ listLoading: true, listError: null });
		try {
			const res = await getMyProjects(token);
			set({ projects: Array.isArray(res.data) ? res.data : [] });
		} catch (e:any) {
			set({ listError: e.response?.data?.message || e.message || 'Failed to load projects', projects: [] });
		} finally { set({ listLoading: false }); }
	},
	refresh: async () => { await get().fetchMy(); },
	create: async (values) => {
		const token = getToken(); if (!token) { set({ createError: 'Not authenticated' }); return false; }
		set({ createLoading: true, createError: null, uploadProgress: 0 });
		try {
			const fd = new FormData();
			Object.entries(values).forEach(([k, v]) => {
				if (v === undefined || v === null || v === '') return;
				if (k === 'media' && v instanceof File) { fd.append('media', v); return; }
				if (k === 'mediaFiles' && Array.isArray(v)) { v.forEach(f => f instanceof File && fd.append('media', f)); return; }
				if (k === 'stack') { fd.append('stack', JSON.stringify(String(v).split(',').map(s=>s.trim()).filter(Boolean))); return; }
				if (k === 'coverIndex') { fd.append('coverIndex', String(v)); return; }
				if (k !== 'media' && k !== 'mediaFiles') fd.append(k, String(v));
			});
			await createProjectForm(fd, token, pct => set({ uploadProgress: pct }));
			await get().refresh();
			return true;
		} catch (e:any) {
			set({ createError: e.response?.data?.message || e.message || 'Failed to create project' });
			return false;
		} finally { set({ createLoading: false }); }
	},
	update: async (id, values) => {
		const token = getToken(); if (!token) { set({ updateError: 'Not authenticated' }); return false; }
		set({ updateLoading: true, updateError: null });
		try {
			const payload: any = { ...values };
			if (payload.stack && typeof payload.stack === 'string') {
				payload.stack = payload.stack.split(',').map((s:string)=>s.trim()).filter(Boolean);
			}
			await apiUpdateProject(id, payload, token);
			await get().refresh();
			return true;
		} catch (e:any) {
			set({ updateError: e.response?.data?.message || e.message || 'Failed to update project' });
			return false;
		} finally { set({ updateLoading: false }); }
	},
	remove: async (id) => {
		const token = getToken(); if (!token) return false;
		// optimistic
		const prev = get().projects;
		set({ projects: prev.filter(p => p.id !== id) });
		try { await apiDeleteProject(id, token); return true; }
		catch (e) { await get().refresh(); return false; }
	},
	setCover: async (projectId, mediaId) => {
		const token = getToken(); if (!token) return false;
		set({ mediaActionLoading: true, mediaActionError: null });
		try { await setProjectCover(projectId, mediaId, token); await get().refresh(); return true; }
		catch (e:any) { set({ mediaActionError: e.response?.data?.message || e.message || 'Failed to set cover' }); return false; }
		finally { set({ mediaActionLoading: false }); }
	},
	removeMedia: async (projectId, mediaId) => {
		const token = getToken(); if (!token) return false;
		set({ mediaActionLoading: true, mediaActionError: null });
		try { await deleteProjectMedia(projectId, mediaId, token); await get().refresh(); return true; }
		catch (e:any) { set({ mediaActionError: e.response?.data?.message || e.message || 'Failed to delete media' }); return false; }
		finally { set({ mediaActionLoading: false }); }
	},
	uploadMedia: async (projectId, files, onProgress) => {
		const token = getToken(); if (!token) return false;
		set({ mediaActionLoading: true, mediaActionError: null });
		try { await uploadProjectMedia(projectId, files, token, pct => { onProgress?.(pct); }); await get().refresh(); return true; }
		catch (e:any) { set({ mediaActionError: e.response?.data?.message || e.message || 'Failed to upload media' }); return false; }
		finally { set({ mediaActionLoading: false }); }
	},
	addMediaUrl: async (projectId, payload) => {
		const token = getToken(); if (!token) return false;
		set({ mediaActionLoading: true, mediaActionError: null });
		try { await addProjectMedia(projectId, payload, token); await get().refresh(); return true; }
		catch (e:any) { set({ mediaActionError: e.response?.data?.message || e.message || 'Failed to add media' }); return false; }
		finally { set({ mediaActionLoading: false }); }
	},
	submitDraft: async (projectId) => {
		const token = getToken(); if (!token) return false;
		try { await submitProject(projectId, token); await get().refresh(); return true; }
		catch { return false; }
	}
}));
