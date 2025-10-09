import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Clock, Calendar, MapPin, DollarSign, Play, Target, Eye, Heart, Zap, Globe, Award, BookOpen, Rocket, Code, TrendingUp, MessageCircle, Lightbulb, Star } from 'lucide-react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../HomePage/components/Footer';

// TypeScript Interfaces
interface Question {
    type: string;
    options: string[];
    question: string;
}

interface Answer {
    type: string;
    answer: string;
    question: string;
}

interface Application {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    answers: {
        [key: string]: Answer;
    } | null;
}

interface Webinar {
    id: number;
    title: string;
    slug: string;
    description: string;
    schedule: string;
    capacity: number;
    price: number;
    requiresPayment: boolean;
    location: string;
    speaker: string;
    image: string | null;
    duration: number;
    status: string;
    isPublished: boolean;
    questions: Question[];
    faq: string | null;
    refundPolicy: string;
    _count: {
        tickets: number;
    };
    applications: Application[];
    availableSpots: number;
}

interface WebinarDetail extends Webinar {
    // Additional fields that might come from detail API
}

interface NavItem {
    name: string;
    href: string;
}

const WebinarPage: React.FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedWebinar, setSelectedWebinar] = useState<WebinarDetail | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
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
        fetchWebinars();
    }, []);

    const fetchWebinars = async (): Promise<void> => {
        try {
            setLoading(true);
            const result = await api.get('/public/webinars');
            setWebinars(result.data.data || []);
        } catch (err) {
            console.error('Error fetching webinars:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWebinarDetail = async (id: number): Promise<void> => {
        try {
            setDetailLoading(true);
            const result = await api.get(`/public/webinars/${id}`);
            setSelectedWebinar(result.data.data);
            setModalOpen(true);
        } catch (err) {
            console.error('Error fetching webinar details:', err);
        } finally {
            setDetailLoading(false);
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
        { icon: Users, value: '200+', label: 'Active Learners' },
        { icon: Clock, value: '30+', label: 'Hours of Content' },
        { icon: Calendar, value: '34+', label: 'Webinars Hosted' },
        { icon: Play, value: '50+', label: 'Expert Speakers' },
    ];

    const features = [
        {
            icon: Target,
            title: 'Expert-Led Sessions',
            description: 'Learn from industry professionals with years of experience in their fields.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            title: 'Interactive Learning',
            description: 'Engage in live Q&A sessions and interactive discussions with speakers.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Globe,
            title: 'Global Community',
            description: 'Connect with like-minded learners from around the world.',
            color: 'from-green-500 to-teal-500'
        },
        {
            icon: Award,
            title: 'Certification',
            description: 'Receive certificates of completion for your professional development.',
            color: 'from-orange-500 to-red-500'
        },
    ];

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format price display
    const formatPrice = (price: number, requiresPayment: boolean): string => {
        if (!requiresPayment) return 'Free';
        return `$${price}`;
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'upcoming':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'live':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const handleWebinarClick = async (webinar: Webinar): Promise<void> => {
        await fetchWebinarDetail(webinar.id);
    };

    const handleRegisterClick = (webinar: Webinar, e: React.MouseEvent): void => {
        e.stopPropagation();
        navigate(`/webinars/${webinar.id}/register`);
    };


    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
                : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
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
                            <a key={item.name} href={item.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    <button className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Sign Up
                    </button>

                    <button
                        className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 z-40">
                        <nav className="flex flex-col px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium mt-2 w-full">
                                Sign Up
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Banner */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Desktop Blur Effects */}
                <div className="hidden lg:block">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-200/60 via-blue-300/40 to-teal-200/50 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-blue-300/50 via-purple-200/40 to-blue-200/60 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-blue-100/70 rounded-full blur-xl"></div>
                </div>

                {/* Tablet Blur Effects */}
                <div className="hidden sm:block lg:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-r from-blue-200/50 via-blue-300/35 to-teal-200/45 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-gradient-to-br from-blue-300/45 via-purple-200/35 to-blue-200/55 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-blue-100/65 rounded-full blur-xl"></div>
                </div>

                {/* Mobile Blur Effects */}
                <div className="block sm:hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-r from-blue-200/45 via-blue-300/30 to-teal-200/40 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-gradient-to-br from-blue-300/40 via-purple-200/30 to-blue-200/50 rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] bg-blue-100/60 rounded-full blur-lg"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        Expert Webinars
                    </div>
                    <div className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-600 mb-8">
                        Learn from Industry Leaders
                    </div>
                    <div className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join interactive sessions with top professionals and enhance your skills with cutting-edge knowledge and practical insights.
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm font-medium text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Join Our Webinars?
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                            Experience learning that transforms your skills and career
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Webinars Grid Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Upcoming Webinars
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                            Discover our curated selection of expert-led sessions
                        </p>
                    </div>

                    {webinars.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Webinars Available</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Check back later for upcoming webinar sessions and learning opportunities.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {webinars.map((webinar) => (
                                <div
                                    key={webinar.id}
                                    className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                                    onClick={() => handleWebinarClick(webinar)}
                                >
                                    {/* Webinar Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                                        {webinar.image ? (
                                            <img
                                                src={webinar.image}
                                                alt={webinar.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Play className="w-16 h-16 text-white/80" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(webinar.status)}`}>
                                                {webinar.status}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                                {webinar.duration} mins
                                            </span>
                                            <span className="px-3 py-1 bg-blue-600 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                                {formatPrice(webinar.price, webinar.requiresPayment)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Webinar Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                                                {webinar.title}
                                            </h3>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {webinar.description}
                                        </p>

                                        {/* Speaker Info */}
                                        <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Expert Speaker</p>
                                                <p className="text-sm text-blue-600 font-medium">{webinar.speaker}</p>
                                            </div>
                                        </div>

                                        {/* Webinar Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                {formatDate(webinar.schedule)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {webinar.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="w-4 h-4 mr-2 text-blue-500" />
                                                {webinar.availableSpots} of {webinar.capacity} spots available
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={(e) => handleRegisterClick(webinar, e)}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
                                            >
                                                Register Now
                                            </button>
                                            <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Webinar Detail Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setModalOpen(false)}
                        ></div>

                        {/* Modal panel */}
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            {detailLoading ? (
                                <div className="flex items-center justify-center h-96">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : selectedWebinar && (
                                <div className="bg-white">
                                    {/* Modal header */}
                                    <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                                        {selectedWebinar.image ? (
                                            <img
                                                src={selectedWebinar.image}
                                                alt={selectedWebinar.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Play className="w-20 h-20 text-white/80" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedWebinar.status)}`}>
                                                {selectedWebinar.status}
                                            </span>
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                                {selectedWebinar.duration} mins
                                            </span>
                                            <span className="px-3 py-1 bg-blue-600 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                                {formatPrice(selectedWebinar.price, selectedWebinar.requiresPayment)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Modal content */}
                                    <div className="p-6 max-h-96 overflow-y-auto">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedWebinar.title}</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center text-gray-700">
                                                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">{formatDate(selectedWebinar.schedule)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">{selectedWebinar.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">{selectedWebinar.speaker}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-gray-700">
                                                    <Users className="w-5 h-5 mr-3 text-green-500" />
                                                    <span className="font-medium">{selectedWebinar.availableSpots} spots available</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <DollarSign className="w-5 h-5 mr-3 text-purple-500" />
                                                    <span className="font-medium">{formatPrice(selectedWebinar.price, selectedWebinar.requiresPayment)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{selectedWebinar.description}</p>
                                        </div>

                                        {selectedWebinar.questions.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Registration Questions</h3>
                                                <div className="space-y-2">
                                                    {selectedWebinar.questions.map((question, index) => (
                                                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                            <p className="font-medium text-gray-800">{question.question}</p>
                                                            <p className="text-sm text-gray-600 mt-1">Type: {question.type}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedWebinar.refundPolicy && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Policy</h3>
                                                <p className="text-gray-600 leading-relaxed">{selectedWebinar.refundPolicy}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal footer */}
                                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                setModalOpen(false);
                                                navigate(`/webinars/${selectedWebinar.id}/register`);
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                                        >
                                            Register Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden mx-4 sm:mx-8 lg:mx-20 my-20 rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Level Up Your Skills?
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join our community of learners and get access to exclusive webinars, expert insights, and networking opportunities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-500 font-semibold text-lg shadow-2xl transform hover:scale-105">
                            Browse All Webinars
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-500 font-semibold text-lg transform hover:scale-105">
                            Become a Speaker
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default WebinarPage;