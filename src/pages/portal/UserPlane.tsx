import React, { useState, useEffect } from 'react';
import { Loader2, X, Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';
import PaymentComponent from './PaymentComponent';

interface Plan {
    id: number;
    name: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
    price: number;
    description?: string;
    features?: string[];
}

interface PlanResponse {
    data: Plan[];
}

interface SelectedPlan {
    id: number;
    name: string;
    price: number;
    duration: number; // in months
}

const UserPlans: React.FC = () => {
    const { theme } = useTheme();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<PlanResponse>('/user/get-plan', {
                params: { limit: 100 },
            });
            setPlans(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (plan: Plan) => {
        const duration = plan.billingCycle === 'MONTHLY' ? 1 : 12;

        setSelectedPlan({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            duration: duration
        });
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = (data: any) => {
        console.log('Payment successful:', data);
        setShowPaymentModal(false);
        setSelectedPlan(null);
        // You can add success notification or redirect logic here
        // Example: toast.success('Subscription activated successfully!');
    };

    const handlePaymentError = (error: any) => {
        console.error('Payment failed:', error);
        // Keep modal open so user can retry
        // You can add error notification here
        // Example: toast.error('Payment failed. Please try again.');
    };

    const closeModal = (e?: React.MouseEvent) => {
        // Only close if clicking on backdrop
        if (!e || (e.target as Element).id === 'modal-backdrop') {
            setShowPaymentModal(false);
            setSelectedPlan(null);
        }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowPaymentModal(false);
            setSelectedPlan(null);
        }
    };

    useEffect(() => {
        if (showPaymentModal) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showPaymentModal]);

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <>
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1
                            className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            Subscription Plans
                        </h1>
                        <p
                            className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            Choose a plan that suits your needs
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div
                        className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
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

                {/* Empty State */}
                {!loading && plans.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p
                            className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            No plans available.
                        </p>
                    </div>
                )}

                {/* Plans Grid */}
                {plans.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    } flex flex-col`}
                            >
                                {/* Popular badge for annual plans */}
                                {plan.billingCycle === 'ANNUAL' && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h3
                                        className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.billingCycle === 'MONTHLY'
                                                ? theme === 'dark'
                                                    ? 'bg-blue-900/50 text-blue-300'
                                                    : 'bg-blue-100 text-blue-800'
                                                : theme === 'dark'
                                                    ? 'bg-green-900/50 text-green-300'
                                                    : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                                        </span>
                                        {plan.billingCycle === 'ANNUAL' && (
                                            <span
                                                className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                                    }`}
                                            >
                                                Save 2 months!
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-baseline">
                                            <span
                                                className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}
                                            >
                                                {plan.price.toLocaleString()} ETB
                                            </span>
                                            <span
                                                className={`ml-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}
                                            >
                                                /{plan.billingCycle === 'MONTHLY' ? 'month' : 'year'}
                                            </span>
                                        </div>
                                        {plan.billingCycle === 'ANNUAL' && (
                                            <p
                                                className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}
                                            >
                                                {(plan.price / 12).toLocaleString()} ETB per month
                                            </p>
                                        )}
                                    </div>

                                    {/* Features list (if available) */}
                                    {plan.features && plan.features.length > 0 && (
                                        <ul className="mt-6 space-y-3">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span
                                                        className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Description */}
                                    {plan.description && (
                                        <p
                                            className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                        >
                                            {plan.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className={`mt-6 w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${plan.billingCycle === 'ANNUAL'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                                            : 'bg-gray-800 hover:bg-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                        }`}
                                >
                                    Subscribe to {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Modal - Right Side */}
            {showPaymentModal && selectedPlan && (
                <div
                    id="modal-backdrop"
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-end"
                    onClick={closeModal}
                >
                    <div
                        className="h-full w-full max-w-md animate-slide-in-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PaymentComponent
                            amount={selectedPlan.price.toString()}
                            planId={selectedPlan.id.toString()}
                            duration={selectedPlan.duration.toString()}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            onClose={() => setShowPaymentModal(false)}
                        />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default UserPlans;