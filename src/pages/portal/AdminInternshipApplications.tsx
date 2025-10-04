import React, { useState, useEffect } from 'react';
import {
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    FileText,
    User,
    Mail,
    Phone,
    Star,
    Building
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface InternshipApplication {
    id: number;
    userId: number;
    internshipId?: number;
    resume?: string;
    skills?: string;
    motivation?: string;
    status: string;
    score?: number;
    notes?: string;
    education?: string;
    personal?: string;
    availability?: string;
    createdAt: string;
    User: {
        email: string;
        profile: {
            name: string;
            phone: string;
        } | null;
    };
}

interface ApplicationsResponse {
    status: string;
    data: InternshipApplication[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const InternshipApplications: React.FC = () => {
    const { theme } = useTheme();
    const [applications, setApplications] = useState<InternshipApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [updatingScore, setUpdatingScore] = useState<number | null>(null);

    // Modal state
    const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);




    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'Draft', label: 'DRAFT' },
        { value: 'Published', label: 'PUBLISHED' },
        { value: 'Closed', label: 'CLOSED' },
        { value: 'Archived', label: 'ARCHIVED' },
    ];

    const scoreOptions = [
        { value: '', label: 'All Scores' },
        { value: '80', label: '80+ Points' },
        { value: '60', label: '60+ Points' },
        { value: '40', label: '40+ Points' }
    ];

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {
                page: currentPage,
                limit: limit,
            };

            if (statusFilter) {
                params.status = statusFilter;
            }
            if (scoreFilter) {
                params.score_min = scoreFilter;
            }
            if (tagFilter) {
                params.tag = tagFilter;
            }

            const response = await api.get<ApplicationsResponse>('/admin/internship-applications', { params });

            if (response.data.status === 'success') {
                setApplications(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalCount(response.data.pagination.total);
            } else {
                setApplications([]);
                setError('No applications found');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [currentPage, statusFilter, scoreFilter, tagFilter]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            Submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            'Under Review': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            Draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
            Rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Draft;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3" />
                {status}
            </span>
        );
    };

    const getScoreBadge = (score?: number) => {
        if (!score) return null;

        let color = 'bg-gray-100 text-gray-800';
        if (score >= 80) color = 'bg-green-100 text-green-800';
        else if (score >= 60) color = 'bg-yellow-100 text-yellow-800';
        else if (score >= 40) color = 'bg-orange-100 text-orange-800';
        else color = 'bg-red-100 text-red-800';

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                <Star className="w-3 h-3" />
                {score} Points
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDetailView = (application: InternshipApplication) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };

    const handleDownloadResume = (application: InternshipApplication) => {
        if (application.resume) {
            // Create a simple resume content if URL is not available
            const resumeContent = `
                APPLICATION RESUME - ${application.User.profile?.name || 'Unknown'}
                ================================
                Email: ${application.User.email}
                Phone: ${application.User.profile?.phone || 'N/A'}
                Education: ${application.education || 'N/A'}
                Skills: ${application.skills || 'N/A'}
                Motivation: ${application.motivation || 'N/A'}
                Status: ${application.status}
                Score: ${application.score || 'N/A'}
                Applied: ${formatDate(application.createdAt)}
            `;

            const blob = new Blob([resumeContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `resume-${application.User.profile?.name || 'application'}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const closeModal = () => {
        setShowDetailModal(false);
        setSelectedApplication(null);
    };

    const clearFilters = () => {
        setStatusFilter('');
        setScoreFilter('');
        setTagFilter('');
        setCurrentPage(1);
    };


    const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
        setUpdatingStatus(applicationId);
        try {
            // Call your API to update the application status
            await api.patch(`/admin/internship-positions/${applicationId}`, {
                status: newStatus
            });

            // Update local state
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));

            // Update selected application in modal if it's the same one
            if (selectedApplication && selectedApplication.id === applicationId) {
                setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
            }

            // Optional: Show success message
            console.log(`Application ${applicationId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update application status:', error);
            // Optional: Show error message
        } finally {
            setUpdatingStatus(null);
        }
    }

    const handleScoreUpdate = async (applicationId: number, newScore: number) => {
        setUpdatingScore(applicationId);
        try {
            // Call your API to update the application score
            await api.patch(`/admin/internship-positions/${applicationId}`, {
                score: newScore
            });

            // Update local state
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, score: newScore } : app
            ));

            // Update selected application in modal if it's the same one
            if (selectedApplication && selectedApplication.id === applicationId) {
                setSelectedApplication(prev => prev ? { ...prev, score: newScore } : null);
            }

            console.log(`Application ${applicationId} score updated to ${newScore}`);
        } catch (error) {
            console.error('Failed to update application score:', error);
        } finally {
            setUpdatingScore(null);
        }
    };

    return (
        <>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Internship Applications</h1>
                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage and review internship applications ({totalCount} total)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">{applications.length} displayed</span>
                    </div>
                </div>

                {/* Filters */}
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Filter className="w-5 h-5 text-gray-400" />

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Score Filter */}
                        <select
                            value={scoreFilter}
                            onChange={(e) => {
                                setScoreFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            {scoreOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Tag/Skills Filter */}
                        <input
                            type="text"
                            placeholder="Filter by skill..."
                            value={tagFilter}
                            onChange={(e) => {
                                setTagFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                        />

                        {(statusFilter || scoreFilter || tagFilter) && (
                            <button
                                onClick={clearFilters}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                        }`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                            {error}
                        </p>
                    </div>
                )}

                {/* Applications List */}
                {!loading && applications.length > 0 && (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Applicant Icon */}
                                        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                                            <User className="w-6 h-6" />
                                        </div>

                                        {/* Application Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold text-lg">
                                                    {application.User.profile?.name || 'Unknown Applicant'}
                                                </h3>
                                                {getStatusBadge(application.status)}
                                                {getScoreBadge(application.score)}
                                            </div>

                                            <div className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-4 h-4" />
                                                        {application.User.email}
                                                    </span>
                                                    {application.User.profile?.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-4 h-4" />
                                                            {application.User.profile.phone}
                                                        </span>
                                                    )}
                                                    {application.internshipId && (
                                                        <span className="flex items-center gap-1">
                                                            <Building className="w-4 h-4" />
                                                            Internship #{application.internshipId}
                                                        </span>
                                                    )}
                                                </div>
                                                <p>Applied: {formatDate(application.createdAt)}</p>
                                                {application.skills && (
                                                    <p>Skills: {application.skills}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleDetailView(application)}
                                            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                }`}
                                            title="View Application Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>

                                        {application.resume && (
                                            <button
                                                onClick={() => handleDownloadResume(application)}
                                                className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                title="Download Resume"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && applications.length === 0 && !error && (
                    <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                        <FileText className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                        <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            No applications found
                        </h3>
                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                            {statusFilter || scoreFilter || tagFilter ? 'Try adjusting your filter criteria.' : 'No internship applications have been submitted yet.'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                            Showing page {currentPage} of {totalPages} ({totalCount} total applications)
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-50'
                                    } ${theme === 'dark'
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-50'
                                    } ${theme === 'dark'
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700'
                                    }`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Application Details Modal */}
            {showDetailModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}>
                        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className="text-lg font-semibold">Application Details</h3>
                            <button
                                onClick={closeModal}
                                className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Applicant Information */}
                            <div>
                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Applicant Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Name
                                        </span>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedApplication.User.profile?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Email
                                        </span>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedApplication.User.email}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Phone
                                        </span>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedApplication.User.profile?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Applied Date
                                        </span>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(selectedApplication.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Application Status */}
                            <div>
                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Application Status</h4>
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(selectedApplication.status)}
                                    {getScoreBadge(selectedApplication.score)}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div>
                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApplication.id, 'ARCHIVED')}
                                        disabled={selectedApplication.status === 'Archived'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedApplication.status === 'Accepted'
                                            ? 'bg-green-600 text-white cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApplication.id, 'CLOSED')}
                                        disabled={selectedApplication.status === 'Closed'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedApplication.status === 'Closed'
                                            ? 'bg-red-600 text-white cursor-not-allowed'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Closed
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApplication.id, 'PUBLISHED')}
                                        disabled={selectedApplication.status === 'Published'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedApplication.status === 'Published'
                                            ? 'bg-yellow-600 text-white cursor-not-allowed'
                                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                            }`}
                                    >
                                        <Clock className="w-4 h-4" />
                                        Published
                                    </button>
                                </div>
                            </div>

                            {/* Education */}
                            {selectedApplication.education && (
                                <div>
                                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Education</h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedApplication.education}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {selectedApplication.skills && (
                                <div>
                                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Skills</h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedApplication.skills}
                                    </p>
                                </div>
                            )}

                            {/* Motivation */}
                            {selectedApplication.motivation && (
                                <div>
                                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Motivation Letter</h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                                        {selectedApplication.motivation}
                                    </p>
                                </div>
                            )}

                            {/* Availability */}
                            {selectedApplication.availability && (
                                <div>
                                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Availability</h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedApplication.availability}
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedApplication.notes && (
                                <div>
                                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Internal Notes</h4>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                                        {selectedApplication.notes}
                                    </p>
                                </div>
                            )}

                            {/* Score Update */}
                            <div>
                                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Application Score</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={selectedApplication.score || ''}
                                            onChange={(e) => handleScoreUpdate(selectedApplication.id, parseInt(e.target.value) || 0)}
                                            className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                            placeholder="Enter score (0-100)"
                                        />
                                    </div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Current: {selectedApplication.score || 'Not scored'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex gap-3`}>
                            {selectedApplication.resume && (
                                <button
                                    onClick={() => handleDownloadResume(selectedApplication)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Resume
                                </button>
                            )}
                            <button
                                onClick={closeModal}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InternshipApplications;