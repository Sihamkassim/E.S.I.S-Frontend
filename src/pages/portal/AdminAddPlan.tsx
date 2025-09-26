import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

interface PlanFormData {
    name: string;
    billingCycle: string;
    price: string;
}

interface FormErrors {
    name?: string;
    billingCycle?: string;
    price?: string;
    global?: string;
}

const AdminAddPlan: React.FC = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<PlanFormData>({
        name: '',
        billingCycle: 'MONTHLY',
        price: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined, global: undefined }));
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess(null);

        try {
            const response = await api.post('/admin/create-plan', {
                ...formData,
                price: parseFloat(formData.price),
            });

            setSuccess(response.data.message || 'Plan created successfully');
            setFormData({ name: '', billingCycle: 'MONTHLY', price: '' });
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData?.errors && errorData.name === 'ZodError') {
                const fieldErrors: FormErrors | any = {};
                errorData.errors.forEach((error: any) => {
                    const field = error.path[0];
                    fieldErrors[field] = error.message;
                });
                setErrors(fieldErrors);
            } else {
                setErrors({ global: errorData?.message || err.message || 'Server error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        to="/dashboard/membership-plans"
                        className={`p-2 rounded-lg ${theme === 'dark' ? ' hover:bg-gray-600' : ''
                            }`}
                        aria-label="Go back to plans"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1
                        className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Add New Plan
                    </h1>
                    <p
                        className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        Create a new subscription plan for users. Ensure all fields are filled
                        correctly.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div
                className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
            >
                {loading && (
                    <div className="flex items-center justify-center mb-6">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                )}

                {errors.global && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
                            }`}
                    >
                        <p
                            className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                }`}
                        >
                            {errors.global}
                        </p>
                    </div>
                )}

                {success && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'
                            }`}
                    >
                        <p
                            className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}
                        >
                            {success}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Plan Details Section */}
                    <div className="space-y-4">
                        <h2
                            className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}
                        >
                            Plan Details
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
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
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter plan name"
                                    className={`mt-1 w-full px-4 py-2 rounded-lg border ${errors.name
                                        ? 'border-red-500'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-gray-200'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-primary`}
                                    required
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                {errors.name && (
                                    <p
                                        id="name-error"
                                        className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                            }`}
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="billingCycle"
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
                                    id="billingCycle"
                                    name="billingCycle"
                                    value={formData.billingCycle}
                                    onChange={handleInputChange}
                                    className={`mt-1 w-full px-4 py-2 rounded-lg border ${errors.billingCycle
                                        ? 'border-red-500'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-gray-200'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-primary`}
                                    required
                                    aria-describedby={errors.billingCycle ? 'billingCycle-error' : undefined}
                                >
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="ANNUAL">Yearly</option>
                                </select>
                                {errors.billingCycle && (
                                    <p
                                        id="billingCycle-error"
                                        className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                            }`}
                                    >
                                        {errors.billingCycle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="price"
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
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                step="0.01"
                                min="0"
                                className={`mt-1 w-full px-4 py-2 rounded-lg border ${errors.price
                                    ? 'border-red-500'
                                    : theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                                required
                                aria-describedby={errors.price ? 'price-error' : undefined}
                            />
                            {errors.price && (
                                <p
                                    id="price-error"
                                    className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                        }`}
                                >
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ name: '', billingCycle: 'MONTHLY', price: '' })
                            }
                            className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark'
                                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                }`}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddPlan;