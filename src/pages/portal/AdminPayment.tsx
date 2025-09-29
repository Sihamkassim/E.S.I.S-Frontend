import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Filter,
    Calendar,
    Users,
    Eye,
    Edit,
    Download,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    TrendingUp,
    FileText,
    Phone,
    Mail
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface Profile {
    name: string;
    phone?: string;
}

interface User {
    id: number;
    email: string;
    profile?: Profile;
}

interface Webinar {
    id: number;
    title: string;
    date: string;
    price: number;
}

interface Plan {
    name: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
    price: number;
}

interface Membership {
    id: number;
    startDate: string;
    endDate?: string;
    plan: Plan;
}

interface Payment {
    id: number;
    amount: number;
    transactionRef: string;
    currency: string;
    status: string;
    createdAt: string;
    user: User;
    webinar?: Webinar;
    membership?: Membership;
}

interface PaymentResponse {
    status: string;
    data: Payment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    statistics: {
        totalRevenue: number;
        statusBreakdown: Array<{
            status: string;
            _count: { _all: number };
            _sum: { amount: number };
        }>;
    };
}

const AdminPayments: React.FC = () => {
    const { theme } = useTheme();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statistics, setStatistics] = useState<any>(null);

    // Filters and pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [transactionSearch, setTransactionSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal states
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStatus, setEditingStatus] = useState('');

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'SUCCESS', label: 'SUCCESS' },
        { value: 'pending', label: 'Pending' },
        { value: 'FAILED', label: 'FAILED' },
    ];

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {
                page: currentPage,
                limit: limit,
            };

            if (statusFilter) params.status = statusFilter;
            if (userSearch.trim()) params.userSearch = userSearch.trim();
            if (transactionSearch.trim()) params.transactionRef = transactionSearch.trim();
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get<PaymentResponse>('/admin/payments', { params });

            if (response.data.status === 'success') {
                setPayments(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalCount(response.data.pagination.total);
                setStatistics(response.data.statistics);
            } else {
                setPayments([]);
                setError('No payments found');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [currentPage, statusFilter, userSearch, transactionSearch, startDate, endDate]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchPayments();
    };

    const clearFilters = () => {
        setStatusFilter('');
        setUserSearch('');
        setTransactionSearch('');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            SUCCESS: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle },
            Cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3" />
                {status}
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

    const getPaymentType = (payment: Payment) => {
        if (payment.webinar) {
            return {
                type: 'Webinar',
                name: payment.webinar.title,
                details: `Date: ${formatDate(payment.webinar.date)}`,
                icon: Calendar,
                color: 'text-blue-600 bg-blue-50'
            };
        } else if (payment.membership) {
            return {
                type: 'Membership',
                name: `${payment.membership.plan.name}`,
                details: `${payment.membership.plan.billingCycle} • ${payment.membership.plan.price.toLocaleString()} ETB`,
                icon: Users,
                color: 'text-purple-600 bg-purple-50'
            };
        } else {
            return {
                type: 'General',
                name: 'General Payment',
                details: 'Standard payment',
                icon: CreditCard,
                color: 'text-gray-600 bg-gray-50'
            };
        }
    };

    const handleViewDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDetailsModal(true);
    };

    const handleEditStatus = (payment: Payment) => {
        setSelectedPayment(payment);
        setEditingStatus(payment.status);
        setShowEditModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedPayment) return;

        try {
            await api.patch(`/admin/payments/${selectedPayment.id}/status`, {
                status: editingStatus
            });

            setShowEditModal(false);
            setSelectedPayment(null);
            fetchPayments();
        } catch (err: any) {
            setError(err.response?.data?.message || 'FAILED to update payment status');
        }
    };

    const handleExportPayments = () => {
        const csvContent = [
            ['Transaction ID', 'User', 'Email', 'Type', 'Amount', 'Status', 'Date'],
            ...payments.map(payment => [
                payment.transactionRef,
                payment.user.profile?.name || 'N/A',
                payment.user.email,
                getPaymentType(payment).type,
                `${payment.amount} ${payment.currency}`,
                payment.status,
                formatDate(payment.createdAt)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const closeModals = () => {
        setShowDetailsModal(false);
        setShowEditModal(false);
        setSelectedPayment(null);
        setEditingStatus('');
    };

    return (
        <>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {/* Header with Statistics */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Payment Management</h1>
                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Monitor and manage all payment transactions ({totalCount} total)
                            </p>
                        </div>
                        <button
                            onClick={handleExportPayments}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    {statistics && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Total Revenue
                                        </p>
                                        <p className="text-xl font-bold text-green-600">
                                            {statistics.totalRevenue.toLocaleString()} ETB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {statistics.statusBreakdown.map((stat: any) => (
                                <div key={stat.status} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {stat.status}
                                            </p>
                                            <p className="text-lg font-bold">
                                                {stat._count._all} ({(stat._sum.amount || 0).toLocaleString()} ETB)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Advanced Filters */}
                <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* User Search */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Search User</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Name or email..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className={`w-full pl-10 pr-4 outline-none py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Transaction Search */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                                <input
                                    type="text"
                                    placeholder="Transaction reference..."
                                    value={transactionSearch}
                                    onChange={(e) => setTransactionSearch(e.target.value)}
                                    className={`w-full px-3 py-2 outline-none rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
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
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Date Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={`flex-1 px-2 py-2 outline-none rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className={`flex-1 px-2 py-2 outline-none rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                            {(userSearch || transactionSearch || statusFilter || startDate || endDate) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Clear Filters
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

                {/* Payments Table */}
                {!loading && payments.length > 0 && (
                    <div className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Transaction</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((payment) => {
                                        const paymentType = getPaymentType(payment);
                                        const IconComponent = paymentType.icon;

                                        return (
                                            <tr key={payment.id} className={`hover:bg-opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                }`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-mono text-sm">{payment.transactionRef}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {payment.user.profile?.name || 'N/A'}
                                                        </div>
                                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                            }`}>
                                                            {payment.user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1 rounded ${paymentType.color}`}>
                                                            <IconComponent className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">{paymentType.type}</div>
                                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                                }`}>
                                                                {paymentType.details}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-green-600">
                                                        {payment.amount.toLocaleString()} {payment.currency}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {formatDate(payment.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(payment)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditStatus(payment)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Edit Status"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </div>
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
                {!loading && payments.length === 0 && !error && (
                    <div className={`text-center py-12 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                        <CreditCard className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                        <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            No payments found
                        </h3>
                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                            Try adjusting your search criteria or filters.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                            Showing page {currentPage} of {totalPages} ({totalCount} total payments)
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

            {/* Payment Details Modal */}
            {showDetailsModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-2xl rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Payment Details</h3>
                            <button
                                onClick={closeModals}
                                className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Payment Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg mb-3">Payment Information</h4>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Transaction ID:
                                            </span>
                                            <span className="font-mono text-sm">{selectedPayment.transactionRef}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Amount:
                                            </span>
                                            <span className="font-semibold text-lg text-green-600">
                                                {selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Status:
                                            </span>
                                            {getStatusBadge(selectedPayment.status)}
                                        </div>

                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Date:
                                            </span>
                                            <span className="text-sm">{formatDate(selectedPayment.createdAt)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Type:
                                            </span>
                                            <span className="text-sm">{getPaymentType(selectedPayment).type}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg mb-3">User Information</h4>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Name:
                                            </span>
                                            <span className="text-sm">{selectedPayment.user.profile?.name || 'N/A'}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Email:
                                            </span>
                                            <span className="text-sm flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {selectedPayment.user.email}
                                            </span>
                                        </div>

                                        {selectedPayment.user.profile?.phone && (
                                            <div className="flex justify-between">
                                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Phone:
                                                </span>
                                                <span className="text-sm flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {selectedPayment.user.profile.phone}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                User ID:
                                            </span>
                                            <span className="text-sm">#{selectedPayment.user.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            {(selectedPayment.webinar || selectedPayment.membership) && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-lg mb-3">Service Details</h4>

                                    {selectedPayment.webinar && (
                                        <div className="space-y-2">
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Webinar: <span className="font-medium text-blue-600">{selectedPayment.webinar.title}</span>
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Date: {formatDate(selectedPayment.webinar.date)}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Price: {selectedPayment.webinar.price.toLocaleString()} ETB
                                            </p>
                                        </div>
                                    )}

                                    {selectedPayment.membership && (
                                        <div className="space-y-2">
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Plan: <span className="font-medium text-purple-600">{selectedPayment.membership.plan.name}</span>
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Billing: {selectedPayment.membership.plan.billingCycle}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Plan Price: {selectedPayment.membership.plan.price.toLocaleString()} ETB
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Start Date: {formatDate(selectedPayment.membership.startDate)}
                                            </p>
                                            {selectedPayment.membership.endDate && (
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    End Date: {formatDate(selectedPayment.membership.endDate)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Status Modal */}
            {showEditModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Update Payment Status</h3>
                            <button
                                onClick={closeModals}
                                className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Transaction: {selectedPayment.transactionRef}
                                </p>
                                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Current Status: {getStatusBadge(selectedPayment.status)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">New Status</label>
                                <select
                                    value={editingStatus}
                                    onChange={(e) => setEditingStatus(e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    {statusOptions.filter(opt => opt.value).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={closeModals}
                                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPayments;