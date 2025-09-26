import AdminProjectCard from '@/components/projects/AdminProjectCard';
import AdminProjectFilters from '@/components/projects/AdminProjectFilters';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import { Spinner } from '@/components/Spinner';
import { useAdminProjectsStore } from '@/store/adminProjectsStore';
import React, { useEffect, useState } from 'react';

const AdminProjects: React.FC = () => {
  const { projects, meta, loading, error, fetch, setToken, filters, setFilters, localSearchResults } = useAdminProjectsStore();
  const [detailSlug, setDetailSlug] = useState<string | null>(null);

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

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Projects Moderation</h1>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(p => (
            <AdminProjectCard key={p.id} project={p} onOpenDetail={slug => setDetailSlug(slug)} />
          ))}
        </div>
      )}

      {meta && meta.pages > 1 && (
        <div className="flex justify-center mt-10 gap-1 flex-wrap">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map(pg => (
            <button key={pg} onClick={()=> handlePageChange(pg)} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filters.page === pg ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>{pg}</button>
          ))}
        </div>
      )}

      <ProjectDetailModal slug={detailSlug} onClose={()=> setDetailSlug(null)} />
    </div>
  );
};

export default AdminProjects;
