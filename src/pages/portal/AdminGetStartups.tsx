import { ArrowLeft, Filter, Search, Star, X, User, Globe, MapPin, Tag, FileText, PlayCircle, Calendar, MessageSquare, Edit, Building2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface Startup {
    id: number;
    name: string;
    logo: string;
    website: string;
    pitch: string;
    stage: string;
    traction: string;
    deck: string;
    demoLink: string;
    tags: string;
    country: string;
    status: string;
    featured: boolean;
    featuredAt: string | null;
    modNotes: string | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
    User: {
        id: number;
        email: string;
        profile: {
            name: string;
            avatar: string;
        } | null;
    };
}

const AdminGetStartups: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<{ action: string, startupId: number, startupName: string } | null>(null);
    const [actionMessage, setActionMessage] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);
    const actionModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStartups();
    }, [statusFilter]);

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
            if (actionModalRef.current && !actionModalRef.current.contains(event.target as Node)) {
                setActionModalOpen(false);
            }
        };

        if (isModalOpen || actionModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, actionModalOpen]);

    const fetchStartups = async () => {
        try {
            const params: any = {};
            if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

            const response = await api.get('/admin/startups', { params });
            setStartups(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch startups: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (startup: Startup) => {
        setSelectedStartup(startup);
        setIsModalOpen(true);
    };

    const handleFeatureToggle = async (startupId: number, currentlyFeatured: boolean) => {
        try {
            await api.patch(`/admin/startups/${startupId}/feature`, {
                featured: !currentlyFeatured
            });
            toast.success(`Startup ${currentlyFeatured ? 'unfeatured' : 'featured'} successfully!`);
            fetchStartups();
            if (selectedStartup?.id === startupId) {
                setSelectedStartup({
                    ...selectedStartup,
                    featured: !currentlyFeatured,
                    featuredAt: !currentlyFeatured ? new Date().toISOString() : null
                });
            }
        } catch (error: any) {
            toast.error(`Failed to update feature status: ${error.response?.data?.error || error.message}`);
        }
    };

    const openActionModal = (startupId: number, startupName: string, action: string) => {
        setCurrentAction({ startupId, startupName, action });
        setActionMessage('');
        setActionModalOpen(true);
    };

    const handleStatusAction = async () => {
        if (!currentAction) return;

        try {
            await api.post(`/admin/startups/${currentAction.startupId}/decision`, {
                to: currentAction.action,
                message: actionMessage || ''
            });

            toast.success(`Startup ${getActionVerb(currentAction.action)} successfully!`);
            setActionModalOpen(false);
            setCurrentAction(null);
            setActionMessage('');
            fetchStartups();

            if (selectedStartup?.id === currentAction.startupId) {
                setIsModalOpen(false);
            }
        } catch (error: any) {
            toast.error(`Failed to ${getActionVerb(currentAction.action).toLowerCase()} startup: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDelete = async (startupId: number) => {
        if (!confirm('Are you sure you want to delete this startup? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/admin/startups/${startupId}`);
            toast.success('Startup deleted successfully!');
            fetchStartups();
            if (selectedStartup?.id === startupId) {
                setIsModalOpen(false);
            }
        } catch (error: any) {
            toast.error(`Failed to delete startup: ${error.response?.data?.error || error.message}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800';
            case 'Submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
            case 'Changes Requested': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800';
            case 'Rejected': return `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800 ${theme === 'dark' ? 'text-white' : 'text-gray-300'} `;
            case 'Draft': return `bg-gray-100 text-gray-800 ${theme === 'dark' ? 'text-white' : 'text-gray-300'} border border-gray-200 dark:border-gray-700`;
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
        }
    };

    const getActionVerb = (action: string) => {
        switch (action) {
            case 'Approved': return 'approved';
            case 'Rejected': return 'rejected';
            case 'Changes Requested': return 'changes requested for';
            case 'Under Review': return 'marked under review';
            case 'Draft': return 'reverted to draft';
            default: return action.toLowerCase();
        }
    };

    const getAvailableActions = (startup: Startup) => {
        const actions = [];

        switch (startup.status) {
            case 'Draft':
                actions.push('Under Review', 'Approved', 'Rejected');
                break;
            case 'Submitted':
                actions.push('Under Review', 'Approved', 'Changes Requested', 'Rejected');
                break;
            case 'Under Review':
                actions.push('Approved', 'Changes Requested', 'Rejected', 'Draft');
                break;
            case 'Changes Requested':
                actions.push('Under Review', 'Approved', 'Rejected', 'Draft');
                break;
            case 'Approved':
                actions.push('Under Review', 'Changes Requested', 'Rejected', 'Draft');
                break;
            case 'Rejected':
                actions.push('Under Review', 'Approved', 'Changes Requested', 'Draft');
                break;
        }

        return actions;
    };

    const getActionButtonVariant = (action: string) => {
        switch (action) {
            case 'Approved': return 'default';
            case 'Rejected': return 'destructive';
            case 'Changes Requested': return 'outline';
            case 'Under Review': return 'secondary';
            case 'Draft': return 'ghost';
            default: return 'outline';
        }
    };

    const filteredStartups = startups.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.User?.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.User?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-center items-center h-64">
                    <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading startups...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Manage Startups
                    </h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Complete administrative control over all startup applications.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by startup name, founder name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" ><p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>All Statuses</p></SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Under Review">Under Review</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Changes Requested"><p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Changes Requested</p></SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={fetchStartups} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Refresh</p>
                        </Button>
                    </div>
                </div>

                {/* Startups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStartups.map((startup) => (
                        <div
                            key={startup.id}
                            className={`
                                border rounded-xl overflow-hidden shadow-sm transition-all duration-300 
                                hover:shadow-lg hover:scale-[1.02] cursor-pointer group
                                ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }
                            `}
                            onClick={() => handleViewDetails(startup)}
                        >
                            {/* Card Header with Image */}
                            <div className={`relative h-40 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                {startup.logo ? (
                                    <img
                                        src={startup.logo}
                                        alt={startup.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <Building2 className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {startup.featured && (
                                        <div className="bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                    )}
                                    <span className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} px-2 py-1 rounded-full text-xs font-medium shadow-sm  ${getStatusColor(startup.status)}`}>
                                        {startup.status}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`font-bold text-lg truncate flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {startup.name}
                                    </h3>
                                </div>

                                <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {startup.pitch}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span className={`truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {startup.User?.profile?.name || startup.User?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                            {startup.country}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                            {startup.stage}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={`flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(startup);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(startup.id);
                                        }}
                                        className="hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStartups.length === 0 && (
                    <div className="text-center py-12">
                        <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No startups found matching your criteria.
                        </div>
                    </div>
                )}
            </div>

            {/* Startup Detail Modal */}
            {isModalOpen && selectedStartup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        className={`
                            max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl 
                            transform transition-all duration-300
                            ${theme === 'dark'
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit z-10">
                            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {selectedStartup.name}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-full"
                            >
                                <X className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Header with Image and Basic Info */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className={`w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    {selectedStartup.logo ? (
                                        <img
                                            src={selectedStartup.logo}
                                            alt={selectedStartup.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            <Building2 className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(selectedStartup.status)}`}>
                                            {selectedStartup.status}
                                        </span>
                                        {selectedStartup.featured && (
                                            <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>Featured</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                <strong>Founder:</strong> {selectedStartup.User?.profile?.name || selectedStartup.User?.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                <strong>Country:</strong> {selectedStartup.country}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                <strong>Stage:</strong> {selectedStartup.stage}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                <strong>Created:</strong> {new Date(selectedStartup.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {selectedStartup.website && (
                                            <a href={selectedStartup.website} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400">
                                                <Globe className="h-4 w-4" /> Website
                                            </a>
                                        )}
                                        {selectedStartup.demoLink && (
                                            <a href={selectedStartup.demoLink} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400">
                                                <PlayCircle className="h-4 w-4" /> Demo
                                            </a>
                                        )}
                                        {selectedStartup.deck && (
                                            <a href={selectedStartup.deck} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm transition-colors px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400">
                                                <FileText className="h-4 w-4" /> Pitch Deck
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content Sections */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className={`font-semibold mb-3 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Pitch Description
                                    </h3>
                                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {selectedStartup.pitch}
                                    </p>
                                </div>

                                {selectedStartup.traction && (
                                    <div>
                                        <h3 className={`font-semibold mb-3 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Traction & Milestones
                                        </h3>
                                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {selectedStartup.traction}
                                        </p>
                                    </div>
                                )}

                                {selectedStartup.tags && (
                                    <div>
                                        <h3 className={`font-semibold mb-3 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Tags & Categories
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStartup.tags.split(',').map((tag, index) => (
                                                <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${theme === 'dark'
                                                    ? 'bg-blue-900 text-blue-200 border border-blue-800'
                                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    }`}>
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedStartup.modNotes && (
                                    <div>
                                        <h3 className={`font-semibold mb-3 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Moderator Notes
                                        </h3>
                                        <div className={`p-4 rounded-lg border shadow-sm ${theme === 'dark'
                                            ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
                                            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                            }`}>
                                            <p>{selectedStartup.modNotes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                {getAvailableActions(selectedStartup).map((action) => (
                                    <Button
                                        key={action}
                                        variant={getActionButtonVariant(action)}
                                        onClick={() => openActionModal(selectedStartup.id, selectedStartup.name, action)}
                                        className={`transition-all hover:scale-105 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                    >
                                        {action}
                                    </Button>
                                ))}

                                {selectedStartup.status === 'Approved' && (
                                    <Button
                                        variant={selectedStartup.featured ? "outline" : "secondary"}
                                        onClick={() => handleFeatureToggle(selectedStartup.id, selectedStartup.featured)}
                                        className="transition-all hover:scale-105"
                                    >
                                        <Star className={`h-4 w-4 mr-2 ${selectedStartup.featured ? 'fill-current' : ''}`} />
                                        {selectedStartup.featured ? 'Unfeature' : 'Feature'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {actionModalOpen && currentAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div
                        ref={actionModalRef}
                        className={`
                            max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-300
                            ${theme === 'dark'
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-200'
                            }
                        `}
                    >
                        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {currentAction.action} Startup
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setActionModalOpen(false)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                You are about to mark <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>"{currentAction.startupName}"</strong> as
                                <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}> {currentAction.action}</strong>.
                            </p>

                            {(currentAction.action === 'Changes Requested' || currentAction.action === 'Rejected') && (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Message to Founder {currentAction.action === 'Changes Requested' ? '(required)' : '(optional)'}
                                    </label>
                                    <Textarea
                                        placeholder={`Explain why you're ${currentAction.action.toLowerCase()} this startup...`}
                                        value={actionMessage}
                                        onChange={(e) => setActionMessage(e.target.value)}
                                        rows={4}
                                        required={currentAction.action === 'Changes Requested'}
                                        className={`rounded-lg ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500 focus:border-blue-500'
                                            : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={`flex justify-end gap-3 p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <Button
                                variant="outline"
                                onClick={() => setActionModalOpen(false)}
                                className={`transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleStatusAction}
                                variant={getActionButtonVariant(currentAction.action)}
                                disabled={currentAction.action === 'Changes Requested' && !actionMessage.trim()}
                                className={`transition-all hover:scale-105 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                            >
                                Confirm {currentAction.action}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminGetStartups;