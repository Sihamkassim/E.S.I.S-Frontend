import React, { useState, useEffect } from 'react';
import { Loader2, Pencil, Trash2, X, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

// Types
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

// Sub-components
const PlanCard: React.FC<{
    plan: Plan;
    onEdit: (plan: Plan) => void;
    onDelete: (id: number) => void;
    loading: boolean;
    theme: string;
}> = ({ plan, onEdit, onDelete, loading, theme }) => (
    <div className={`
    p-6 rounded-xl border transition-all duration-200 hover:shadow-lg
    ${theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }
  `}>
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                </h3>
                <span className={`
          inline-block px-2 py-1 text-xs font-medium rounded-full mt-2
          ${plan.billingCycle === 'MONTHLY'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }
        `}>
                    {plan.billingCycle}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(plan)}
                    className={`
            p-2 rounded-lg transition-all duration-200 hover:scale-105
            ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }
          `}
                    title="Edit Plan"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(plan.id)}
                    disabled={loading}
                    className={`
            p-2 rounded-lg transition-all duration-200 hover:scale-105
            ${theme === 'dark'
                            ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                        }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                    title="Delete Plan"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className={`
      text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
    `}>
            ${plan.price.toFixed(2)}
            <span className={`
        text-sm font-normal ml-1
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
      `}>
                /{plan.billingCycle === 'MONTHLY' ? 'month' : 'year'}
            </span>
        </div>
    </div>
);

const FilterSection: React.FC<{
    filters: any;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    theme: string;
}> = ({ filters, onFilterChange, theme }) => (
    <div className={`
    p-6 rounded-xl border transition-all duration-200
    ${theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
            : 'bg-white border-gray-200 shadow-sm'
        }
  `}>
        <h2 className={`
      text-lg font-semibold mb-4 flex items-center gap-2
      ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}
    `}>
            <Filter className="w-5 h-5" />
            Filter Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="name" className={`
          block text-sm font-medium mb-2
          ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
        `}>
                    Plan Name
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={filters.name}
                        onChange={onFilterChange}
                        placeholder="Search plans..."
                        className={`
              w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
              ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                            }
            `}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="billingCycle" className={`
          block text-sm font-medium mb-2
          ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
        `}>
                    Billing Cycle
                </label>
                <select
                    id="billingCycle"
                    name="billingCycle"
                    value={filters.billingCycle}
                    onChange={onFilterChange}
                    className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
            ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                        }
          `}
                >
                    <option value="">All Cycles</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="ANNUAL">Annual</option>
                </select>
            </div>

            <div>
                <label htmlFor="price" className={`
          block text-sm font-medium mb-2
          ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
        `}>
                    Max Price ($)
                </label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={filters.price}
                    onChange={onFilterChange}
                    placeholder="Set maximum price"
                    step="0.01"
                    min="0"
                    className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
            ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                        }
          `}
                />
            </div>
        </div>
    </div>
);

const EditModal: React.FC<{
    plan: Plan | null;
    formData: any;
    errors: FormErrors;
    loading: boolean;
    success: string | null;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    theme: string;
}> = ({ plan, formData, errors, loading, success, onClose, onSubmit, onInputChange, theme }) => {
    if (!plan) return null;

    return (
        <div className={`
      fixed bottom-0 right-0 left-0 -top-7 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50
      ${theme === 'dark' ? 'bg-opacity-70' : 'bg-opacity-50'}
    `}>
            <div className={`
        relative top-0 w-full max-w-md p-6 rounded-2xl transition-all duration-200
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        shadow-2xl
      `}>
                <button
                    onClick={onClose}
                    className={`
            absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110
            ${theme === 'dark'
                            ? 'text-gray-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-200'
                        }
          `}
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className={`
          text-2xl font-bold mb-2
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
                    Edit Plan
                </h2>
                <p className={`
          text-sm mb-6
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
        `}>
                    Update the plan details below
                </p>

                {loading && (
                    <div className="flex items-center justify-center mb-6 py-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                )}

                {errors.global && (
                    <div className={`
            mb-6 p-4 rounded-lg border transition-all duration-200
            ${theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}
          `}>
                        <p className={`
              text-sm font-medium
              ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}
            `}>
                            {errors.global}
                        </p>
                    </div>
                )}

                {success && (
                    <div className={`
            mb-6 p-4 rounded-lg border transition-all duration-200
            ${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}
          `}>
                        <p className={`
              text-sm font-medium
              ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
            `}>
                            {success}
                        </p>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
            `}>
                            Plan Name
                        </label>
                        <input
                            type="text"
                            id="edit-name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Enter plan name"
                            className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                ${errors.name ? 'border-red-500' :
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                                }
              `}
                            required
                        />
                        {errors.name && (
                            <p className={`
                mt-1 text-sm
                ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}
              `}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="edit-billingCycle" className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
            `}>
                            Billing Cycle
                        </label>
                        <select
                            id="edit-billingCycle"
                            name="billingCycle"
                            value={formData.billingCycle}
                            onChange={onInputChange}
                            className={`
                w-full px-4 py-3 rounded-lg border transition-all duration-200
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                ${errors.billingCycle ? 'border-red-500' :
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                                }
              `}
                            required
                        >
                            <option value="MONTHLY">Monthly</option>
                            <option value="ANNUAL">Annual</option>
                        </select>
                        {errors.billingCycle && (
                            <p className={`
                mt-1 text-sm
                ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}
              `}>
                                {errors.billingCycle}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="edit-price" className={`
                        block text-sm font-medium mb-2
                        ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
                        `}>
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="edit-price"
                            name="price"
                            value={formData.price}
                            onChange={onInputChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`
                                        w-full px-4 py-3 rounded-lg border transition-all duration-200
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                                        ${errors.price ? 'border-red-500' :
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                                }
                               `}
                            required
                        />
                        {errors.price && (
                            <p className={`
                                        mt-1 text-sm
                                        ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}
                                    `}>
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`
                                flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                                ${theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }
                            `}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                        flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all duration-200
                                        bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                        ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                        >
                            {loading ? 'Updating...' : 'Update Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Pagination: React.FC<{
    pagination: any;
    onPageChange: (page: number) => void;
    theme: string;
}> = ({ pagination, onPageChange, theme }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <p className={`
      text-sm
      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
    `}>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} plans
        </p>

        <div className="flex items-center gap-2">
            <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className={`
                        p-2 rounded-lg border transition-all duration-200 hover:scale-105
                        ${!pagination.hasPrevPage
                        ? 'opacity-50 cursor-not-allowed'
                        : theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                        `}
            >
                <ChevronLeft className={`w-4 h-4
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>

            <span className={`
                            px-3 py-1 text-sm font-medium
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                        `}>
                Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className={`
                        p-2 rounded-lg border transition-all duration-200 hover:scale-105
                        ${!pagination.hasNextPage
                        ? 'opacity-50 cursor-not-allowed'
                        : theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                        `}
            >
                <ChevronRight className={`w-4 h-4
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
        </div>
    </div>
);

// Main Component
const AdminPlans: React.FC = () => {
    const { theme } = useTheme();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 9, // Changed to 9 for 3x3 grid
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
            setError(err.response?.data?.message || err.message || 'Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await api.delete(`/admin/delete-plan/${id}`);
            await fetchPlans(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete plan');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
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

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
        setEditErrors(prev => ({ ...prev, [name]: undefined, global: undefined }));
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
            await fetchPlans(); // Refresh the list

            setTimeout(() => {
                setEditPlan(null);
            }, 1500);
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData?.errors && errorData.name === 'ZodError') {
                const fieldErrors: FormErrors = {};
                errorData.errors.forEach((error: any) => {
                    const field = error.path[0];
                    fieldErrors[field as keyof FormErrors] = error.message;
                });
                setEditErrors(fieldErrors);
            } else {
                setEditErrors({
                    global: errorData?.message || err.message || 'Failed to update plan',
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
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className={`
            text-3xl font-bold
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}>
                        Plan Management
                    </h1>
                    <p className={`
            mt-2 text-lg
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}>
                        Create, edit, and manage subscription plans
                    </p>
                </div>

                <Link
                    to="/dashboard/add-plans"
                    className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200
            hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
          `}
                >
                    <Plus className="w-5 h-5" />
                    Add New Plan
                </Link>
            </div>

            {/* Filters */}
            <FilterSection
                filters={filters}
                onFilterChange={handleFilterChange}
                theme={theme}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className={`
              text-lg
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}>
                            Loading plans...
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className={`
                            p-6 rounded-xl border text-center
                            ${theme === 'dark'
                        ? 'bg-red-900/20 border-red-800 text-red-400'
                        : 'bg-red-50 border-red-200 text-red-600'
                    }
                            `}>
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={fetchPlans}
                        className={`
                            mt-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${theme === 'dark'
                                ? 'bg-red-900/30 hover:bg-red-900/40'
                                : 'bg-red-100 hover:bg-red-200'
                            }
                            `}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Plans Grid */}
            {!loading && plans.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                                loading={loading}
                                theme={theme}
                            />
                        ))}
                    </div>

                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        theme={theme}
                    />
                </>
            )}

            {/* Empty State */}
            {!loading && plans.length === 0 && !error && (
                <div className={`
                            text-center py-20 rounded-xl border
                            ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    }
                            `}>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Plus className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className={`
                            text-xl font-semibold mb-2
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                        `}>
                        No plans found
                    </h3>
                    <p className={`
                                mb-6 max-w-md mx-auto
                                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                            `}>
                        {filters.name || filters.billingCycle || filters.price
                            ? 'Try adjusting your filters to see more results.'
                            : 'Get started by creating your first subscription plan.'
                        }
                    </p>
                    <Link
                        to="/dashboard/add-plans"
                        className={`
                                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                                text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200
                                `}
                    >
                        <Plus className="w-5 h-5" />
                        Create First Plan
                    </Link>
                </div>
            )}

            {/* Edit Modal */}
            <EditModal
                plan={editPlan}
                formData={editFormData}
                errors={editErrors}
                loading={editLoading}
                success={editSuccess}
                onClose={() => setEditPlan(null)}
                onSubmit={handleEditSubmit}
                onInputChange={handleEditInputChange}
                theme={theme}
            />
        </div>
    );
};

export default AdminPlans;