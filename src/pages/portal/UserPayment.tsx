import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Users,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    FileText
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface Webinar {
    id: number;
    title: string;
    date: string;
}

interface Plan {
    name: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
}

interface Membership {
    id: number;
    plan: Plan;
}

interface Payment {
    id: number;
    amount: number;
    transactionRef: string;
    currency: string;
    status: string;
    createdAt: string;
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
}

const UserPayments: React.FC = () => {
    const { theme } = useTheme();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');

    // Modal state
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'SUCCESS', label: 'Success' },
        { value: 'pending', label: 'Pending' },
        { value: 'FAILED', label: 'Failed' }
    ];

    const fetchPayments = async () => {
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

            const response = await api.get<PaymentResponse>('/user/payments', { params });

            if (response.data.status === 'success') {
                setPayments(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalCount(response.data.pagination.total);
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
    }, [currentPage, statusFilter]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            SUCCESS: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
                icon: Calendar,
                color: 'text-blue-600 bg-blue-50'
            };
        } else if (payment.membership) {
            return {
                type: 'Membership',
                name: `${payment.membership.plan.name} (${payment.membership.plan.billingCycle})`,
                icon: Users,
                color: 'text-purple-600 bg-purple-50'
            };
        } else {
            return {
                type: 'Payment',
                name: 'General Payment',
                icon: CreditCard,
                color: 'text-gray-600 bg-gray-50'
            };
        }
    };

    const handleTransactionView = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowTransactionModal(true);
    };

    const handleDownloadReceipt = (payment: Payment) => {
        // Create a simple receipt content
        const receiptContent = `
PAYMENT RECEIPT
==============
Transaction ID: ${payment.transactionRef}
Amount: ${payment.amount.toLocaleString()} ${payment.currency}
Status: ${payment.status}
Date: ${formatDate(payment.createdAt)}
Type: ${getPaymentType(payment).name}

Thank you for your payment!
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `receipt-${payment.transactionRef}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const closeModal = () => {
        setShowTransactionModal(false);
        setSelectedPayment(null);
    };

    return (
        <>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">My Payments</h1>
                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Track your payment history and download receipts ({totalCount} total)
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="text-sm font-medium">{payments.length} displayed</span>
                    </div>
                </div>

                {/* Status Filter */}
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
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
                        {statusFilter && (
                            <button
                                onClick={() => {
                                    setStatusFilter('');
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${theme === 'dark'
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Clear Filter
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

                {/* Payments List */}
                {!loading && payments.length > 0 && (
                    <div className="space-y-4">
                        {payments.map((payment) => {
                            const paymentType = getPaymentType(payment);
                            const IconComponent = paymentType.icon;

                            return (
                                <div
                                    key={payment.id}
                                    className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Payment Type Icon */}
                                            <div className={`p-3 rounded-lg ${paymentType.color}`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>

                                            {/* Payment Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg truncate">
                                                        {paymentType.name}
                                                    </h3>
                                                    {getStatusBadge(payment.status)}
                                                </div>

                                                <div className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    <p>Transaction: {payment.transactionRef}</p>
                                                    <p>Date: {formatDate(payment.createdAt)}</p>
                                                    <p>Type: {paymentType.type}</p>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {payment.amount.toLocaleString()} {payment.currency}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleTransactionView(payment)}
                                                className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                title="View Transaction Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            {payment.status === 'SUCCESS' && (
                                                <button
                                                    onClick={() => handleDownloadReceipt(payment)}
                                                    className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                    title="Download Receipt"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                            {statusFilter ? 'Try adjusting your filter criteria.' : 'You haven\'t made any payments yet.'}
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

            {/* Transaction Details Modal */}
            {showTransactionModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Transaction Details</h3>
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

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Transaction ID
                                </span>
                                <span className="font-mono text-sm">{selectedPayment.transactionRef}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Amount
                                </span>
                                <span className="font-semibold text-lg text-green-600">
                                    {selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Status
                                </span>
                                {getStatusBadge(selectedPayment.status)}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Date
                                </span>
                                <span className="text-sm">{formatDate(selectedPayment.createdAt)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Type
                                </span>
                                <span className="text-sm">{getPaymentType(selectedPayment).name}</span>
                            </div>
                        </div>

                        {selectedPayment.status === 'SUCCESS' && (
                            <div className="p-6 border-t border-gray-200">
                                <button
                                    onClick={() => handleDownloadReceipt(selectedPayment)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Receipt
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserPayments;