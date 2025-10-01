import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface Plan {
    id: number;
    name: string;
    price: number;
    billingCycle: 'MONTHLY' | 'ANNUAL';
}

interface User {
    id: number;
    email: string;
    profile?: {
        name: string;
    };
}

interface Membership {
    id: number;
    status: string;
    startDate: string;
    endDate: string | null;
    plan: Plan;
    user: User;
    createdAt: string;
    updatedAt: string;
}

interface MembershipResponse {
    status: boolean;
    data: Membership[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const AdminMembership: React.FC = () => {
    const { theme } = useTheme();
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [userSearch, setUserSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchMemberships = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {
                page: currentPage,
                limit: limit,
            };

            if (userSearch.trim()) {
                params.userSearch = userSearch.trim();
            }

            if (statusFilter) {
                params.status = statusFilter;
            }

            const response = await api.get<MembershipResponse>('/admin/membership', { params });

            if (response.data.status) {
                setMemberships(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalCount(response.data.pagination.total);
            } else {
                setMemberships([]);
                setError('No memberships found');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
            setMemberships([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, [currentPage, userSearch, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMemberships();
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            EXPIRED: { color: 'bg-red-100 text-red-800', icon: XCircle },
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3" />
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (endDate: string | null) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Membership Management</h1>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage and monitor user memberships ({totalCount} total)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">{memberships.length} displayed</span>
                </div>
            </div>

            {/* Search and Status Filter */}
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by user name or email..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 outline-none focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                        {(userSearch || statusFilter) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setUserSearch('');
                                    setStatusFilter('');
                                }}
                                className={`px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>
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

            {/* Memberships Table */}
            {!loading && memberships.length > 0 && (
                <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Days Left</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {memberships.map((membership) => {
                                    const daysRemaining = getDaysRemaining(membership.endDate);
                                    return (
                                        <tr key={membership.id} className={`hover:bg-opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                            }`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {membership.user.profile?.name || 'N/A'}
                                                    </div>
                                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {membership.user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium">{membership.plan.name}</div>
                                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {membership.plan.price.toLocaleString()} ETB • {membership.plan.billingCycle}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(membership.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {formatDate(membership.startDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {formatDate(membership.endDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {daysRemaining !== null ? (
                                                    <span className={`text-sm font-medium ${daysRemaining < 0 ? 'text-red-600' :
                                                        daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'
                                                        }`}>
                                                        {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && memberships.length === 0 && !error && (
                <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <Users className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                    <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        No memberships found
                    </h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                        {userSearch || statusFilter ? 'Try adjusting your search criteria.' : 'No memberships available.'}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                        Showing page {currentPage} of {totalPages} ({totalCount} total entries)
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
    );
};

export default AdminMembership;