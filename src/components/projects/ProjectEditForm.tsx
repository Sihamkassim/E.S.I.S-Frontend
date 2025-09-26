import React, { useState } from 'react';

export interface ProjectEditValues {
  title?: string;
  summary?: string;
  teamName?: string;
  description?: string;
  stack?: string | string[];
  country?: string;
  teamMembers?: string;
  demoLink?: string;
  repoLink?: string;
}

interface ProjectEditFormProps {
  initial: ProjectEditValues;
  onSubmit: (values: ProjectEditValues) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
}

// Small utility to convert stack array to comma string for input
const stackToString = (stack?: string | string[]) => {
  if (!stack) return '';
  if (Array.isArray(stack)) return stack.join(', ');
  return stack;
};

export const ProjectEditForm: React.FC<ProjectEditFormProps> = ({ initial, onSubmit, loading, error, onCancel }) => {
  const [form, setForm] = useState<ProjectEditValues>({
    ...initial,
    stack: stackToString(initial.stack),
  });

  const handleChange = (field: keyof ProjectEditValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.title || ''} onChange={e => handleChange('title', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.summary || ''} onChange={e => handleChange('summary', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team Name</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.teamName || ''} onChange={e => handleChange('teamName', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Team Members</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.teamMembers || ''} onChange={e => handleChange('teamMembers', e.target.value)} placeholder="Comma separated names" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Demo Link</label>
          <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.demoLink || ''} onChange={e => handleChange('demoLink', e.target.value)} placeholder="https://example.com/demo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Repository Link</label>
          <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.repoLink || ''} onChange={e => handleChange('repoLink', e.target.value)} placeholder="https://github.com/user/repo" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={4} value={form.description || ''} onChange={e => handleChange('description', e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.stack as string || ''} onChange={e => handleChange('stack', e.target.value)} placeholder="React, Node.js" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.country || ''} onChange={e => handleChange('country', e.target.value)} required />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  );
};

export default ProjectEditForm;