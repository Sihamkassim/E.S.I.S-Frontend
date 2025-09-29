import React, { useState, useEffect } from 'react';
import { CreditCard, Phone, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { api } from '@/services/api';

interface PaymentComponentProps {
    amount?: string;
    planId?: string;
    duration?: string;
    webinarId?: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onClose?: () => void;
}

// Payment method configuration with proper logo structure
const PAYMENT_METHODS = [
    {
        type: 'telebirr',
        name: 'TeleBirr',
        logo: '/telebirr.png',
        color: 'text-orange-600',
        borderColor: 'border-orange-300',
        bgColor: 'bg-orange-50',
        darkBgColor: 'bg-orange-900/20',
        darkBorderColor: 'border-orange-600'
    },
    {
        type: 'mpesa',
        name: 'M-Pesa',
        logo: '/m-pessa.png',
        color: 'text-green-600',
        borderColor: 'border-green-300',
        bgColor: 'bg-green-50',
        darkBgColor: 'bg-green-900/20',
        darkBorderColor: 'border-green-600'
    },
    {
        type: 'cbebirr',
        name: 'CBE Birr',
        logo: '/cbeBirr.png',
        color: 'text-blue-600',
        borderColor: 'border-blue-300',
        bgColor: 'bg-blue-50',
        darkBgColor: 'bg-blue-900/20',
        darkBorderColor: 'border-blue-600'
    },
    {
        type: 'ebirr',
        name: 'eBirr',
        logo: '/eBirr.png',
        color: 'text-purple-600',
        borderColor: 'border-purple-300',
        bgColor: 'bg-purple-50',
        darkBgColor: 'bg-purple-900/20',
        darkBorderColor: 'border-purple-600'
    }
];

const PaymentComponent: React.FC<PaymentComponentProps> = ({
    amount: propAmount,
    planId,
    duration,
    webinarId,
    onSuccess,
    onError,
    onClose
}) => {
    // State management
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Initialize amount from props or URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryAmount = urlParams.get('amount');
        setAmount(queryAmount || propAmount || '');
    }, [propAmount]);

    // Format mobile number to Ethiopian standard
    const formatMobileNumber = (value: string): string => {
        let cleaned = value.replace(/\D/g, '');
        return cleaned;
    };

    // Handle mobile number input changes
    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatMobileNumber(e.target.value);
        setMobile(formatted);
    };

    // Validate Ethiopian mobile number
    const isValidEthiopianMobile = (number: string): boolean => {
        const ethiopianMobileRegex = /^(\+251|251|0)?[79]\d{8}$/;
        return ethiopianMobileRegex.test(number.replace(/\s/g, ''));
    };

    // Validate form inputs
    const validateForm = (): boolean => {
        if (!selectedPaymentType) {
            setError('Please select a payment method');
            return false;
        }

        if (!mobile) {
            setError('Please enter your mobile number');
            return false;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return false;
        }

        return true;
    };

    // Process payment
    const handlePayment = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const payload: any = {
                amount: parseFloat(amount),
                mobile: mobile.replace(/\s/g, '').replace(/^\+251|^251|^0/, '+251'),
            };

            if (planId) payload.planId = planId;
            if (duration) payload.duration = duration;
            if (webinarId) payload.webinarId = webinarId;

            const response = await api.post(
                `payment/direct-mobile-pay?type=${selectedPaymentType}`,
                payload
            );

            if (response.data.status === 'success') {
                const methodName = PAYMENT_METHODS.find(m => m.type === selectedPaymentType)?.name || selectedPaymentType;
                setSuccess(`${methodName} payment initialized successfully!`);
                onSuccess?.(response.data);
            } else {
                setError(response.data.message || 'Payment initialization failed');
                onError?.(response.data);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to process payment';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Render payment method buttons with full-cover logos
    const renderPaymentMethods = () => (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => (
                    <div key={method.type} className="flex flex-col items-center">
                        <button
                            onClick={() => setSelectedPaymentType(method.type)}
                            className={`w-20 h-20 rounded-lg border-2 transition-all duration-200 overflow-hidden mx-auto
                            ${selectedPaymentType === method.type
                                    ? `border-blue-500 dark:border-blue-400 ${method.bgColor} dark:${method.darkBgColor}`
                                    : `border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500`
                                }`}
                        >
                            {/* Logo covering entire box */}
                            <div className="w-full h-full flex items-center justify-center ">
                                <img
                                    src={method.logo}
                                    alt={method.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className={`hidden text-lg font-bold ${method.color}`}>
                                    {method.name.charAt(0)}
                                </div>
                            </div>
                        </button>

                        {/* Payment method name below the box */}
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center mt-1">
                            {method.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    // Render amount display
    const renderAmountDisplay = () => (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Amount (ETB)
            </label>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {amount ? `${parseFloat(amount).toLocaleString()} ETB` : '0.00 ETB'}
            </div>
            {!propAmount && (
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    step="0.01"
                />
            )}
        </div>
    );

    // Render mobile input
    const renderMobileInput = () => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Mobile Number
            </label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="+251 9 1234 5678"
                    className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter your Ethiopian mobile number (e.g., +251 9 1234 5678)
            </p>
        </div>
    );

    // Render action buttons
    const renderActionButtons = () => (
        <div className="space-y-4">
            <button
                onClick={handlePayment}
                disabled={isLoading || !selectedPaymentType || !mobile || !amount}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 text-lg 
                    ${isLoading || !selectedPaymentType || !mobile || !amount
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl'
                    }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                    </div>
                ) : (
                    `Pay ${amount ? `${parseFloat(amount).toLocaleString()} ETB` : ''}`
                )}
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p className="flex items-center justify-center gap-2">
                    <span>🔒</span>
                    <span>Secure payment powered by Chapa</span>
                </p>
                <p>Your payment information is encrypted and secure</p>
            </div>
        </div>
    );

    // Render status messages
    const renderStatusMessages = () => (
        <>
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                </div>
            )}
        </>
    );

    return (
        <div className="h-full bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto w-full">
            {/* Header */}
            <div className="bg-blue-600 dark:bg-blue-800 p-6 text-white sticky top-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6" />
                        <div>
                            <h2 className="text-xl font-bold">Complete Your Payment</h2>
                            <p className="text-blue-100 dark:text-blue-200 text-sm">Secure mobile payment</p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            aria-label="Close payment"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-w-md mx-auto w-full">
                {renderAmountDisplay()}
                {renderPaymentMethods()}
                {renderMobileInput()}
                {renderStatusMessages()}
                {renderActionButtons()}
            </div>
        </div>
    );
};

export default PaymentComponent;