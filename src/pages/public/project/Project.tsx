import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Lightbulb, Users, Rocket, Award, ExternalLink, Calendar, MapPin, User, Github, Globe, Layers, TrendingUp, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { AnimatedSection, StaggeredContainer } from '../HomePage/components/AnimatedComponents';
import { useNavigate } from 'react-router-dom';
import Footer from '../HomePage/components/Footer';

interface Project {
    id: number;
    title: string;
    slug: string;
    summary: string;
    teamName: string;
    coverImage: string | null;
    country: string | null;
    stack: string[];
    status: string;
    featuredAt: string | null;
    createdAt: string;
    user: {
        id: number;
        profile: {
            name: string;
            avatarUrl: string | null;
        };
    };
    tags: any[];
}

interface ProjectsResponse {
    data: Project[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}


interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="24" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Cover Image */}
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-100 to-purple-100">
                        <img
                            src={project.coverImage || defaultImage}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                            <span className="text-sm font-semibold text-gray-800">{project.teamName}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                        {project.country && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span className="font-medium">{project.country}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">{project.summary}</p>
                    </div>

                    {/* Tech Stack */}
                    {project.stack && project.stack.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.stack.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Creator Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Created By</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                                {project.user.profile.avatarUrl ? (
                                    <img src={project.user.profile.avatarUrl} alt={project.user.profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{project.user.profile.name}</p>
                                <p className="text-sm text-gray-600">Project Creator</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                            <Globe className="w-5 h-5" />
                            <span>Visit Website</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                            <Github className="w-5 h-5" />
                            <span>View Code</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="24" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
            {/* Cover Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
                <img
                    src={project.coverImage || defaultImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Team Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <span className="text-sm font-semibold text-gray-800">{project.teamName}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {project.title}
                    </h3>
                </div>

                {/* Summary */}
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {project.summary}
                </p>

                {/* Tech Stack */}
                {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.stack.slice(0, 4).map((tech, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.stack.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                +{project.stack.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                    {project.country && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.country}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* User Info - Pushed to bottom */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                            {project.user.profile.avatarUrl ? (
                                <img src={project.user.profile.avatarUrl} alt={project.user.profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{project.user.profile.name}</p>
                            <p className="text-xs text-gray-500">Creator</p>
                        </div>
                    </div>

                    <button
                        onClick={onClick}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                        <span className="text-sm font-medium">View</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Project() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [projectsData, setProjectsData] = useState<ProjectsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await api.get('/public/projects');
                setProjectsData(result.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'internship', href: '/internship' },
        { name: 'Community', href: '/community' },
        { name: 'Project', href: '/project' },
        { name: 'Webinar', href: '/Webinar' },
        { name: 'Membership', href: '/Membership' },
        { name: 'About', href: '/about-us' },
    ];


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
                : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
                } h-16`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={'/images/ESIS.png'}
                            alt="Logo"
                            className="h-32 w-auto"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Sign Up Button */}
                    <button onClick={() => navigate('/register')} className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Sign Up
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 z-40">
                        <nav className="flex flex-col px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium mt-2 w-full">
                                Sign Up
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section with Enhanced Blur Effects */}
            <AnimatedSection className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-1000 ease-out">
                {/* Desktop Blur Effects */}
                <div className="hidden lg:block">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-200/60 via-blue-300/40 to-teal-200/50 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-blue-300/50 via-purple-200/40 to-blue-200/60 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-blue-100/70 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                </div>

                {/* Tablet Blur Effects */}
                <div className="hidden sm:block lg:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-r from-blue-200/50 via-blue-300/35 to-teal-200/45 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-gradient-to-br from-blue-300/45 via-purple-200/35 to-blue-200/55 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-blue-100/65 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                </div>

                {/* Mobile Blur Effects */}
                <div className="block sm:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-r from-blue-200/45 via-blue-300/30 to-teal-200/40 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-gradient-to-br from-blue-300/40 via-purple-200/30 to-blue-200/50 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] bg-blue-100/60 rounded-full blur-lg transition-all duration-1000 ease-out"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <AnimatedSection animationType="fadeInUp" delay={0.2} className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        Featured Projects
                    </AnimatedSection>
                    <AnimatedSection animationType="fadeInUp" delay={0.4} className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-600 mb-8">
                        Innovation in Action
                    </AnimatedSection>
                    <AnimatedSection animationType="fadeInUp" delay={0.6} className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Discover groundbreaking projects from Ethiopia's most talented entrepreneurs and innovators.
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">200+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Active User</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">30+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Daily Tech Updates</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">34+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Webinars Hosted</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">34+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Community Projects</div>
                        </div>
                    </StaggeredContainer>
                </div>
            </AnimatedSection>


            {/* Projects Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Explore Projects
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                            {projectsData?.meta?.total
                                ? `Browse through ${projectsData.meta.total} innovative projects created by our talented community.`
                                : 'Browse through innovative projects created by our talented community.'
                            }
                        </p>
                    </AnimatedSection>

                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600 font-medium">Loading projects...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {!loading && !error && projectsData?.data && (
                        <>
                            <StaggeredContainer
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                staggerDelay={0.15}
                            >
                                {projectsData.data.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                ))}
                            </StaggeredContainer>

                            {/* Pagination Info */}
                            {projectsData.meta && (
                                <AnimatedSection delay={0.5} className="text-center mt-12">
                                    <p className="text-gray-500">
                                        Showing {projectsData.data.length} of {projectsData.meta.total} projects
                                    </p>
                                </AnimatedSection>
                            )}
                        </>
                    )}

                    {!loading && !error && (!projectsData?.data || projectsData.data.length === 0) && (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                            <p className="text-gray-600 text-lg font-medium">No projects found</p>
                            <p className="text-gray-500 mt-2">Check back soon for new projects!</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}