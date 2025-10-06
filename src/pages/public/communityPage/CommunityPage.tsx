import React, { useState, useEffect } from 'react';
import { Users, Menu, X, MessageCircle, Calendar, Award, BookOpen, Lightbulb, Target, TrendingUp, Globe, Heart, Share2, UserPlus } from 'lucide-react';
import { AnimatedSection, StaggeredContainer } from '../HomePage/components/AnimatedComponents';
import Footer from '../HomePage/components/Footer';


export default function CommunityPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

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
        { name: 'Tech Updates', href: '/community' },
        { name: 'Community', href: '#' },
        { name: 'Project', href: '#' },
        { name: 'Webinar', href: '#' },
        { name: 'Membership', href: '#' },
        { name: 'About', href: '/about-us' },
    ];

    const communityStats = [
        { icon: Users, value: '500+', label: 'Active Members', color: 'blue' },
        { icon: MessageCircle, value: '1,200+', label: 'Discussions', color: 'green' },
        { icon: Calendar, value: '50+', label: 'Events Hosted', color: 'purple' },
        { icon: Award, value: '100+', label: 'Projects Completed', color: 'orange' },
    ];

    const communityFeatures = [
        {
            icon: Lightbulb,
            title: 'Innovation Hub',
            description: 'Share ideas, collaborate on projects, and turn your startup dreams into reality with fellow innovators.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: BookOpen,
            title: 'Learning Resources',
            description: 'Access exclusive educational content, workshops, and mentorship programs designed for Ethiopian entrepreneurs.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Target,
            title: 'Goal-Driven Community',
            description: 'Connect with like-minded individuals who are passionate about building the future of Ethiopian innovation.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: TrendingUp,
            title: 'Growth Network',
            description: 'Expand your professional network, find co-founders, and access funding opportunities through our community.',
            color: 'from-green-500 to-teal-500'
        },
    ];

    const memberBenefits = [
        { icon: Globe, text: 'Access to exclusive startup events and networking sessions' },
        { icon: Heart, text: 'Mentorship from successful Ethiopian entrepreneurs' },
        { icon: Share2, text: 'Collaboration opportunities with tech companies' },
        { icon: UserPlus, text: 'Direct connection to investors and funding resources' },
    ];

    const testimonials = [
        {
            name: 'Khalid Hamid',
            role: 'Founder, TechStart Ethiopia',
            image: 'https://ui-avatars.com/api/?name=Khalid+Hamid&background=3B82F6&color=fff&size=128',
            quote: 'ESIS Community transformed my startup journey. The connections and resources I found here were invaluable.'
        },
        {
            name: 'Hassen Kemal',
            role: 'Software Engineer',
            image: 'https://ui-avatars.com/api/?name=Hassen+Kemal&background=8B5CF6&color=fff&size=128',
            quote: 'Being part of ESIS opened doors I never knew existed. The mentorship and support are exceptional.'
        },
        {
            name: 'Fuad',
            role: 'Entrepreneur',
            image: 'https://ui-avatars.com/api/?name=Fuad+Jemal&background=3B82F6&color=fff&size=128',
            quote: 'This community is the heartbeat of Ethiopian innovation. Every startup founder should be part of it.'
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Exact style from Home page */}
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

            {/* Hero Banner - Exact style from Home page */}
            <AnimatedSection className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Desktop Blur Effects */}
                <AnimatedSection>
                    <div className="hidden lg:block">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-200/60 via-blue-300/40 to-teal-200/50 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-blue-300/50 via-purple-200/40 to-blue-200/60 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-blue-100/70 rounded-full blur-xl"></div>
                    </div>
                </AnimatedSection>

                {/* Tablet Blur Effects */}
                <AnimatedSection>
                    <div className="hidden sm:block lg:hidden">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gradient-to-r from-blue-200/50 via-blue-300/35 to-teal-200/45 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-gradient-to-br from-blue-300/45 via-purple-200/35 to-blue-200/55 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-blue-100/65 rounded-full blur-xl"></div>
                    </div>
                </AnimatedSection>

                {/* Mobile Blur Effects */}
                <AnimatedSection>
                    <div className="block sm:hidden">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-r from-blue-200/45 via-blue-300/30 to-teal-200/40 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[225px] bg-gradient-to-br from-blue-300/40 via-purple-200/30 to-blue-200/50 rounded-full blur-xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] bg-blue-100/60 rounded-full blur-lg"></div>
                    </div>
                </AnimatedSection>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <AnimatedSection delay={0.2} className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        ESIS Community
                    </AnimatedSection>
                    <AnimatedSection delay={0.4} className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-600 mb-8">
                        Ethiopian Startup Innovation
                    </AnimatedSection>
                    <AnimatedSection delay={0.6} className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join Ethiopia's most vibrant community of innovators, entrepreneurs, and tech enthusiasts building the future together.
                    </AnimatedSection>

                    <AnimatedSection delay={0.8} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <button className="bg-teal-500 text-white px-6 sm:px-10 py-4 rounded-lg hover:bg-teal-600 transition-all duration-500 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Join Community
                        </button>
                        <button className="bg-blue-600 text-white px-6 sm:px-10 py-4 rounded-lg hover:bg-blue-700 transition-all duration-500 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Events
                        </button>
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
                        {communityStats.map((stat, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm font-medium text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </StaggeredContainer>
                </div>
            </AnimatedSection>

            {/* Community Features Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                What Makes Us Special
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Discover the unique features that make ESIS the premier community for Ethiopian innovators and entrepreneurs.
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.15}>
                            {communityFeatures.map((feature, index) => (
                                <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </StaggeredContainer>
                    </div>
                </section>
            </AnimatedSection>

            {/* Member Benefits Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <AnimatedSection className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Member Benefits
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Join ESIS and unlock a world of opportunities designed to accelerate your startup journey.
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
                            {memberBenefits.map((benefit, index) => (
                                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">{benefit.text}</p>
                                </div>
                            ))}
                        </StaggeredContainer>
                    </div>
                </section>
            </AnimatedSection>

            {/* Testimonials Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Community Stories
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Hear from our members about their journey with ESIS Community.
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full border-4 border-blue-100"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                                </div>
                            ))}
                        </StaggeredContainer>
                    </div>
                </section>
            </AnimatedSection>

            {/* CTA Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden mx-20 my-20 rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <AnimatedSection>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Join the Movement?
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                Be part of Ethiopia's most innovative community and start building your future today.
                            </p>
                            <button className="bg-white text-blue-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-500 font-semibold text-lg shadow-2xl transform hover:scale-105">
                                Join ESIS Community Now
                            </button>
                        </AnimatedSection>
                    </div>
                </section>
            </AnimatedSection>
            <Footer />
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
}