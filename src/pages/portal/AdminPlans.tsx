import React, { useState, useEffect } from 'react';
import { Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

interface Plan {
    id: number;
    name: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
    price: number;
}

interface PlanResponse {
    data: Plan[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface FormErrors {
    name?: string;
    billingCycle?: string;
    price?: string;
    global?: string;
}

const AdminPlans: React.FC = () => {
    const { theme } = useTheme();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [filters, setFilters] = useState({
        name: '',
        price: '',
        billingCycle: '' as '' | 'MONTHLY' | 'ANNUAL',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editPlan, setEditPlan] = useState<Plan | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        billingCycle: 'MONTHLY' as 'MONTHLY' | 'ANNUAL',
        price: '',
    });
    const [editErrors, setEditErrors] = useState<FormErrors>({});
    const [editLoading, setEditLoading] = useState(false);
    const [editSuccess, setEditSuccess] = useState<string | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<PlanResponse>('/admin/get-plan', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...filters,
                },
            });
            setPlans(response.data.data);
            setPagination(response.data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/admin/delete-plan/${id}`);
            fetchPlans();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleEditClick = (plan: Plan) => {
        setEditPlan(plan);
        setEditFormData({
            name: plan.name,
            billingCycle: plan.billingCycle,
            price: plan.price.toString(),
        });
        setEditErrors({});
        setEditSuccess(null);
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
        setEditErrors((prev) => ({ ...prev, [name]: undefined, global: undefined }));
        setEditSuccess(null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPlan) return;
        setEditLoading(true);
        setEditErrors({});
        setEditSuccess(null);

        try {
            const response = await api.patch(`/admin/update-plan/${editPlan.id}`, {
                ...editFormData,
                price: parseFloat(editFormData.price),
            });
            setEditSuccess(response.data.message || 'Plan updated successfully');
            fetchPlans();
            setTimeout(() => setEditPlan(null), 1000); // Close modal after 1s
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData?.errors && errorData.name === 'ZodError') {
                const fieldErrors: FormErrors | any = {};
                errorData.errors.forEach((error: any) => {
                    const field = error.path[0];
                    fieldErrors[field] = error.message;
                });
                setEditErrors(fieldErrors);
            } else {
                setEditErrors({
                    global: errorData?.message || err.message || 'Server error',
                });
            }
        } finally {
            setEditLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [pagination.page, filters]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1
                        className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Manage Plans
                    </h1>
                    <p
                        className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        View, edit, or delete subscription plans
                    </p>
                </div>
                <Link
                    to="/dashboard/add-plans"
                    className={`px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                        }`}
                >
                    Add Plan
                </Link>
            </div>

            {/* Filter Section */}
            <div
                className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
            >
                <h2
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        } mb-4`}
                >
                    Filter Plans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            Plan Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="Search by name"
                            className={`mt-1 w-full px-4 py-2 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="billingCycle"
                            className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            Billing Cycle
                        </label>
                        <select
                            id="billingCycle"
                            name="billingCycle"
                            value={filters.billingCycle}
                            onChange={handleFilterChange}
                            className={`mt-1 w-full px-4 py-2 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-primary`}
                        >
                            <option value="">All</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="ANNUAL">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="price"
                            className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={filters.price}
                            onChange={handleFilterChange}
                            placeholder="Search by price"
                            step="0.01"
                            min="0"
                            className={`mt-1 w-full px-4 py-2 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                    </div>
                </div>
            </div>

            {/* Plans Table */}
            <div
                className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
            >
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <div
                        className={`m-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
                            }`}
                    >
                        <p
                            className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                }`}
                        >
                            {error}
                        </p>
                    </div>
                )}

                {!loading && plans.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p
                            className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            No plans found.
                        </p>
                    </div>
                )}

                {plans.length > 0 && (
                    <div className="overflow-x-auto">
                        <table
                            className={`w-full text-left ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                }`}
                        >
                            <thead>
                                <tr
                                    className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}
                                >
                                    <th className="p-4 text-sm font-semibold">Name</th>
                                    <th className="p-4 text-sm font-semibold">Billing Cycle</th>
                                    <th className="p-4 text-sm font-semibold">Price ($)</th>
                                    <th className="p-4 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan) => (
                                    <tr
                                        key={plan.id}
                                        className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                            } hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                                            }`}
                                    >
                                        <td className="p-4">{plan.name}</td>
                                        <td className="p-4">{plan.billingCycle}</td>
                                        <td className="p-4">${plan.price.toFixed(2)}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(plan)}
                                                className={`p-2 rounded-lg ${theme === 'dark'
                                                    ? 'bg-gray-600 hover:bg-gray-500'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                    }`}
                                                title="Edit Plan"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className={`p-2 rounded-lg ${theme === 'dark'
                                                    ? 'bg-red-900/20 hover:bg-red-900/30'
                                                    : 'bg-red-100 hover:bg-red-200'
                                                    }`}
                                                title="Delete Plan"
                                                disabled={loading}
                                            >
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editPlan && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-opacity-70' : 'bg-opacity-50'
                        }`}
                >
                    <div
                        className={`relative w-full max-w-lg p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-2xl max-h-[90vh] overflow-y-auto`}
                    >
                        <button
                            onClick={() => setEditPlan(null)}
                            className={`absolute top-4 right-4 p-1 rounded-full ${theme === 'dark'
                                ? 'text-gray-400 hover:bg-gray-700'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2
                            className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Edit Plan
                        </h2>

                        {editLoading && (
                            <div className="flex items-center justify-center mb-6">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {editErrors.global && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
                                    }`}
                            >
                                <p
                                    className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                        }`}
                                >
                                    {editErrors.global}
                                </p>
                            </div>
                        )}

                        {editSuccess && (
                            <div
                                className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'
                                    }`}
                            >
                                <p
                                    className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                        }`}
                                >
                                    {editSuccess}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label
                                        htmlFor="edit-name"
                                        className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}
                                    >
                                        Plan Name
                                        <span
                                            className={`ml-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                        >
                                            (e.g., Basic, Premium)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-name"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditInputChange}
                                        placeholder="Enter plan name"
                                        className={`mt-1 w-full px-4 py-2 rounded-lg border ${editErrors.name
                                            ? 'border-red-500'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-primary`}
                                        required
                                        aria-describedby={editErrors.name ? 'edit-name-error' : undefined}
                                    />
                                    {editErrors.name && (
                                        <p
                                            id="edit-name-error"
                                            className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                                }`}
                                        >
                                            {editErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-billingCycle"
                                        className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}
                                    >
                                        Billing Cycle
                                        <span
                                            className={`ml-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                        >
                                            (Select billing frequency)
                                        </span>
                                    </label>
                                    <select
                                        id="edit-billingCycle"
                                        name="billingCycle"
                                        value={editFormData.billingCycle}
                                        onChange={handleEditInputChange}
                                        className={`mt-1 w-full px-4 py-2 rounded-lg border ${editErrors.billingCycle
                                            ? 'border-red-500'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-primary`}
                                        required
                                        aria-describedby={
                                            editErrors.billingCycle ? 'edit-billingCycle-error' : undefined
                                        }
                                    >
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="ANNUAL">Yearly</option>
                                    </select>
                                    {editErrors.billingCycle && (
                                        <p
                                            id="edit-billingCycle-error"
                                            className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                                }`}
                                        >
                                            {editErrors.billingCycle}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="edit-price"
                                        className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}
                                    >
                                        Price ($)
                                        <span
                                            className={`ml-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                        >
                                            (Enter price in USD, e.g., 9.99)
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        id="edit-price"
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleEditInputChange}
                                        placeholder="Enter price"
                                        step="0.01"
                                        min="0"
                                        className={`mt-1 w-full px-4 py-2 rounded-lg border ${editErrors.price
                                            ? 'border-red-500'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-primary`}
                                        required
                                        aria-describedby={editErrors.price ? 'edit-price-error' : undefined}
                                    />
                                    {editErrors.price && (
                                        <p
                                            id="edit-price-error"
                                            className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                                }`}
                                        >
                                            {editErrors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditPlan(null)}
                                    className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark'
                                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className={`px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                        } ${editLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {editLoading ? 'Updating...' : 'Update Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {plans.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} plans
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark'
                                ? 'bg-gray-600 text-gray-200'
                                : 'bg-gray-200 text-gray-700'
                                } ${!pagination.hasPrevPage
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-primary hover:text-white'
                                }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            className={`px-4 py-2 rounded-lg font-medium ${theme === 'dark'
                                ? 'bg-gray-600 text-gray-200'
                                : 'bg-gray-200 text-gray-700'
                                } ${!pagination.hasNextPage
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-primary hover:text-white'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlans;