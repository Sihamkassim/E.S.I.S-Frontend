import {
    ArrowLeft, Edit, Eye, FileText, Filter, Plus, Search, Trash2, Upload, X, Save,
    Building2, Globe, MapPin, Tag, Text, Link, BarChart, Calendar, Users, TrendingUp,
    Clock, CheckCircle, AlertCircle, MoreVertical, ExternalLink
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
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

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
        'Draft': {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            darkColor: 'bg-gray-800 text-gray-300 border-gray-700',
            icon: Clock
        },
        'Submitted': {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            darkColor: 'bg-blue-900/30 text-blue-300 border-blue-800',
            icon: Upload
        },
        'Under Review': {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            darkColor: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
            icon: AlertCircle
        },
        'Approved': {
            color: 'bg-green-100 text-green-800 border-green-200',
            darkColor: 'bg-green-900/30 text-green-300 border-green-800',
            icon: CheckCircle
        },
        'Changes Requested': {
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            darkColor: 'bg-orange-900/30 text-orange-300 border-orange-800',
            icon: Edit
        },
        'Rejected': {
            color: 'bg-red-100 text-red-800 border-red-200',
            darkColor: 'bg-red-900/30 text-red-300 border-red-800',
            icon: X
        },
        'Deleted': {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            darkColor: 'bg-gray-800 text-gray-300 border-gray-700',
            icon: Trash2
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Draft;
    const IconComponent = config.icon;

    return (
        <Badge variant="outline" className={`${config.color} dark:${config.darkColor} gap-1.5`}>
            <IconComponent className="w-3 h-3" />
            {status}
        </Badge>
    );
};

// Startup Card Component
const StartupCard: React.FC<{
    startup: Startup;
    onEdit: (startup: Startup) => void;
    onSubmit: (id: number) => void;
    onDelete: (id: number) => void;
    onView: (id: number) => void;
    theme: string;
}> = ({ startup, onEdit, onSubmit, onDelete, onView, theme }) => {
    const canEdit = startup.status === 'Draft' || startup.status === 'Changes Requested';
    const canSubmit = startup.status === 'Draft' || startup.status === 'Changes Requested';
    const canDelete = startup.status !== 'Deleted';

    return (
        <Card className={`group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            {/* Card Header */}
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        {startup.logo ? (
                            <img
                                src={startup.logo}
                                alt={startup.name}
                                className="w-12 h-12 rounded-xl object-cover border"
                            />
                        ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                                }`}>
                                <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <CardTitle className={`text-lg font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                {startup.name}
                            </CardTitle>
                            <div className="mt-2">
                                <StatusBadge status={startup.status} />
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {canEdit && (
                                <DropdownMenuItem onClick={() => onEdit(startup)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canSubmit && (
                                <DropdownMenuItem onClick={() => onSubmit(startup.id)}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit
                                </DropdownMenuItem>
                            )}
                            {startup.status === 'Approved' && (
                                <DropdownMenuItem onClick={() => onView(startup.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(startup.id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="flex-1 pb-4">
                {/* Pitch Description */}
                <p className={`text-sm line-clamp-3 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {startup.pitch}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {startup.country || 'Not specified'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {startup.stage}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {new Date(startup.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    {startup.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                Website
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {startup.tags && (
                    <div className="mt-4 flex flex-wrap gap-1">
                        {startup.tags.split(',').map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag.trim()}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Status Messages */}
                {startup.modNotes && (
                    <div className={`mt-4 p-3 rounded-lg border text-sm ${theme === 'dark'
                            ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                        }`}>
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Moderator Notes:</strong>
                                <p className="mt-1">{startup.modNotes}</p>
                            </div>
                        </div>
                    </div>
                )}

                {startup.status === 'Changes Requested' && !startup.modNotes && (
                    <div className={`mt-4 p-3 rounded-lg border text-sm ${theme === 'dark'
                            ? 'bg-blue-900/20 border-blue-800 text-blue-200'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}>
                        <div className="flex items-start gap-2">
                            <Edit className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Changes Requested</strong>
                                <p className="mt-1">Please review and update your submission based on feedback.</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 w-full">
                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onEdit(startup)}
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    )}

                    {canSubmit && (
                        <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => onSubmit(startup.id)}
                        >
                            <Upload className="h-3 w-3 mr-1" />
                            Submit
                        </Button>
                    )}

                    {startup.status === 'Approved' && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onView(startup.id)}
                        >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

// Edit Modal Component
const EditStartupModal: React.FC<{
    startup: Startup | null;
    open: boolean;
    onClose: () => void;
    formData: any;
    loading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    theme: string;
}> = ({ startup, open, onClose, formData, loading, onChange, onSelectChange, onSubmit, theme }) => {
    if (!open || !startup) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            Edit Startup
                        </h2>
                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Update your startup details
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Basic Information
                            </h3>

                            {/* Startup Name */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <Building2 className="h-4 w-4" />
                                    Startup Name *
                                </label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    required
                                    placeholder="Enter your startup name"
                                    className="w-full"
                                />
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <MapPin className="h-4 w-4" />
                                    Country *
                                </label>
                                <Input
                                    name="country"
                                    value={formData.country}
                                    onChange={onChange}
                                    required
                                    placeholder="Country of operation"
                                    className="w-full"
                                />
                            </div>

                            {/* Stage */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <TrendingUp className="h-4 w-4" />
                                    Stage *
                                </label>
                                <Select value={formData.stage} onValueChange={(value) => onSelectChange('stage', value)}>
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

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </label>
                                <Input
                                    name="tags"
                                    value={formData.tags}
                                    onChange={onChange}
                                    placeholder="tech, saas, ai, fintech (comma separated)"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Links & Media */}
                        <div className="space-y-6">
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Links & Media
                            </h3>

                            {/* Logo URL */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <ImageIcon className="h-4 w-4" />
                                    Logo URL
                                </label>
                                <Input
                                    name="logo"
                                    type="url"
                                    value={formData.logo}
                                    onChange={onChange}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full"
                                />
                            </div>

                            {/* Website */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <Globe className="h-4 w-4" />
                                    Website
                                </label>
                                <Input
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={onChange}
                                    placeholder="https://example.com"
                                    className="w-full"
                                />
                            </div>

                            {/* Demo Link */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <Link className="h-4 w-4" />
                                    Demo Link
                                </label>
                                <Input
                                    name="demoLink"
                                    type="url"
                                    value={formData.demoLink}
                                    onChange={onChange}
                                    placeholder="https://demo.example.com"
                                    className="w-full"
                                />
                            </div>

                            {/* Pitch Deck */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <FileText className="h-4 w-4" />
                                    Pitch Deck URL
                                </label>
                                <Input
                                    name="deck"
                                    type="url"
                                    value={formData.deck}
                                    onChange={onChange}
                                    placeholder="https://docs.google.com/presentation/..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Sections */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Pitch */}
                        <div className="space-y-2">
                            <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                <Text className="h-4 w-4" />
                                Pitch Description *
                            </label>
                            <Textarea
                                name="pitch"
                                value={formData.pitch}
                                onChange={onChange}
                                rows={4}
                                required
                                placeholder="Describe your startup in 2-3 sentences. What problem are you solving and for whom?"
                                className="resize-none"
                            />
                        </div>

                        {/* Traction */}
                        <div className="space-y-2">
                            <label className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                <BarChart className="h-4 w-4" />
                                Traction & Milestones
                            </label>
                            <Textarea
                                name="traction"
                                value={formData.traction}
                                onChange={onChange}
                                rows={3}
                                placeholder="Key milestones, user growth, revenue, partnerships, or any other metrics that show progress..."
                                className="resize-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="outline" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[140px]">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Startup
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Image Icon component (since it's not imported)
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// Main Component
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

    const handleViewStartup = (startupId: number) => {
        navigate(`/startups/${startupId}`);
    };

    const filteredStartups = startups.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.pitch?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        total: startups.length,
        draft: startups.filter(s => s.status === 'Draft').length,
        submitted: startups.filter(s => s.status === 'Submitted').length,
        approved: startups.filter(s => s.status === 'Approved').length,
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Loading your startups...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            My Startups
                        </h1>
                        <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your startup applications and track their status
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/dashboard/post-startup')}
                        className="gap-2"
                        size="lg"
                    >
                        <Plus className="h-5 w-5" />
                        Create Startup
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total Startups
                                    </p>
                                    <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {stats.total}
                                    </p>
                                </div>
                                <Building2 className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        In Draft
                                    </p>
                                    <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                        {stats.draft}
                                    </p>
                                </div>
                                <Clock className={`h-8 w-8 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Submitted
                                    </p>
                                    <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {stats.submitted}
                                    </p>
                                </div>
                                <Upload className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Approved
                                    </p>
                                    <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        {stats.approved}
                                    </p>
                                </div>
                                <CheckCircle className={`h-8 w-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, tags, or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12 text-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[200px] h-12">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Submitted">Submitted</SelectItem>
                                        <SelectItem value="Under Review">Under Review</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Changes Requested">Changes Requested</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={fetchStartups}
                                    className="h-12 px-6"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Startups Grid */}
                {filteredStartups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredStartups.map((startup) => (
                            <StartupCard
                                key={startup.id}
                                startup={startup}
                                onEdit={openEditModal}
                                onSubmit={handleSubmit}
                                onDelete={handleSoftDelete}
                                onView={handleViewStartup}
                                theme={theme}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className={`text-center py-16 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                        <CardContent>
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <Building2 className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                                }`}>
                                No startups found
                            </h3>
                            <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                    : 'Ready to showcase your startup? Create your first startup profile to get started.'
                                }
                            </p>
                            <Button
                                onClick={() => navigate('/dashboard/post-startup')}
                                size="lg"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Create Your First Startup
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Modal */}
            <EditStartupModal
                startup={editingStartup}
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={editFormData}
                loading={editLoading}
                onChange={handleEditChange}
                onSelectChange={handleEditSelectChange}
                onSubmit={handleEditSubmit}
                theme={theme}
            />
        </>
    );
};

export default UserGetStartups;