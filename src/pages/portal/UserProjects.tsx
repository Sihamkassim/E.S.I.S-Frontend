import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectEditForm } from '@/components/projects/ProjectEditForm';
import { ProjectForm, ProjectFormValues } from '@/components/projects/ProjectForm';
import { addProjectMedia } from '@/services/projectsService';
import { useProjectStore } from '@/store/projectStore';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Project } from '../../types/projectTypes';

const UserProjects: React.FC = () => {
  // Tabs: drafts, submitted, approved, add
  const [tab, setTab] = useState<'drafts' | 'submitted' | 'approved' | 'add'>('drafts');

  // Projects hook
  const {
    projects, listLoading: loading, listError: error,
    create: createProj, createLoading, createError,
    update: updateProj, updateLoading, updateError,
    remove: removeProject, setCover, removeMedia, uploadMedia,
    mediaActionLoading, mediaActionError, refresh, submitDraft
  } = useProjectStore();

  // Added: initial fetch (hook used to auto-load before migration)
  useEffect(() => {
    refresh();
  }, [refresh]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  // Flag removed for own projects

  // Status groupings aligned with backend enum
  const editable = useMemo(() => projects.filter(p => p.status === 'PENDING' || p.status === 'CHANGES_REQUESTED'), [projects]);
  const submitted = useMemo(() => projects.filter(p => p.status === 'SUBMITTED'), [projects]);
  const approved = useMemo(() => projects.filter(p => p.status === 'APPROVED' || p.status === 'FEATURED'), [projects]);

  const handleCreateSubmit = async (values: ProjectFormValues, reset: () => void) => {
  const ok = await createProj(values);
    if (ok) {
  toast.success('Project created (status: PENDING)');
      reset();
      setTab('drafts');
    } else {
      toast.error('Failed to create project');
    }
  };

  const handleSubmitProject = async () => {
    if (!selectedProject) return;
    try {
    const ok = await submitDraft(selectedProject.id);
    if (!ok) throw new Error('Submit failed');
      toast.success('Project submitted for review');
  setShowSubmitModal(false);
  await refresh();
      // Simple refresh by forcing tab filter to re-run (hook auto refresh if we chose; else could call refresh via useProjects) 
      // For now rely on backend reflecting new status on next view; optionally add local optimistic update:
      // optimistic update
      // (Skipping: depends on backend returning new status)
    } catch (e:any) {
      toast.error(e.response?.data?.message || e.message || 'Failed to submit project');
    }
  };

  return (
  <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
  <h1 className="text-3xl font-bold mb-4 dark:text-gray-100">My Projects</h1>
        <div className="flex flex-wrap gap-2">
          {(['drafts','submitted','approved','add'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${tab===t ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
            >
              {t === 'drafts' && 'Drafts'}
              {t === 'submitted' && 'Submitted'}
              {t === 'approved' && 'Approved'}
              {t === 'add' && '+ Add Project'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab !== 'add' && (
        <div>
          {loading && <div>Loading...</div>}
          {error && !loading && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(tab === 'drafts' ? editable : tab === 'submitted' ? submitted : approved).map(project => {
                const canDelete = (project.status !== 'APPROVED' && project.status !== 'FEATURED');
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={(p) => { setSelectedProject(p); setShowEditModal(true); }}
                    onSubmit={(p) => { setSelectedProject(p); setShowSubmitModal(true); }}
                    onDelete={tab === 'drafts' ? async (p) => {
                      if (!canDelete) { toast.error('Cannot delete approved/featured project'); return; }
                      if (!confirm('Delete this project permanently? This cannot be undone.')) return;
                      try {
                        await removeProject(p.id);
                        toast.success('Project deleted');
                      } catch (e:any) {
                        toast.error(e.response?.data?.message || e.message || 'Failed to delete project');
                      }
                    } : undefined}
                    canDelete={canDelete}
                  />
                );
              })}
              { (tab === 'drafts' && editable.length === 0) && <div className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No editable projects yet.</div> }
              { (tab === 'submitted' && submitted.length === 0) && <div className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No submitted projects yet.</div> }
              { (tab === 'approved' && approved.length === 0) && <div className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No approved projects yet.</div> }
            </div>
          )}
        </div>
      )}

      {tab === 'add' && (
        <div className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Create New Project</h2>
            <ProjectForm
              onSubmit={handleCreateSubmit}
              loading={createLoading}
              error={createError}
            />
        </div>
      )}

      {/* (Removed create project modal in favor of Add tab) */}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-2 sm:p-4 overflow-y-auto z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-full max-w-3xl p-4 sm:p-6 relative animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold dark:text-gray-100">Edit Project</h2>
              <button
                onClick={() => { setShowEditModal(false); setSelectedProject(null); }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Close edit modal"
              >×</button>
            </div>
            {/* Existing media & cover selection (client-only cover change visual) */}
            {selectedProject.media && selectedProject.media.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Media</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  {selectedProject.media.slice(0,5).map((m, idx) => {
                    const isVideo = m.type.toLowerCase().startsWith('video');
                    const isCover = (selectedProject.coverImage && selectedProject.coverImage === m.url) || (!selectedProject.coverImage && idx === 0);
                    return (
                      <div key={m.id} className={`relative group border border-gray-200 dark:border-gray-700 rounded overflow-hidden aspect-video bg-gray-50 dark:bg-gray-800 min-w-[140px] snap-start ${isCover ? 'ring-2 ring-blue-500' : ''}`}>
                        {isVideo ? (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-300">Video</div>
                        ) : (
                          <img src={m.url.startsWith('http') ? m.url : (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')?.replace(/\/api(?:\/v\d+)?$/, '') + m.url)} alt={m.type} className="object-cover w-full h-full" />
                        )}
                        <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                          <button
                            type="button"
                            disabled={isCover || mediaActionLoading}
                            className={`text-[10px] px-2 py-0.5 rounded-full ${isCover ? 'bg-blue-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'} disabled:opacity-50`}
                            onClick={async () => {
                              const ok = await setCover(selectedProject.id, m.id);
                              if (ok) toast.success('Cover updated'); else toast.error('Failed to set cover');
                            }}
                          >{isCover ? 'Cover' : 'Set'}</button>
                          <button
                            type="button"
                            disabled={mediaActionLoading}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            onClick={async () => {
                              if (!confirm('Delete this media item?')) return;
                              const ok = await removeMedia(selectedProject.id, m.id);
                              if (ok) toast.success('Media deleted'); else toast.error('Failed to delete');
                            }}
                          >Del</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedProject.media.length > 5 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Showing first 5 media items (max enforced on create).</p>
                )}
              </div>
            )}
            {mediaActionError && <p className="text-xs text-red-600 mb-2">{mediaActionError}</p>}
            <UploadMoreMedia projectId={selectedProject.id} disabled={mediaActionLoading || (selectedProject.media?.length || 0) >= 5} onUploaded={async () => { await refresh(); toast.success('Media uploaded'); }} onUpload={(files, setPct) => uploadMedia(selectedProject.id, files, setPct)} currentCount={selectedProject.media?.length || 0} />
            {/* Add extra media (URL-based) */}
            <AddMediaInline projectId={selectedProject.id} onAdded={async () => { await refresh(); toast.success('Media added'); }} maxReached={(selectedProject.media?.length || 0) >= 5} />
            <ProjectEditForm
              initial={{
                title: selectedProject.title,
                summary: selectedProject.summary,
                teamName: selectedProject.teamName,
                description: selectedProject.description,
                stack: selectedProject.stack || [],
                country: selectedProject.country,
                teamMembers: selectedProject.teamMembers,
                demoLink: selectedProject.demoLink,
                repoLink: selectedProject.repoLink,
              }}
              loading={updateLoading}
              error={updateError}
              onCancel={() => { setShowEditModal(false); setSelectedProject(null); }}
              onSubmit={async (vals) => {
                const payload = { ...vals, stack: Array.isArray(vals.stack) ? vals.stack.join(', ') : vals.stack } as any;
                const ok = await updateProj(selectedProject.id, payload);
                if (ok) {
                  toast.success('Project updated');
                  setShowEditModal(false);
                  setSelectedProject(null);
                } else {
                  toast.error('Failed to update project');
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Submit Project</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to submit this project for review?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
                onClick={handleSubmitProject}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag functionality removed */}
    </div>
  );
};

export default UserProjects;

// Inline component to add media by URL (since backend route expects url + type already stored)
const AddMediaInline: React.FC<{ projectId: number; onAdded: () => void; maxReached: boolean }> = ({ projectId, onAdded, maxReached }) => {
  const [url, setUrl] = React.useState('');
  const [type, setType] = React.useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [loading, setLoading] = React.useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (maxReached) {
    return <p className="text-xs text-gray-500 mb-4">Maximum of 5 media items reached.</p>;
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { toast.error('Not authenticated'); return; }
    if (!url.trim()) { toast.error('Provide a media URL'); return; }
    // naive validation
    const isVideo = /(mp4|webm|mov)$/i.test(url.split('?')[0]);
    const finalType = type === 'VIDEO' || isVideo ? 'VIDEO' : 'IMAGE';
    setLoading(true);
    try {
      await addProjectMedia(projectId, { url, type: finalType }, token);
      setUrl('');
      await onAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="mb-6 space-y-2 bg-gray-50 border border-gray-200 rounded-md p-3">
      <p className="text-xs font-medium text-gray-700">Add Extra Media (URL)</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          placeholder="https://.../image-or-video"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
          aria-label="Media URL"
        />
        <select value={type} onChange={e => setType(e.target.value as any)} className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-32" aria-label="Media type">
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
        </select>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-60 whitespace-nowrap">{loading ? 'Adding...' : 'Add'}</button>
      </div>
      <p className="text-[10px] text-gray-500">Provide a direct URL to an already uploaded file. Upload pipeline not included here.</p>
    </form>
  );
};

// Component to upload new files (multipart) using new backend endpoint
const UploadMoreMedia: React.FC<{
  projectId: number;
  disabled: boolean;
  onUploaded: () => Promise<void> | void;
  onUpload: (files: File[], setPct: (n: number) => void) => Promise<boolean> | boolean;
  currentCount: number;
}> = ({ projectId, disabled, onUploaded, onUpload, currentCount }) => {
  const [progress, setProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const remaining = 5 - currentCount;
  if (remaining <= 0) return null;
  return (
    <div className="mb-6 border border-dashed border-gray-300 rounded-md p-3 space-y-2 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-700">Upload More Media (max {remaining} left)</p>
        {busy && <span className="text-[10px] text-gray-500">{progress}%</span>}
      </div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        disabled={disabled || busy}
        onChange={async e => {
          const files = e.target.files ? Array.from(e.target.files).slice(0, remaining) : [];
            if (files.length === 0) return;
            setBusy(true); setProgress(0);
            const ok = await onUpload(files, setProgress);
            if (ok) await onUploaded();
            setBusy(false);
            e.target.value = '';
        }}
        className="block w-full text-xs"
      />
      {busy && (
        <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="text-[10px] text-gray-500">Large videos up to 100MB; images up to 10MB (same limits as create).</p>
    </div>
  );
};