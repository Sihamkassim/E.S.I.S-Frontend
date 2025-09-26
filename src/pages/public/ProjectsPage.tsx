
import FeaturedProjectCard from '@/components/projects/FeaturedProjectCard';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import { usePublicProjectsStore } from '@/store/publicProjectsStore';
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Spinner } from '../../components/Spinner';
import { useTheme } from '../../hooks/useTheme';
import { GetProjectsParams } from '../../services/projectsService';

const ProjectsPage: React.FC = () => {
    const { projects, featured, meta, loading, error, fetch } = usePublicProjectsStore();
    const safeProjects = Array.isArray(projects) ? projects : [];
    const [filters, setFilters] = useState<GetProjectsParams>({ page: 1, limit: 12 });
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeSlug, setActiveSlug] = useState<string | null>(null);
	const { theme } = useTheme();

    useEffect(() => {
        fetch(filters as any);
    }, [filters, fetch]);

	const handlePageChange = (newPage: number) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

    const filteredProjects = useMemo(() => {
        if (!Array.isArray(safeProjects) || safeProjects.length === 0) {
            return [];
        }
        return safeProjects.filter(
            (project) =>
                project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.teamName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, safeProjects]);

	return (
		<Layout>
			<div className={`container mx-auto px-4 py-12 md:py-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
				{/* --- Hero Section --- */}
				<section className={`mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ${
					theme === 'dark'
						? 'bg-gradient-to-br from-gray-900 via-primary-dark to-gray-900'
						: 'bg-gradient-to-br from-blue-50 via-primary-light to-blue-50'
				}`}>
					<div className="py-16 px-6 text-center">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white">
							Explore Projects
						</h1>
						<p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
							Discover innovative tech projects submitted by our community. Filter by team, stack, or country to find what inspires you.
						</p>
						{/* --- Search Bar --- */}
						<div className="relative max-w-xl mx-auto mt-8">
							<input
								type="text"
								placeholder="Search by title, summary, or team..."
								className="w-full py-4 px-6 pr-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-white/70"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</section>

				{/* --- Featured Projects Section --- */}
				{featured.length > 0 && filters.page === 1 && (
					<section className="mb-20">
						<h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
							<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 shadow-inner">★</span>
							Featured Projects
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{featured.slice(0,3).map(fp => (
								<FeaturedProjectCard key={fp.id} project={fp} onClick={(p)=> setActiveSlug(p.slug!)} />
							))}
						</div>
					</section>
				)}

				{/* --- Projects Grid Section --- */}
				<section className="mb-16">
					{loading ? (
						<div className="flex justify-center items-center py-24">
							<Spinner />
						</div>
					) : error ? (
						<div className="bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center shadow-lg">
							<p className="font-semibold">Error loading projects: {error}</p>
							<button
								onClick={() => setFilters({ ...filters })}
								className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
							>
								Try Again
							</button>
						</div>
					) : filteredProjects.length === 0 ? (
						<div className="text-center py-24">
							<div className="mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`h-20 w-20 mx-auto ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold">
								{searchQuery ? 'No Matching Projects Found' : 'No Projects Available'}
							</h3>
							<p className={`mt-3 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
								{searchQuery
									? 'Try adjusting your search query or check back later for new projects.'
									: 'Our community is working on new ideas. Check back soon!'}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProjects.map((project) => (
								<button key={project.id} onClick={()=> setActiveSlug(project.slug!)} className="group relative text-left bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow p-5 flex flex-col focus:outline-none focus:ring-4 focus:ring-primary/30">
									<div className="relative mb-4 overflow-hidden rounded-xl">
										<img src={project.coverImage || '/placeholder-cover.jpg'} alt={project.title} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
										{project.status === 'FEATURED' && (
											<span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow">FEATURED</span>
										)}
									</div>
									<h2 className="text-lg font-bold mb-1 dark:text-white line-clamp-2">{project.title}</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{project.summary}</p>
									<div className="flex flex-wrap gap-2 mb-3">
										{project.tags.slice(0,3).map((t: any) => (
											<span key={t.tag.slug} className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-200 px-2 py-0.5 rounded-full text-[10px] font-medium">{t.tag.name}</span>
										))}
									</div>
									<div className="flex flex-wrap gap-1 mb-3">
										{project.stack?.slice(0,4).map((s: string) => (
											<span key={s} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-[10px]">{s}</span>
										))}
									</div>
									<div className="mt-auto flex items-center justify-between">
										<span className="text-xs text-gray-500 dark:text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
										<span className="text-xs font-medium text-gray-600 dark:text-gray-300">{project.teamName}</span>
									</div>
								</button>
							))}
						</div>
					)}
				</section>

				{/* --- Pagination --- */}
				{meta && meta.pages > 1 && (
					<div className="flex justify-center mt-8">
						{Array.from({ length: meta.pages }, (_, i) => i + 1).map((pageNum) => (
							<button
								key={pageNum}
								className={`mx-1 px-3 py-1 rounded ${meta.page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
								onClick={() => handlePageChange(pageNum)}
							>
								{pageNum}
							</button>
						))}
					</div>
				)}

		            <ProjectDetailModal slug={activeSlug} onClose={() => setActiveSlug(null)} />
			</div>
		</Layout>
	);
};

export default ProjectsPage;
