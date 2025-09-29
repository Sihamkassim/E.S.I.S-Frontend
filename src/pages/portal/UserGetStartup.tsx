import { ArrowLeft, Edit, Eye, FileText, Filter, Plus, Search, Trash2, Upload, X, Save, Building2, Globe, MapPin, Tag, Text, Link, BarChart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
    modNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

const UserGetStartups: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        name: '',
        logo: '',
        website: '',
        pitch: '',
        stage: '',
        traction: '',
        deck: '',
        demoLink: '',
        tags: '',
        country: ''
    });

    useEffect(() => {
        fetchStartups();
    }, [statusFilter]);

    const fetchStartups = async () => {
        try {
            const params: any = {};
            if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

            const response = await api.get('/user/get-startup', { params });
            setStartups(response.data);
        } catch (error: any) {
            toast.error(`Failed to fetch startups: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (startupId: number) => {
        try {
            await api.post(`/user/startups/${startupId}/submit`);
            toast.success('Startup submitted for review successfully!');
            fetchStartups();
        } catch (error: any) {
            toast.error(`Failed to submit startup: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleSoftDelete = async (startupId: number) => {
        if (!confirm('Are you sure you want to delete this startup? This action can be undone by contacting support.')) {
            return;
        }

        try {
            await api.delete(`/user/startups/${startupId}`);
            toast.success('Startup deleted successfully!');
            fetchStartups();
        } catch (error: any) {
            toast.error(`Failed to delete startup: ${error.response?.data?.error || error.message}`);
        }
    };

    const openEditModal = (startup: Startup) => {
        setEditingStartup(startup);
        setEditFormData({
            name: startup.name,
            logo: startup.logo,
            website: startup.website,
            pitch: startup.pitch,
            stage: startup.stage,
            traction: startup.traction,
            deck: startup.deck,
            demoLink: startup.demoLink,
            tags: startup.tags,
            country: startup.country
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStartup) return;

        setEditLoading(true);
        try {
            await api.patch(`/user/startups/${editingStartup.id}`, editFormData);
            toast.success('Startup updated successfully!');
            setEditModalOpen(false);
            fetchStartups();
        } catch (error: any) {
            toast.error(`Failed to update startup: ${error.response?.data?.error || error.message}`);
        } finally {
            setEditLoading(false);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSelectChange = (name: string, value: string) => {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Under Review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Changes Requested': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            case 'Deleted': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const canEdit = (status: string) => {
        return status === 'Draft' || status === 'Changes Requested';
    };

    const canSubmit = (status: string) => {
        return status === 'Draft' || status === 'Changes Requested';
    };

    const canDelete = (status: string) => {
        return status !== 'Deleted';
    };

    const filteredStartups = startups.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-center items-center h-64">
                    <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading your startups...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <Button onClick={() => navigate('/dashboard/post-startup')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Startup
                        </Button>
                    </div>
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        My Startups
                    </h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage your startup applications and track their status.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by startup name or tags..."
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
                                <SelectItem value="all"><p className={` ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All Statuses</p></SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Under Review">Under Review</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Changes Requested">Changes Requested</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="Deleted">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={fetchStartups}>
                            <p className={` ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Refresh</p>
                        </Button>
                    </div>
                </div>

                {/* Startups Grid */}
                {/* Startups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStartups.map((startup) => (
                        <div key={startup.id} className={`border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

                            {/* Card Header with Logo */}
                            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {startup.logo ? (
                                        <img src={startup.logo} alt={startup.name} className="w-12 h-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            <Building2 className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {startup.name}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                                            {startup.status}
                                        </span>
                                    </div>
                                </div>

                                <p className={`text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {startup.pitch}
                                </p>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex-1">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{startup.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="h-4 w-4 text-gray-400" />
                                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{startup.stage}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <BarChart className="h-4 w-4 text-gray-400" />
                                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                            {new Date(startup.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {startup.website && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="h-4 w-4 text-gray-400" />
                                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Website</span>
                                        </div>
                                    )}
                                </div>

                                {startup.modNotes && (
                                    <div className={`p-2 rounded text-xs mb-3 ${theme === 'dark' ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-50 text-yellow-800'}`}>
                                        <strong>Moderator Notes:</strong> {startup.modNotes}
                                    </div>
                                )}

                                {/* Status-specific guidance */}
                                {startup.status === 'Changes Requested' && (
                                    <div className={`p-2 rounded text-xs mb-3 ${theme === 'dark' ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                                        Please make the requested changes and resubmit your startup.
                                    </div>
                                )}

                                {startup.status === 'Rejected' && (
                                    <div className={`p-2 rounded text-xs mb-3 ${theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-800'}`}>
                                        Your startup application was not approved.
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons - Always at bottom */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-2">
                                    {canEdit(startup.status) && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => openEditModal(startup)}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                    )}

                                    {canSubmit(startup.status) && (
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleSubmit(startup.id)}
                                        >
                                            <Upload className="h-3 w-3 mr-1" />
                                            Submit
                                        </Button>
                                    )}

                                    {startup.status === 'Approved' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => navigate(`/startups/${startup.id}`)}
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                    )}

                                    {canDelete(startup.status) && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleSoftDelete(startup.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStartups.length === 0 && (
                    <div className="text-center py-12">
                        <div className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {statusFilter === 'all' ? 'You haven\'t created any startups yet.' : 'No startups found with this status.'}
                        </div>
                        <Button onClick={() => navigate('/dashboard/post-startup')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Startup
                        </Button>
                    </div>
                )}
            </div>

            {/* Edit Startup Modal */}
            {editModalOpen && editingStartup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Edit Startup - {editingStartup.name}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setEditModalOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Startup Name */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Startup Name *
                                    </label>
                                    <Input
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditChange}
                                        required
                                        placeholder="Enter startup name"
                                    />
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Country *
                                    </label>
                                    <Input
                                        name="country"
                                        value={editFormData.country}
                                        onChange={handleEditChange}
                                        required
                                        placeholder="Country of operation"
                                    />
                                </div>

                                {/* Website */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Website
                                    </label>
                                    <Input
                                        name="website"
                                        type="url"
                                        value={editFormData.website}
                                        onChange={handleEditChange}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                {/* Stage */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Stage *
                                    </label>
                                    <Select value={editFormData.stage} onValueChange={(value) => handleEditSelectChange('stage', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select startup stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Idea">Idea Stage</SelectItem>
                                            <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                            <SelectItem value="Seed">Seed</SelectItem>
                                            <SelectItem value="Series A">Series A</SelectItem>
                                            <SelectItem value="Series B">Series B+</SelectItem>
                                            <SelectItem value="Growth">Growth Stage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Logo URL */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Logo URL
                                    </label>
                                    <Input
                                        name="logo"
                                        type="url"
                                        value={editFormData.logo}
                                        onChange={handleEditChange}
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>

                                {/* Demo Link */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Demo Link
                                    </label>
                                    <Input
                                        name="demoLink"
                                        type="url"
                                        value={editFormData.demoLink}
                                        onChange={handleEditChange}
                                        placeholder="https://demo.example.com"
                                    />
                                </div>

                                {/* Deck URL */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Pitch Deck URL
                                    </label>
                                    <Input
                                        name="deck"
                                        type="url"
                                        value={editFormData.deck}
                                        onChange={handleEditChange}
                                        placeholder="https://docs.google.com/presentation/..."
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Tags
                                    </label>
                                    <Input
                                        name="tags"
                                        value={editFormData.tags}
                                        onChange={handleEditChange}
                                        placeholder="tech, saas, ai, fintech"
                                    />
                                </div>
                            </div>

                            {/* Pitch */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Pitch Description *
                                </label>
                                <Textarea
                                    name="pitch"
                                    value={editFormData.pitch}
                                    onChange={handleEditChange}
                                    rows={4}
                                    required
                                    placeholder="Describe your startup in 2-3 sentences..."
                                />
                            </div>

                            {/* Traction */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Traction & Milestones
                                </label>
                                <Textarea
                                    name="traction"
                                    value={editFormData.traction}
                                    onChange={handleEditChange}
                                    rows={3}
                                    placeholder="Key milestones, user growth, revenue, etc."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {editLoading ? 'Updating...' : 'Update Startup'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserGetStartups;