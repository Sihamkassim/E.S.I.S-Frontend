import React, { useState } from 'react';

export interface ProjectFormValues {
  title: string;
  summary: string;
  teamName: string;
  description: string;
  stack: string;
  country: string;
  teamMembers: string;
  demoLink: string;
  repoLink: string;
  media: File | null; // legacy single cover (optional)
  mediaFiles: File[]; // multiple media (images/videos)
  coverIndex?: number; // index into combined array (media as index 0 if present, then mediaFiles)
}

interface ProjectFormProps {
  initial?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues, reset: () => void) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

const empty: ProjectFormValues = {
  title: '', summary: '', teamName: '', description: '', stack: '', country: '', teamMembers: '', demoLink: '', repoLink: '', media: null, mediaFiles: [], coverIndex: 0
};

export const ProjectForm: React.FC<ProjectFormProps> = ({ initial = empty, onSubmit, loading, error }) => {
  const [form, setForm] = useState<ProjectFormValues>(initial);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof ProjectFormValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    // Client-side constraints
    const totalCount = (form.media ? 1 : 0) + form.mediaFiles.length;
    if (totalCount > 5) {
      setValidationError('Maximum of 5 media files (including cover) allowed.');
      return;
    }
    // Validate types & sizes
    const validateFile = (f: File) => {
      const isImage = f.type.startsWith('image/');
      const isVideo = f.type.startsWith('video/');
      if (!isImage && !isVideo) return `Unsupported file type: ${f.name}`;
      if (isImage && f.size > 10 * 1024 * 1024) return `Image too large (>10MB): ${f.name}`;
      if (isVideo && f.size > 100 * 1024 * 1024) return `Video too large (>100MB): ${f.name}`;
      if (isVideo && !['video/mp4', 'video/webm'].includes(f.type)) return `Unsupported video format (mp4/webm only): ${f.name}`;
      return null;
    };
    const filesToCheck: File[] = [];
    if (form.media) filesToCheck.push(form.media);
    filesToCheck.push(...form.mediaFiles);
    for (const f of filesToCheck) {
      const err = validateFile(f);
      if (err) { setValidationError(err); return; }
    }
    await onSubmit(form, () => setForm(empty));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.title} onChange={e => handleChange('title', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.summary} onChange={e => handleChange('summary', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team Name</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.teamName} onChange={e => handleChange('teamName', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team Members</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Comma separated names" value={form.teamMembers} onChange={e => handleChange('teamMembers', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Demo Link</label>
        <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="https://example.com/demo" value={form.demoLink} onChange={e => handleChange('demoLink', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Repository Link</label>
        <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="https://github.com/username/repo" value={form.repoLink} onChange={e => handleChange('repoLink', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Comma separated (e.g., React, Node.js, MongoDB)" value={form.stack} onChange={e => handleChange('stack', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.country} onChange={e => handleChange('country', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <input
          type="file"
          className="mt-1 block w-full"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0] || null;
            handleChange('media', file);
            if (file) handleChange('coverIndex', 0);
          }}
        />
      </div>
      <div>
  <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Additional Media (Images / Videos)</span>
          <span className="text-xs text-gray-400">You can select multiple</span>
        </label>
        <input
          type="file"
          multiple
          className="mt-1 block w-full"
          accept="image/*,video/*"
          onChange={e => {
            const arr = e.target.files ? Array.from(e.target.files) : [];
            // Enforce max 5 with cover
            const allowed = 5 - (form.media ? 1 : 0);
            const trimmed = arr.slice(0, allowed);
            handleChange('mediaFiles', trimmed);
          }}
        />
        {form.mediaFiles.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {form.mediaFiles.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              const url = URL.createObjectURL(file);
              const overallIndex = (form.media ? 1 : 0) + idx; // if cover exists it's index 0
              return (
                <div key={idx} className="relative group border rounded overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                  {isImage ? (
                    <img src={url} alt={file.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-[10px] p-2 text-center text-gray-600">
                      <span className="block font-medium">Video</span>
                      <span className="truncate block max-w-[60px]">{file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleChange('coverIndex', overallIndex + (form.media ? 0 : 0))}
                    className={`absolute bottom-1 left-1 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white ${form.coverIndex === (overallIndex + (form.media ? 0 : 0)) ? 'ring-2 ring-white' : ''}`}
                  >Cover</button>
                  <button
                    type="button"
                    onClick={() => handleChange('mediaFiles', form.mediaFiles.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove file"
                  >×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {validationError && <div className="text-red-500 text-sm">{validationError}</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md" disabled={loading}>{loading ? 'Saving...' : 'Create Project'}</button>
      </div>
    </form>
  );
};

export default ProjectForm;
