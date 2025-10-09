import type { Project, ProjectMeta } from '@/types/projectTypes';
import axios from 'axios';
import { api } from './api';

const API_BASE_USER = `${import.meta.env.VITE_API_BASE_URL}/user`;
const API_BASE_PUBLIC = `${import.meta.env.VITE_API_BASE_URL}/public/projects`;
const ADMIN_API_BASE = `${import.meta.env.VITE_API_BASE_URL}/admin/projects`;
const USER_PROJECTS_BASE = `${import.meta.env.VITE_API_BASE_URL}/user/projects`;

// User: create project with form-data (requires Bearer token)
export async function createProjectForm(data: FormData, token: string, onProgress?: (pct: number) => void) {
	const response = await api.post(`/user/projects/form`, data, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
		onUploadProgress: (evt) => {
			if (onProgress && evt.total) {
				const pct = Math.round((evt.loaded / evt.total) * 100);
				onProgress(pct);
			}
		}
	});
	return response.data;
}

// User: get my projects
export async function getMyProjects(token: string) {
	const response = await api.get<{ data: Project[] }>(`/user/projects/me`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}

// User: update existing project (JSON body)
export async function updateProject(id: number, data: Partial<Pick<Project, 'title' | 'summary' | 'teamName' | 'description' | 'teamMembers' | 'demoLink' | 'repoLink' | 'country'>> & { stack?: string[] }, token: string) {
	const response = await axios.patch(`${USER_PROJECTS_BASE}/${id}`, data, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data as Project;
}

// User: add a single media (after getting it hosted somehow) - currently expects already accessible url
export async function addProjectMedia(id: number, media: { url: string; type?: 'IMAGE' | 'VIDEO' }, token: string) {
	const response = await axios.post(`${USER_PROJECTS_BASE}/${id}/media`, media, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}

// User: set cover image explicitly
export async function setProjectCover(id: number, mediaId: number, token: string) {
	const response = await axios.patch(`${USER_PROJECTS_BASE}/${id}/cover`, { mediaId }, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data as Project;
}

// User: delete specific media
export async function deleteProjectMedia(id: number, mediaId: number, token: string) {
	await axios.delete(`${USER_PROJECTS_BASE}/${id}/media/${mediaId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}

// User: upload additional media files (multipart)
export async function uploadProjectMedia(id: number, files: File[], token: string, onProgress?: (pct: number) => void) {
	const fd = new FormData();
	files.forEach(f => fd.append('media', f));
	const response = await axios.post(`${USER_PROJECTS_BASE}/${id}/media/upload`, fd, {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
		onUploadProgress: evt => {
			if (onProgress && evt.total) {
				onProgress(Math.round((evt.loaded / evt.total) * 100));
			}
		}
	});
	return response.data;
}

// User: submit a draft project
export async function submitProject(id: number, token: string) {
	return axios.post(`${USER_PROJECTS_BASE}/${id}/submit`, {}, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
}

// User/Admin: delete project (permission rules enforced server-side)
export async function deleteProject(id: number, token: string) {
	await axios.delete(`${USER_PROJECTS_BASE}/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
}
// Admin: get all projects
export async function getAdminProjects(params: Record<string, any> = {}, token: string) {
	const response = await api.get<{ data: Project[]; meta?: ProjectMeta }>(`/admin/projects`,
		{
			params,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	return response.data;
}

// Admin: get single project by slug (includes media if backend supports it)
// Admin: attempt admin slug endpoint else fallback to public slug (with auth) to retrieve media
export async function getAdminProjectBySlug(slug: string, token: string) {
	try {
		// If later an admin detail endpoint is added, prefer it here.
		// Currently no /admin/projects/slug/:slug route exists, so this will 404.
		const adminResp = await axios.get<Project>(`${ADMIN_API_BASE}/slug/${slug}`, {
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
		});
		return adminResp.data;
	} catch (e: any) {
		// Fallback: use public detail which already includes media + restrictions (admin auth bypasses restriction)
		const pubResp = await axios.get<Project>(`${API_BASE_PUBLIC}/${slug}`, {
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
		});
		return pubResp.data;
	}
}

export async function getAdminProjectById(id: number, token: string) {
	const response = await axios.get<Project>(`${ADMIN_API_BASE}/${id}`, {
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
	});
	return response.data;
}

// Admin: approve / feature project (featured true -> FEATURED, false -> APPROVED)
export async function approveProject(id: number, featured: boolean | undefined, token: string) {
	return api.post(`/admin/projects/${id}/approve`, { featured }, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
}

// Admin: reject project (requires token)
export async function rejectProject(id: number, reason: string, token: string) {
	return axios.post(`${ADMIN_API_BASE}/${id}/reject`, { reason }, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
}

// Admin: request changes (requires token)
export async function requestProjectChanges(id: number, message: string, token: string) {
	return axios.post(`${ADMIN_API_BASE}/${id}/request-changes`, { message }, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
}

export interface GetProjectsParams {
	tag?: string;
	team?: string;
	stack?: string;
	country?: string;
	page?: number;
	limit?: number;
}

export async function getProjects(params: GetProjectsParams = {}) {
	const response = await axios.get<{ data: Project[]; meta: ProjectMeta }>(API_BASE_PUBLIC, { params });
	return response.data;
}

// Public: get project detail by slug (includes media & full info per backend include)
export async function getProjectBySlug(slug: string) {
	const response = await axios.get(`${API_BASE_PUBLIC}/${slug}`);
	return response.data as Project & { media?: any[] };
}
