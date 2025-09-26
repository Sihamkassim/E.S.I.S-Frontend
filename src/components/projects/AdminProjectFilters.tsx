import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import React, { useState } from 'react';

const statuses = ['PENDING','SUBMITTED','CHANGES_REQUESTED','APPROVED','FEATURED','REJECTED'];

const AdminProjectFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, fetch, loading } = useAdminProjectsStore();
  const [local, setLocal] = useState({
    status: filters.status || '',
    search: filters.search || '',
    tag: filters.tag || '',
    stack: filters.stack || '',
    country: filters.country || ''
  });

  const apply = () => {
    setFilters({ ...local, status: local.status || undefined, page: 1 });
    fetch();
  };

  const clear = () => {
    resetFilters();
    setLocal({ status: '', search: '', tag: '', stack: '', country: '' });
    fetch();
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 shadow-sm mb-6">
      <div className="grid md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600 dark:text-gray-300">Search</label>
          <input value={local.search} onChange={e=> setLocal(l=>({...l, search:e.target.value}))} placeholder="Title, team, summary" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600 dark:text-gray-300">Status</label>
          <select value={local.status} onChange={e=> setLocal(l=>({...l,status:e.target.value}))} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm">
            <option value="">All</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600 dark:text-gray-300">Tag</label>
          <input value={local.tag} onChange={e=> setLocal(l=>({...l, tag:e.target.value}))} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600 dark:text-gray-300">Stack</label>
          <input value={local.stack} onChange={e=> setLocal(l=>({...l, stack:e.target.value}))} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600 dark:text-gray-300">Country</label>
          <input value={local.country} onChange={e=> setLocal(l=>({...l, country:e.target.value}))} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button disabled={loading} onClick={apply} className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50">Apply</button>
        <button disabled={loading} onClick={clear} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium disabled:opacity-50">Reset</button>
      </div>
    </div>
  );
};

export default AdminProjectFilters;
