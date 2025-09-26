import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { api } from '@/services/api';

interface Plan {
    id: number;
    name: string;
    billingCycle: 'MONTHLY' | 'ANNUAL';
    price: number;
}

interface PlanResponse {
    data: Plan[];
}

const UserPlans: React.FC = () => {
    const { theme } = useTheme();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<PlanResponse>('/user/get-plan', {
                params: { limit: 100 }, // Fetch all plans (assuming reasonable limit)
            });
            setPlans(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (plan: Plan) => {
        // Placeholder: Replace with actual subscription logic (e.g., API call or navigation)
        console.log(`Subscribing to plan: ${plan.name} (${plan.billingCycle})`);
        // Example: Navigate to /subscribe/:id
        // window.location.href = `/subscribe/${plan.id}`;
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
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

            {/* Plans Grid */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <div
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
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
                        No plans available.
                    </p>
                </div>
            )}

            {plans.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-6 rounded-xl shadow-lg border ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                                } flex flex-col justify-between`}
                        >
                            <div>
                                <h3
                                    className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {plan.name}
                                </h3>
                                <p
                                    className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}
                                >
                                    {plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'} Billing
                                </p>
                                <p
                                    className={`mt-4 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    ${plan.price.toFixed(2)}
                                    <span
                                        className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}
                                    >
                                        /{plan.billingCycle === 'MONTHLY' ? 'month' : 'year'}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => handleSubscribe(plan)}
                                className={`mt-6 px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                    }`}
                            >
                                Get {plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPlans;