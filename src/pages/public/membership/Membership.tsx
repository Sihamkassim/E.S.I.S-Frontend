import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Star, Crown, Zap, Check, X as CloseIcon, ChevronRight, Award, Shield, Clock, Rocket } from 'lucide-react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection, StaggeredContainer } from '../HomePage/components/AnimatedComponents';
import Footer from '../HomePage/components/Footer';

// TypeScript Interfaces
interface Plan {
    id: number;
    name: string;
    price: number;
    billingCycle: 'MONTHLY' | 'ANNUAL';
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface PlansResponse {
    data: Plan[];
    pagination: Pagination;
}

interface NavItem {
    name: string;
    href: string;
}

const MembershipPage: React.FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async (): Promise<void> => {
        try {
            const result = await api.get('/public/get-plans');
            setPlans(result.data.data || []);
        } catch (err) {
            console.error('Error fetching plans:', err);
        }
    };

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'internship', href: '/internship' },
        { name: 'Community', href: '/community' },
        { name: 'Project', href: '/project' },
        { name: 'Webinar', href: '/Webinar' },
        { name: 'Membership', href: '/Membership' },
        { name: 'About', href: '/about-us' },
    ];

    const stats = [
        { icon: Users, value: '500+', label: 'Active Members' },
        { icon: Star, value: '98%', label: 'Satisfaction Rate' },
        { icon: Award, value: '50+', label: 'Expert Mentors' },
        { icon: Rocket, value: '24/7', label: 'Support' },
    ];

    const features = [
        {
            icon: Shield,
            title: 'Exclusive Access',
            description: 'Get early access to new features, webinars, and premium content before anyone else.',
            color: 'from-blue-500 to-indigo-500'
        },
        {
            icon: Zap,
            title: 'Priority Support',
            description: 'Jump to the front of the line with dedicated support and faster response times.',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: Crown,
            title: 'Premium Resources',
            description: 'Access our complete library of templates, tools, and learning materials.',
            color: 'from-purple-500 to-blue-500'
        },
        {
            icon: Users,
            title: 'Networking',
            description: 'Connect with industry leaders and like-minded professionals in exclusive forums.',
            color: 'from-blue-500 to-cyan-500'
        },
    ];

    const benefits = [
        "Access to all premium webinars",
        "Exclusive community channels",
        "Early feature access",
        "Priority technical support",
        "Professional certifications",
        "Mentorship programs",
        "Networking events",
        "Resource library access",
        "Career development tools",
        "Discounts on partner services"
    ];

    const getPlanIcon = (plan: Plan, index: number) => {
        if (plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('premium')) {
            return <Crown className="w-8 h-8" />;
        }
        if (plan.name.toLowerCase().includes('basic') || index === 0) {
            return <Star className="w-8 h-8" />;
        }
        return <Zap className="w-8 h-8" />;
    };

    const getPlanGradient = (plan: Plan, index: number): string => {
        if (plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('premium')) {
            return 'from-purple-600 to-indigo-600';
        }
        if (plan.name.toLowerCase().includes('basic') || index === 0) {
            return 'from-blue-600 to-indigo-600';
        }
        return 'from-indigo-600 to-purple-600';
    };

    const calculateAnnualSavings = (monthlyPrice: number, annualPrice: number): number => {
        const monthlyTotal = monthlyPrice * 12;
        return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
    };

    const handlePlanSelect = (plan: Plan): void => {
        setSelectedPlan(plan);
        setModalOpen(true);
    };

    const handleSubscribe = (plan: Plan): void => {
        navigate(`/membership/checkout?plan=${plan.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-slate-700 text-lg font-medium">Loading membership plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-lg'
                : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
                } h-16`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={'/images/ESIS.png'}
                            alt="ESIS Logo"
                            className="h-32 w-auto"
                        />
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-300">
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <button className="hidden md:block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                        Sign Up
                    </button>

                    <button
                        className="md:hidden text-slate-700 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200 z-40">
                        <nav className="flex flex-col px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-slate-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium mt-2 w-full shadow-md">
                                Sign Up
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Banner */}
            <AnimatedSection className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-1000 ease-out">
                {/* Desktop Blur Effects */}
                <div className="hidden lg:block">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-200/60 via-blue-300/40 to-teal-200/50 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-blue-300/50 via-purple-200/40 to-blue-200/60 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-blue-100/70 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                </div>

                {/* Tablet Blur Effects */}
                <div className="hidden sm:block lg:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-r from-blue-200/50 via-blue-300/35 to-teal-200/45 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-gradient-to-br from-blue-300/45 via-purple-200/35 to-blue-200/55 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-blue-100/65 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                </div>

                {/* Mobile Blur Effects */}
                <div className="block sm:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-r from-blue-200/45 via-blue-300/30 to-teal-200/40 rounded-full blur-2xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-gradient-to-br from-blue-300/40 via-purple-200/30 to-blue-200/50 rounded-full blur-xl transition-all duration-1000 ease-out"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] bg-blue-100/60 rounded-full blur-lg transition-all duration-1000 ease-out"></div>
                </div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <AnimatedSection>
                        <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                            Membership Plans
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-700 mb-8">
                            Choose Your Growth Path
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Unlock your potential with our flexible membership options. From basic access to premium benefits, find the perfect plan for your journey.
                        </div>
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={150}>
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm font-medium text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </StaggeredContainer>
                </div>
            </AnimatedSection>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Premium Benefits
                            </h2>
                            <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Get more than just access - become part of an exclusive community of innovators
                            </p>
                        </div>
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={150}>
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </StaggeredContainer>
                </div>
            </section>

            {/* Pricing Plans Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Choose Your Plan
                            </h2>
                            <p className="text-slate-600 max-w-3xl mx-auto text-lg">
                                Flexible options designed for every stage of your entrepreneurial journey
                            </p>
                        </div>
                    </AnimatedSection>

                    {plans.length === 0 ? (
                        <AnimatedSection>
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Crown className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">No Plans Available</h3>
                                <p className="text-slate-600 max-w-md mx-auto">
                                    Membership plans are currently being updated. Please check back soon.
                                </p>
                            </div>
                        </AnimatedSection>
                    ) : (
                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={150}>
                            {plans.map((plan, index) => {
                                const isPopular = plan.name.toLowerCase().includes('pro') || index === 1;
                                const annualSavings = plan.billingCycle === 'ANNUAL'
                                    ? calculateAnnualSavings(
                                        plans.find(p => p.billingCycle === 'MONTHLY' && p.name === plan.name)?.price || plan.price * 12,
                                        plan.price
                                    )
                                    : 0;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`group relative rounded-3xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${isPopular
                                            ? 'ring-4 ring-purple-600 shadow-2xl scale-105'
                                            : 'shadow-xl border border-slate-200'
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                                    Most Popular
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-gradient-to-br from-white to-slate-50 p-8">
                                            <div className="text-center mb-8">
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getPlanGradient(plan, index)} flex items-center justify-center text-white`}>
                                                    {getPlanIcon(plan, index)}
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                                <div className="flex items-baseline justify-center gap-2 mb-2">
                                                    <span className="text-4xl font-bold text-slate-900">
                                                        ${plan.price}
                                                    </span>
                                                    <span className="text-slate-600">
                                                        /{plan.billingCycle === 'ANNUAL' ? 'year' : 'month'}
                                                    </span>
                                                </div>
                                                {plan.billingCycle === 'ANNUAL' && annualSavings > 0 && (
                                                    <div className="text-green-600 font-semibold text-sm">
                                                        Save {annualSavings}% annually
                                                    </div>
                                                )}
                                                {plan.billingCycle === 'MONTHLY' && (
                                                    <div className="text-slate-500 text-sm">
                                                        Billed monthly
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                {benefits.slice(0, plan.name.toLowerCase().includes('basic') ? 4 : plan.name.toLowerCase().includes('pro') ? 8 : 6).map((benefit, benefitIndex) => (
                                                    <div key={benefitIndex} className="flex items-center">
                                                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                                        <span className="text-slate-700 text-sm">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handlePlanSelect(plan)}
                                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${isPopular
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                                                    }`}
                                            >
                                                Get Started
                                                <ChevronRight className="w-4 h-4 inline ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </StaggeredContainer>
                    )}

                    <AnimatedSection delay={600}>
                        <div className="text-center mt-12">
                            <p className="text-slate-600 text-sm">
                                All plans include a 14-day money-back guarantee. No long-term contracts.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Plan Comparison
                            </h2>
                            <p className="text-slate-600 max-w-3xl mx-auto text-lg">
                                See how our plans stack up against each other
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                        <th className="p-6 text-left">Features</th>
                                        {plans.map((plan) => (
                                            <th key={plan.id} className="p-6 text-center">
                                                {plan.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {benefits.map((benefit, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                            <td className="p-4 font-medium text-slate-900">{benefit}</td>
                                            {plans.map((plan) => (
                                                <td key={plan.id} className="p-4 text-center">
                                                    {index < (plan.name.toLowerCase().includes('basic') ? 4 :
                                                        plan.name.toLowerCase().includes('pro') ? 8 : 6) ? (
                                                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <CloseIcon className="w-5 h-5 text-slate-300 mx-auto" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Plan Detail Modal */}
            {modalOpen && selectedPlan && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity"
                            onClick={() => setModalOpen(false)}
                        ></div>

                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white">
                                <div className={`p-6 bg-gradient-to-r ${getPlanGradient(selectedPlan, plans.findIndex(p => p.id === selectedPlan.id))} text-white`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                                {getPlanIcon(selectedPlan, plans.findIndex(p => p.id === selectedPlan.id))}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                                                <p className="text-blue-100">Perfect for {selectedPlan.name.toLowerCase().includes('pro') ? 'professionals' : selectedPlan.name.toLowerCase().includes('basic') ? 'beginners' : 'growing teams'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-2 mb-2">
                                            <span className="text-4xl font-bold text-slate-900">
                                                ${selectedPlan.price}
                                            </span>
                                            <span className="text-slate-600">
                                                /{selectedPlan.billingCycle === 'ANNUAL' ? 'year' : 'month'}
                                            </span>
                                        </div>
                                        {selectedPlan.billingCycle === 'ANNUAL' && (
                                            <p className="text-green-600 font-semibold">
                                                Save {calculateAnnualSavings(
                                                    plans.find(p => p.billingCycle === 'MONTHLY' && p.name === selectedPlan.name)?.price || selectedPlan.price * 12,
                                                    selectedPlan.price
                                                )}% compared to monthly billing
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-lg font-semibold text-slate-900">What's included:</h3>
                                        {benefits.slice(0, selectedPlan.name.toLowerCase().includes('basic') ? 4 :
                                            selectedPlan.name.toLowerCase().includes('pro') ? 8 : 6).map((benefit, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                                                    <span className="text-slate-700">{benefit}</span>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <div className="flex items-center">
                                            <Shield className="w-5 h-5 text-blue-600 mr-2" />
                                            <span className="text-blue-900 font-medium">14-day money-back guarantee</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center">
                                    <div className="text-sm text-slate-600">
                                        Cancel anytime • No hidden fees
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                                        >
                                            Maybe Later
                                        </button>
                                        <button
                                            onClick={() => {
                                                setModalOpen(false);
                                                handleSubscribe(selectedPlan);
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                                        >
                                            Subscribe Now
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden mx-4 sm:mx-8 lg:mx-20 my-20 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <AnimatedSection>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Accelerate Your Growth?
                        </h2>
                    </AnimatedSection>
                    <AnimatedSection >
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of entrepreneurs who have transformed their careers with our membership programs.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-slate-100 transition-all duration-500 font-semibold text-lg shadow-2xl transform hover:scale-105">
                                Start Free Trial
                            </button>
                            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-500 font-semibold text-lg transform hover:scale-105">
                                Compare Plans
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default MembershipPage;