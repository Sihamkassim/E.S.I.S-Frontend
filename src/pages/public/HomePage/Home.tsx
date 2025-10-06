import React, { useState, useEffect } from 'react';
import { Users, Clock, TrendingUp, Layers, ArrowRight, Menu, X } from 'lucide-react';
import { api } from '@/services/api';
import TechSection from './components/TechSection';
import { AnimatedSection, StaggeredContainer } from './components/AnimatedComponents';
import WebinarySection from './components/WebinerySection';
import Footer from './components/Footer';
import { Navigate, useNavigate } from 'react-router-dom';


export default function Home() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Tech Updates', href: '#' },
        { name: 'Community', href: '/community' },
        { name: 'Project', href: '#' },
        { name: 'Webinar', href: '#' },
        { name: 'Membership', href: '#' },
        { name: 'About', href: '#' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
                : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
                } h-16`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={'/images/ESIS.png'}
                            alt="Logo"
                            className="h-32 w-auto"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Sign Up Button */}
                    <button onClick={() => navigate('/register')} className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Sign Up
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
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

            {/* Hero Section with Enhanced Blur Effects */}
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
                    <AnimatedSection animationType="fadeInUp" delay={0.2} className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        E.S.I.S Community
                    </AnimatedSection>
                    <AnimatedSection animationType="fadeInUp" delay={0.4} className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-600 mb-8">
                        Building Future Innovation
                    </AnimatedSection>
                    <AnimatedSection animationType="fadeInUp" delay={0.6} className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join a network of learners, innovators, and professionals driving change with technology.
                    </AnimatedSection>

                    <AnimatedSection animationType="scaleIn" delay={0.8} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <button className="bg-teal-500 text-white px-6 sm:px-10 py-4 rounded-lg hover:bg-teal-600 transition-all duration-500 ease-out font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Register Now
                        </button>
                        <button className="bg-blue-600 text-white px-6 sm:px-10 py-4 rounded-lg hover:bg-blue-700 transition-all duration-500 ease-out font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Programs
                        </button>
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">200+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Active User</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">30+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Daily Tech Updates</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">34+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Webinars Hosted</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">34+</div>
                            <div className="text-xs sm:text-sm font-medium text-slate-600">Community Projects</div>
                        </div>
                    </StaggeredContainer>
                </div>
            </AnimatedSection>

            {/* Tech News Section */}
            <TechSection api={api} />
            <WebinarySection api={api} />

            {/* Membership Section with Blur Effects */}
            <AnimatedSection className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Desktop Blur Background */}
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
                </div>

                {/* Tablet Blur Background */}
                <div className="hidden sm:block lg:hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/35 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-200/35 rounded-full blur-2xl"></div>
                </div>

                {/* Mobile Blur Background */}
                <div className="block sm:hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-200/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-200/30 rounded-full blur-xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <AnimatedSection className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 border border-blue-200 relative overflow-hidden transition-all duration-1000 ease-out shadow-xl">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 transition-all duration-1000 ease-out"></div>
                        <div className="text-center transition-all duration-500 ease-out">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 transition-all duration-500 ease-out">
                                Become a Member for exclusive Access
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-500 ease-out">
                                Join our community and unlock access to exclusive resources, daily updates, and opportunities to connect with like-minded professionals.
                            </p>
                            <AnimatedSection className="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 ease-out">
                                <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-500 ease-out font-medium flex items-center justify-center gap-2 transform hover:scale-105">
                                    View membership plans
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out" />
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-500 ease-out font-medium transform hover:scale-105">
                                    Browse all webinars
                                </button>
                            </AnimatedSection>
                        </div>
                    </AnimatedSection>
                </div>
            </AnimatedSection>

            {/* Footer Placeholder */}
            <Footer />

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
}