import React, { useState, useEffect } from 'react';
import { Menu, X, Target, Eye, Heart, Zap, Users, Globe, Award, BookOpen, Rocket, Code, TrendingUp, MessageCircle, Lightbulb, Star } from 'lucide-react';
import { AnimatedSection, StaggeredContainer } from '../HomePage/components/AnimatedComponents';
import Footer from '../HomePage/components/Footer';



export default function AboutPage() {
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
        { name: 'internship', href: '/internship' },
        { name: 'Community', href: '/community' },
        { name: 'Project', href: '/project' },
        { name: 'Webinar', href: '/Webinar' },
        { name: 'Membership', href: '/Membership' },
        { name: 'About', href: '/about-us' },
    ];

    const coreValues = [
        {
            icon: Lightbulb,
            title: 'Innovation First',
            description: 'We champion creativity and encourage bold ideas that push boundaries and challenge the status quo.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Building strong connections and fostering collaboration among Ethiopian entrepreneurs and innovators.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Heart,
            title: 'Passion & Purpose',
            description: 'Driven by a deep commitment to empowering Ethiopian startups and creating lasting social impact.',
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: Zap,
            title: 'Action Oriented',
            description: 'Moving from ideas to execution quickly, with a focus on practical solutions and real-world results.',
            color: 'from-purple-500 to-indigo-500'
        },
    ];

    const milestones = [
        { year: '2020', title: 'Founded', description: 'ESIS was established to bridge the gap in Ethiopian startup ecosystem' },
        { year: '2021', title: 'First Cohort', description: 'Launched first accelerator program with 20 startups' },
        { year: '2022', title: 'Expansion', description: 'Opened innovation hubs in 3 major Ethiopian cities' },
        { year: '2023', title: 'Global Reach', description: 'Partnered with international tech organizations' },
        { year: '2024', title: 'Impact at Scale', description: '500+ startups supported, $10M+ funding facilitated' },
    ];

    const team = [
        {
            name: 'Khalid',
            role: 'Founder & CEO',
            image: 'https://ui-avatars.com/api/?name=Khalid+Bekele&background=3B82F6&color=fff&size=256',
            bio: 'Serial entrepreneur with 15+ years in tech innovation'
        },
        {
            name: 'Husssen',
            role: 'Director of Programs',
            image: 'https://ui-avatars.com/api/?name=Hanna+Seyfu&background=8B5CF6&color=fff&size=256',
            bio: 'Expert in startup acceleration and mentorship programs'
        },
        {
            name: 'Sultan',
            role: 'Head of Technology',
            image: 'https://ui-avatars.com/api/?name=Sultan+Hakim&background=10B981&color=fff&size=256',
            bio: 'Tech leader passionate about building scalable solutions'
        },
        {
            name: 'Hashim',
            role: 'Community Manager',
            image: 'https://ui-avatars.com/api/?name=Hashim+Moha&background=F59E0B&color=fff&size=256',
            bio: 'Connecting innovators and building vibrant communities'
        },
    ];

    const achievements = [
        { icon: Rocket, value: '500+', label: 'Startups Supported' },
        { icon: Globe, value: '15+', label: 'Countries Reached' },
        { icon: Award, value: '50+', label: 'Awards Won' },
        { icon: TrendingUp, value: '$10M+', label: 'Funding Facilitated' },
    ];

    const offerings = [
        {
            icon: BookOpen,
            title: 'Education & Training',
            description: 'Comprehensive workshops, bootcamps, and certification programs designed for Ethiopian entrepreneurs.'
        },
        {
            icon: Users,
            title: 'Mentorship Program',
            description: 'One-on-one guidance from successful founders and industry experts who understand the local context.'
        },
        {
            icon: Code,
            title: 'Tech Resources',
            description: 'Access to cutting-edge tools, platforms, and infrastructure to build and scale your startup.'
        },
        {
            icon: MessageCircle,
            title: 'Networking Events',
            description: 'Regular meetups, conferences, and demo days connecting startups with investors and partners.'
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Exact style */}
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

            {/* Hero Banner - Exact style */}
            <AnimatedSection className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                    <AnimatedSection delay={0.2} className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                        About ESIS
                    </AnimatedSection>
                    <AnimatedSection delay={0.4} className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-600 mb-8">
                        Empowering Ethiopian Innovation
                    </AnimatedSection>
                    <AnimatedSection delay={0.6} className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        We are Ethiopia's premier startup innovation hub, dedicated to transforming ideas into thriving businesses and building a sustainable entrepreneurial ecosystem.
                    </AnimatedSection>

                    <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
                        {achievements.map((achievement, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <achievement.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{achievement.value}</div>
                                <div className="text-xs sm:text-sm font-medium text-slate-600">{achievement.label}</div>
                            </div>
                        ))}
                    </StaggeredContainer>
                </div>
            </AnimatedSection>

            {/* Mission & Vision Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection>
                            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" staggerDelay={0.2}>
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        To create a thriving ecosystem where Ethiopian entrepreneurs can innovate, collaborate, and scale their startups by providing world-class resources, mentorship, and opportunities that drive sustainable economic growth.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                        <Eye className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        To position Ethiopia as a leading hub for technology and innovation in Africa, fostering a generation of successful entrepreneurs who create meaningful impact and contribute to the nation's prosperity.
                                    </p>
                                </div>
                            </StaggeredContainer>
                        </AnimatedSection>

                        {/* Core Values */}
                        <AnimatedSection className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Our Core Values
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                The principles that guide everything we do at ESIS.
                            </p>
                        </AnimatedSection>

                        <AnimatedSection>
                            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
                                {coreValues.map((value, index) => (
                                    <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-500`}>
                                            <value.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </StaggeredContainer>
                        </AnimatedSection>
                    </div>
                </section>
            </AnimatedSection>

            {/* Journey Timeline */}
            <AnimatedSection>
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <AnimatedSection className="text-center mb-20">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                <span className="text-green-400 text-sm font-medium">Our Evolution</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                                Building The <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Future</span>
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                                From visionary beginnings to shaping Ethiopia's technological landscape
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="relative" staggerDelay={0.1}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Timeline Navigation */}
                                <div className="lg:col-span-3">
                                    <div className="sticky top-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                        <h3 className="text-white font-bold text-lg mb-4">Milestone Years</h3>
                                        <div className="space-y-2">
                                            {milestones.map((milestone, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                                                    onClick={() => document.getElementById(`milestone-${index}`)?.scrollIntoView({ behavior: 'smooth' })}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                                                            {milestone.year}
                                                        </span>
                                                        <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">{milestone.title}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Content */}
                                <div className="lg:col-span-9">
                                    <div className="relative">
                                        {/* Vertical Timeline Line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/20 via-blue-400/40 to-purple-400/20"></div>

                                        {milestones.map((milestone, index) => (
                                            <div
                                                key={index}
                                                id={`milestone-${index}`}
                                                className="relative pl-16 pb-12 group"
                                            >
                                                {/* Timeline Node */}
                                                <div className="absolute left-4 top-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full border-4 border-gray-900 group-hover:scale-125 transition-transform duration-300 z-10"></div>
                                                <div className="absolute left-5 top-3 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                {/* Content Card */}
                                                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-500 transform hover:-translate-y-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl text-gray-900 font-bold text-lg">
                                                                {milestone.year}
                                                            </div>
                                                            <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
                                                                <span className="text-cyan-400 text-sm font-medium">Phase {index + 1}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                                        {milestone.description}
                                                    </p>

                                                    {/* Progress Indicator */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex gap-1">
                                                                {Array.from({ length: index + 1 }).map((_, i) => (
                                                                    <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                                                ))}
                                                                {Array.from({ length: milestones.length - index - 1 }).map((_, i) => (
                                                                    <div key={i} className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                                                ))}
                                                            </div>
                                                            <span className="text-gray-400 text-sm">
                                                                {Math.round(((index + 1) / milestones.length) * 100)}% Complete
                                                            </span>
                                                        </div>
                                                        <div className="text-cyan-400 text-sm font-medium">
                                                            Milestone #{String(index + 1).padStart(2, '0')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </StaggeredContainer>

                        {/* Floating Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-2">{milestones.length}+</div>
                                <div className="text-gray-400">Milestones</div>
                            </div>
                            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-2">{new Date().getFullYear() - parseInt(milestones[0]?.year || '2015')}</div>
                                <div className="text-gray-400">Years of Innovation</div>
                            </div>
                            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-2">100+</div>
                                <div className="text-gray-400">Projects</div>
                            </div>
                            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-green-400/30 transition-all duration-300">
                                <div className="text-3xl font-bold text-white mb-2">∞</div>
                                <div className="text-gray-400">Future Potential</div>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

            {/* What We Offer */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                What We Offer
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Comprehensive support for startups at every stage of their journey.
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.15}>
                            {offerings.map((offering, index) => (
                                <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-500">
                                        <offering.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                        {offering.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {offering.description}
                                    </p>
                                </div>
                            ))}
                        </StaggeredContainer>
                    </div>
                </section>
            </AnimatedSection>

            {/* Team Section */}
            <AnimatedSection>
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Meet Our Team
                            </h2>
                            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                                Passionate leaders dedicated to empowering Ethiopian entrepreneurs.
                            </p>
                        </AnimatedSection>

                        <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
                            {team.map((member, index) => (
                                <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                    {/* Circular Profile Image */}
                                    <div className="relative mb-6 mx-auto">
                                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-100 transition-all duration-500">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Optional Status Indicator */}
                                        <div className="absolute bottom-2 right-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>

                                    {/* Team Member Info */}
                                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {member.name}
                                    </h4>
                                    <p className="text-blue-600 font-semibold text-sm mb-4 bg-blue-50 px-3 py-1 rounded-full inline-block">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {member.bio}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex justify-center space-x-3 pt-4 border-t border-gray-100">
                                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </StaggeredContainer>

                        {/* Optional Team Stats */}
                        <AnimatedSection className="mt-16">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">{team.length}+</div>
                                    <div className="text-gray-600 text-sm">Team Members</div>
                                </div>
                                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                                    <div className="text-2xl font-bold text-purple-600 mb-2">10+</div>
                                    <div className="text-gray-600 text-sm">Years Experience</div>
                                </div>
                                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                                    <div className="text-2xl font-bold text-green-600 mb-2">50+</div>
                                    <div className="text-gray-600 text-sm">Projects</div>
                                </div>
                                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                                    <div className="text-2xl font-bold text-orange-600 mb-2">100%</div>
                                    <div className="text-gray-600 text-sm">Dedicated</div>
                                </div>
                            </div>
                        </AnimatedSection>
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
                                Join Us in Building the Future
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                Whether you're an entrepreneur, investor, or supporter of innovation, there's a place for you at ESIS.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-blue-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-500 font-semibold text-lg shadow-2xl transform hover:scale-105">
                                    Become a Member
                                </button>
                                <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white/10 transition-all duration-500 font-semibold text-lg transform hover:scale-105">
                                    Partner With Us
                                </button>
                            </div>
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