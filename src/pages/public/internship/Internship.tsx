import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Calendar, MapPin, DollarSign, Briefcase, Building, Clock, Award, ExternalLink, ChevronRight, Star, Zap, Target } from 'lucide-react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../HomePage/components/Footer';
import { AnimatedSection, StaggeredContainer } from '../HomePage/components/AnimatedComponents';

// TypeScript Interfaces
interface Internship {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  requirements: string;
  responsibilities: string;
  startDate: string;
  endDate: string;
  isRemote: boolean;
  isPaid: boolean;
  stipendAmount: number | null;
  maxApplicants: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface NavItem {
  name: string;
  href: string;
}

const InternshipPage: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
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
    fetchInternships();
  }, []);

  const fetchInternships = async (): Promise<void> => {
    try {
      const result = await api.get('/public/internship-positions');
      setInternships(result.data || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
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
    { icon: Users, value: '50+', label: 'Interns Placed' },
    { icon: Building, value: '20+', label: 'Partner Companies' },
    { icon: Award, value: '15+', label: 'Departments' },
    { icon: Zap, value: '80%', label: 'Conversion Rate' },
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Real-World Experience',
      description: 'Work on meaningful projects that make an impact and build your portfolio.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Mentorship',
      description: 'Get guidance from experienced professionals in your field of interest.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Award,
      title: 'Skill Development',
      description: 'Learn cutting-edge technologies and methodologies used in the industry.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Briefcase,
      title: 'Career Opportunities',
      description: 'High potential for full-time employment after successful internship completion.',
      color: 'from-pink-500 to-blue-500'
    },
  ];

  const departments = [
    'Engineering',
    'Marketing',
    'Design',
    'Business',
    'Technology',
    'Research',
    'Development'
  ];

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const filteredInternships = filter === 'all'
    ? internships
    : internships.filter(internship => internship.department === filter);

  const handleInternshipClick = (internship: Internship): void => {
    setSelectedInternship(internship);
    setModalOpen(true);
  };

  const handleApplyClick = (internship: Internship, e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate(`/internships/${internship.id}/apply`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-slate-700 text-lg font-medium">Loading internships...</p>
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
          <AnimatedSection >
            <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Internship Programs
            </div>
          </AnimatedSection>

          <AnimatedSection >
            <div className="text-xl sm:text-2xl md:text-4xl font-semibold text-slate-700 mb-8">
              Launch Your Career with Real Experience
            </div>
          </AnimatedSection>

          <AnimatedSection >
            <div className="text-base sm:text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Gain hands-on experience, learn from industry experts, and build your professional network through our curated internship opportunities.
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

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection >
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Why Intern With Us?
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg">
                We provide more than just work experience - we build future leaders
              </p>
            </div>
          </AnimatedSection>

          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={150}>
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* Internships Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Available Positions
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto text-lg">
                Find the perfect internship to kickstart your career journey
              </p>
            </div>
          </AnimatedSection>

          {/* Department Filter */}
          <AnimatedSection >
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-md'
                  }`}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilter(dept)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${filter === dept
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 shadow-md'
                    }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {filteredInternships.length === 0 ? (
            <AnimatedSection >
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Briefcase className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No Internships Available</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {filter === 'all'
                    ? "Check back later for new internship opportunities."
                    : `No internships available in ${filter} at the moment.`
                  }
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <StaggeredContainer className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8" staggerDelay={150}>
              {filteredInternships.map((internship) => {
                const daysRemaining = getDaysRemaining(internship.startDate);

                return (
                  <div
                    key={internship.id}
                    className="group bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleInternshipClick(internship)}
                  >
                    {/* Internship Header */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(internship.status)}`}>
                          {internship.status}
                        </span>
                        {daysRemaining > 0 && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                            {daysRemaining} days left
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-100 transition-colors">
                          {internship.title}
                        </h3>
                        <p className="text-blue-100 text-sm font-medium mt-2">
                          {internship.department}
                        </p>
                      </div>
                    </div>

                    {/* Internship Content */}
                    <div className="p-6">
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {internship.description}
                      </p>

                      {/* Internship Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="flex items-center">
                            {internship.location}
                            {internship.isRemote && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Remote
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          {internship.maxApplicants} positions available
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                          {internship.isPaid
                            ? `$${internship.stipendAmount}/month`
                            : 'Unpaid'
                          }
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => handleApplyClick(internship, e)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          Apply Now
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                        <button className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-all duration-300 font-semibold text-sm flex items-center justify-center">
                          Details
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggeredContainer>
          )}
        </div>
      </section>

      {/* Internship Detail Modal */}
      {modalOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity"
              onClick={() => setModalOpen(false)}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                {/* Modal header */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedInternship.status)}`}>
                      {selectedInternship.status}
                    </span>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedInternship.title}
                    </h2>
                    <p className="text-blue-100 text-lg font-medium mt-2">
                      {selectedInternship.department} Department
                    </p>
                  </div>
                </div>

                {/* Modal content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-700">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <span className="font-medium">{selectedInternship.location}</span>
                          {selectedInternship.isRemote && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="font-medium">
                          {formatDate(selectedInternship.startDate)} - {formatDate(selectedInternship.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-700">
                        <Users className="w-5 h-5 mr-3 text-green-600" />
                        <span className="font-medium">{selectedInternship.maxApplicants} positions available</span>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <DollarSign className="w-5 h-5 mr-3 text-purple-600" />
                        <span className="font-medium">
                          {selectedInternship.isPaid
                            ? `$${selectedInternship.stipendAmount}/month (Paid)`
                            : 'Unpaid Internship'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                      Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{selectedInternship.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Responsibilities
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{selectedInternship.responsibilities}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Requirements
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{selectedInternship.requirements}</p>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    Posted on {formatDate(selectedInternship.createdAt)}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        navigate(`/internships/${selectedInternship.id}/apply`);
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                    >
                      Apply Now
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
          <AnimatedSection >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join our internship program and gain the experience you need to launch your career in the tech industry.
            </p>
          </AnimatedSection>
          <AnimatedSection >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-slate-100 transition-all duration-500 font-semibold text-lg shadow-2xl transform hover:scale-105">
                Browse All Positions
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-500 font-semibold text-lg transform hover:scale-105">
                Become a Partner
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default InternshipPage;