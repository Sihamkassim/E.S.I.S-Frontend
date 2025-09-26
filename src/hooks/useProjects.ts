import { deleteProject as apiDeleteProject, updateProject as apiUpdateProject, createProjectForm, deleteProjectMedia, getMyProjects, setProjectCover, uploadProjectMedia } from '@/services/projectsService';
import type { Project } from '@/types/projectTypes';
import { useCallback, useEffect, useState } from 'react';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [locallyDeleted, setLocallyDeleted] = useState<Set<number>>(new Set());
  const [mediaActionLoading, setMediaActionLoading] = useState(false);
  const [mediaActionError, setMediaActionError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProjects(token);
      const incoming = Array.isArray(res.data) ? res.data : [];
      setProjects(incoming.filter(p => !locallyDeleted.has(p.id)));
    } catch (err: any) {
      setProjects([]);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (values: {
    title: string; summary: string; teamName: string; description: string; stack: string; country: string; teamMembers: string; demoLink: string; repoLink: string; media: File | null; mediaFiles?: File[]; coverIndex?: number;
  }) => {
    if (!token) throw new Error('User not authenticated. Please login again.');
    setCreateLoading(true);
    setCreateError(null);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') return;
        if (k === 'media' && v instanceof File) {
          formData.append('media', v);
          return;
        }
        if (k === 'mediaFiles' && Array.isArray(v)) {
          v.forEach(file => { if (file instanceof File) formData.append('media', file); });
          return;
        }
        if (k === 'stack') {
          const arr = String(v)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          formData.append('stack', JSON.stringify(arr));
          return;
        }
        if (k === 'coverIndex') {
          formData.append('coverIndex', String(v));
          return;
        }
        if (k !== 'media' && k !== 'mediaFiles') {
          formData.append(k, String(v));
        }
      });
      await createProjectForm(formData, token, (pct) => setUploadProgress(pct));
      await refresh();
      return true;
    } catch (err: any) {
      setCreateError(err.response?.data?.message || err.message || 'Failed to create project');
      return false;
    } finally {
      setCreateLoading(false);
    }
  }, [token, refresh]);

  const update = useCallback(async (id: number, values: {
    title?: string; summary?: string; teamName?: string; description?: string; stack?: string; country?: string; teamMembers?: string; demoLink?: string; repoLink?: string;
  }) => {
    if (!token) throw new Error('User not authenticated. Please login again.');
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const payload: any = { ...values };
      if (payload.stack && typeof payload.stack === 'string') {
        payload.stack = payload.stack.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      await apiUpdateProject(id, payload, token);
      await refresh();
      return true;
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update project');
      return false;
    } finally {
      setUpdateLoading(false);
    }
  }, [token, refresh]);

  const setCover = useCallback(async (projectId: number, mediaId: number) => {
    if (!token) throw new Error('User not authenticated.');
    setMediaActionLoading(true); setMediaActionError(null);
    try {
      await setProjectCover(projectId, mediaId, token);
      await refresh();
      return true;
    } catch (err: any) {
      setMediaActionError(err.response?.data?.message || err.message || 'Failed to set cover');
      return false;
    } finally { setMediaActionLoading(false); }
  }, [token, refresh]);

  const removeMedia = useCallback(async (projectId: number, mediaId: number) => {
    if (!token) throw new Error('User not authenticated.');
    setMediaActionLoading(true); setMediaActionError(null);
    try {
      await deleteProjectMedia(projectId, mediaId, token);
      await refresh();
      return true;
    } catch (err: any) {
      setMediaActionError(err.response?.data?.message || err.message || 'Failed to delete media');
      return false;
    } finally { setMediaActionLoading(false); }
  }, [token, refresh]);

  const uploadMedia = useCallback(async (projectId: number, files: File[], onProgress?: (pct: number)=>void) => {
    if (!token) throw new Error('User not authenticated.');
    setMediaActionLoading(true); setMediaActionError(null);
    try {
      await uploadProjectMedia(projectId, files, token, onProgress);
      await refresh();
      return true;
    } catch (err: any) {
      setMediaActionError(err.response?.data?.message || err.message || 'Failed to upload media');
      return false;
    } finally { setMediaActionLoading(false); }
  }, [token, refresh]);

  const removeProject = useCallback(async (id: number) => {
    if (!token) throw new Error('User not authenticated.');
    // optimistic removal
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await apiDeleteProject(id, token);
      return true;
    } catch (err) {
      // revert on failure by re-fetching
      await refresh();
      throw err;
    }
  }, [token, refresh]);

  return { projects, loading, error, refresh, create, createLoading, createError, uploadProgress, update, updateLoading, updateError, removeProject, setCover, removeMedia, uploadMedia, mediaActionLoading, mediaActionError };
}
