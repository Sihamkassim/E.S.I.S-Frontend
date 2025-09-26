import AdminProjectCard from '@/components/projects/AdminProjectCard';
import AdminProjectDetailModal from '@/components/projects/AdminProjectDetailModal';
import AdminProjectFilters from '@/components/projects/AdminProjectFilters';
import { Spinner } from '@/components/Spinner';
import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import React, { useEffect, useState } from 'react';

const AdminProjects: React.FC = () => {
  const { projects, meta, loading, error, fetch, setToken, filters, setFilters, localSearchResults } = useAdminProjectsStore();
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (token) {
      setToken(token);
      fetch();
    }
  }, [setToken, fetch, filters.page, filters.status]);

  const list = localSearchResults();

  const handlePageChange = (page: number) => {
    setFilters({ page });
    fetch();
  };

  const start = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Admin Projects Moderation</h1>
        {meta && meta.total > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of <span className="font-medium">{meta.total}</span>
          </div>
        )}
      </div>
      <AdminProjectFilters />
      {error && (
        <div className="mb-4 rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm">{error}</div>
      )}
      {loading ? (
        <div className="py-20 flex justify-center"><Spinner /></div>
      ) : list.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-500">No projects found.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map(p => (
            <AdminProjectCard key={p.id} project={p} onOpenDetail={() => setDetailId(p.id)} />
          ))}
        </div>
      )}
      {meta && meta.pages > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map(pg => (
            <button key={pg} onClick={()=> handlePageChange(pg)} className={`px-3 py-1.5 rounded-md text-sm font-medium min-w-[44px] ${filters.page === pg ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>{pg}</button>
          ))}
        </div>
      )}

  <AdminProjectDetailModal id={detailId} onClose={()=> setDetailId(null)} />
    </div>
  );
};

export default AdminProjects;
