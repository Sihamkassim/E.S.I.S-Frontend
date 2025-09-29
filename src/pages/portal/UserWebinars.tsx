import { Loader2, CheckCircle, Clock, AlertCircle, X, ChevronRight, Eye, MapPin, Calendar, User, DollarSign, Users, Timer } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import WebinarCard from '../../components/webinar/WebinarCard';
import { useTheme } from '../../hooks/useTheme';
import { useWebinarStore, Webinar } from '../../store/useWebinarstore';
import PaymentComponent from './PaymentComponent';
import { api } from '@/services/api';

interface ApplicationData {
  id: number;
  webinarId: number;
  userId: number;
  status: 'Applied' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
  updatedAt: string;
  answers: Record<string, any>;
  ticket: any[];
}

interface ApplicationStatus {
  hasApplied: boolean;
  application: ApplicationData | null;
}

// Use the existing WebinarQuestion type from your store
interface WebinarQuestion {
  id?: number;
  webinarId?: number;
  type: 'text' | 'radio' | 'checkbox' | 'textarea' | 'select' | 'multiple-choice';
  question: string;
  options?: string[];
  required?: boolean;
}

// Update Webinar interface to include applications

interface WebinarWithApplications extends Webinar {
  applications?: ApplicationData[];
  questions?: WebinarQuestion[];  // reuse same type
  requiresPayment?: boolean;
  availableSpots?: number;
  _count?: {
    tickets: number;
  };
  refundPolicy?: string;
  faq?: string;
}

const UserWebinars: React.FC = () => {
  const { theme } = useTheme();
  const {
    upcomingWebinars,
    userTickets,
    loading,
    error,
    fetchUpcomingWebinars,
    fetchUserTickets,
    fetchUserWebinars,
  } = useWebinarStore();

  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [applicationStatuses, setApplicationStatuses] = useState<Record<number, ApplicationStatus>>({});

  // Modal states
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarWithApplications | null>(null);
  const [webinarAnswers, setWebinarAnswers] = useState<Record<string, any>>({});

  // Questions states
  const [questions, setQuestions] = useState<WebinarQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get application status from webinar data
  const getApplicationStatusFromWebinar = (webinar: WebinarWithApplications): ApplicationStatus => {
    const applications = webinar.applications || [];

    // Assuming we can check if user has applied by looking at the applications array
    // You might need to adjust this logic based on how you identify the current user
    const userApplication = applications.length > 0 ? applications[0] : null;

    return {
      hasApplied: applications.length > 0,
      application: userApplication
    };
  };

  // Get questions from webinar data
  const getQuestionsFromWebinar = (webinar: WebinarWithApplications): WebinarQuestion[] => {
    return webinar.questions || [];
  };

  const registeredWebinars = useMemo(() => {
    return userTickets.map(ticket => ticket.webinar).filter(Boolean) as Webinar[];
  }, [userTickets]);

  const pastWebinars = useMemo(() => {
    return upcomingWebinars.filter(webinar => new Date(webinar.schedule) < new Date());
  }, [upcomingWebinars]);

  const webinarsToDisplay = useMemo(() => {
    let webinars: Webinar[] = [];
    if (activeTab === 'upcoming') {
      webinars = upcomingWebinars.filter(webinar => new Date(webinar.schedule) >= new Date());
    } else if (activeTab === 'registered') {
      webinars = registeredWebinars;
    } else if (activeTab === 'past') {
      webinars = pastWebinars;
    }

    return webinars.filter(webinar =>
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (webinar.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [activeTab, upcomingWebinars, registeredWebinars, pastWebinars, searchQuery]);

  // Update application statuses when webinars data changes
  useEffect(() => {
    const newApplicationStatuses: Record<number, ApplicationStatus> = {};

    webinarsToDisplay.forEach(webinar => {
      const status = getApplicationStatusFromWebinar(webinar as WebinarWithApplications);
      newApplicationStatuses[Number(webinar.id)] = status;
    });

    setApplicationStatuses(newApplicationStatuses);
  }, [webinarsToDisplay]);

  useEffect(() => {
    if (activeTab === 'upcoming') {
      fetchUpcomingWebinars();
      fetchUserTickets();
    } else if (activeTab === 'registered') {
      fetchUserTickets();
    } else if (activeTab === 'past') {
      fetchUpcomingWebinars();
      fetchUserTickets();
    }
  }, [activeTab, fetchUpcomingWebinars, fetchUserTickets]);

  const handleApplyClick = async (webinar: Webinar) => {
    const webinarId = Number(webinar.id);
    const status = applicationStatuses[webinarId];
    const webinarData = webinar as WebinarWithApplications;

    // Prevent application if user has already applied
    if (status?.hasApplied) {
      console.log('User has already applied for this webinar');
      return;
    }

    setSelectedWebinar(webinarData);

    // Get questions directly from webinar data
    const webinarQuestions = getQuestionsFromWebinar(webinarData);
    setQuestions(webinarQuestions);

    // Check if webinar requires payment
    const requiresPayment = webinarData.requiresPayment || (webinarData.price ?? 0) > 0;


    if (requiresPayment) {
      // For paid webinars, go directly to payment (no questions)
      setShowPaymentModal(true);
    } else {
      // For free webinars, show questions if they exist, else complete registration
      if (webinarQuestions.length > 0) {
        setShowQuestionsModal(true);
      } else {
        // Free webinar with no questions - register directly
        await handleFreeWebinarRegistration(webinarData);
      }
    }
  };

  const handleFreeWebinarRegistration = async (webinar: WebinarWithApplications) => {
    setIsSubmitting(true);

    try {
      // For free webinars, create application without payment
      const applyResponse = await api.post('/user/webinar-applications', {
        webinarId: webinar.id,
        answers: {}
      });

      console.log('Free webinar registration successful:', applyResponse.data);

      // Refresh data to show updated application status
      setTimeout(() => {
        fetchUpcomingWebinars();
        fetchUserTickets();
      }, 1000);

    } catch (error: any) {
      console.error('Error registering for free webinar:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to register for webinar. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar as WebinarWithApplications);
    setShowDetailModal(true);
  };

  // Questions Modal Functions
  const handleInputChange = (questionIndex: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));

    // Clear error when user starts typing
    if (errors[questionIndex]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionIndex];
        return newErrors;
      });
    }
  };

  const validateAnswers = (): boolean => {
    const newErrors: Record<string, string> = {};

    questions.forEach((question, index) => {
      const answer = answers[index];

      // Check if question is required (default to true if not specified)
      const isRequired = question.required !== false;

      if (isRequired) {
        if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
          newErrors[index] = 'This field is required';
        } else if (Array.isArray(answer) && answer.length === 0) {
          newErrors[index] = 'Please select at least one option';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionsSubmit = async () => {
    if (questions.length > 0 && !validateAnswers()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform answers to match backend format if there are questions
      const formattedAnswers = questions.reduce((acc, question, index) => {
        acc[`question_${index}`] = {
          question: question.question,
          answer: answers[index] || '',
          type: question.type
        };
        return acc;
      }, {} as Record<string, any>);

      // For free webinars, complete the registration here
      const applyResponse = await api.post('/user/webinar-applications', {
        webinarId: selectedWebinar?.id,
        answers: formattedAnswers
      });

      console.log('Free webinar application created successfully:', applyResponse.data);

      // Close modal and refresh data
      closeAllModals();

      // Refresh data to show updated application status
      setTimeout(() => {
        fetchUpcomingWebinars();
        fetchUserTickets();
      }, 1000);

    } catch (error: any) {
      console.error('Error applying for webinar:', error);
      // Handle specific error cases
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to apply for webinar. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: WebinarQuestion, index: number) => {
    const value = answers[index] || '';
    const hasError = errors[index];

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900'
              } ${hasError ? 'border-red-500' : ''}`}
            placeholder="Enter your answer..."
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <textarea
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900'
              } ${hasError ? 'border-red-500' : ''}`}
            placeholder="Enter your detailed answer..."
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        );

      case 'radio':
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question_${index}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      handleInputChange(index, [...currentValues, option]);
                    } else {
                      handleInputChange(index, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              } ${hasError ? 'border-red-500' : ''}`}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900'
              } ${hasError ? 'border-red-500' : ''}`}
            placeholder="Enter your answer..."
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        );
    }
  };

  const handlePaymentSuccess = async (data: any) => {
    console.log('Payment successful:', data);

    if (selectedWebinar) {
      // Call the confirmation endpoint after successful payment
      try {
        await api.post('/user/confirm-webinar-application', {
          webinarId: selectedWebinar.id,
          answers: webinarAnswers,
          paymentData: data
        });
        console.log('Application confirmed successfully');
      } catch (error) {
        console.error('Error confirming application:', error);
      }
    }

    closeAllModals();

    // Refresh data
    setTimeout(() => {
      fetchUpcomingWebinars();
      fetchUserTickets();
    }, 1000);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    // Keep modal open for retry
  };

  const closeQuestionsModal = () => {
    setShowQuestionsModal(false);
    setAnswers({});
    setErrors({});
    setQuestions([]);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedWebinar(null);
    setWebinarAnswers({});
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedWebinar(null);
  };

  const closeAllModals = () => {
    closeQuestionsModal();
    closePaymentModal();
    closeDetailModal();
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showPaymentModal) {
        closePaymentModal();
      } else if (showQuestionsModal) {
        closeQuestionsModal();
      } else if (showDetailModal) {
        closeDetailModal();
      }
    }
  };

  useEffect(() => {
    if (showQuestionsModal || showPaymentModal || showDetailModal) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showQuestionsModal, showPaymentModal, showDetailModal]);

  const getStatusBadge = (webinarId: number) => {
    const status = applicationStatuses[webinarId];
    if (!status?.hasApplied || !status.application) return null;

    const { status: applicationStatus } = status.application;

    const statusConfig = {
      Applied: {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        darkColor: 'text-yellow-400',
        darkBgColor: 'bg-yellow-900/20',
        text: 'Applied'
      },
      Approved: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        darkColor: 'text-green-400',
        darkBgColor: 'bg-green-900/20',
        text: 'Approved'
      },
      Rejected: {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        darkColor: 'text-red-400',
        darkBgColor: 'bg-red-900/20',
        text: 'Rejected'
      },
      Completed: {
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        darkColor: 'text-blue-400',
        darkBgColor: 'bg-blue-900/20',
        text: 'Completed'
      }
    };

    const config = statusConfig[applicationStatus];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? config.darkBgColor : config.bgColor
        } ${theme === 'dark' ? config.darkColor : config.color}`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  // Check if user can apply for a webinar
  const canApplyForWebinar = (webinarId: number): boolean => {
    const status = applicationStatuses[webinarId];
    return !status?.hasApplied; // Can only apply if hasn't applied before
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Webinars
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Browse and register for tech sessions
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search webinars..."
              className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } hover:text-gray-700 dark:hover:text-gray-300`
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'registered'
                ? 'border-primary text-primary'
                : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } hover:text-gray-700 dark:hover:text-gray-300`
                }`}
            >
              Registered
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past'
                ? 'border-primary text-primary'
                : `border-transparent ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } hover:text-gray-700 dark:hover:text-gray-300`
                }`}
            >
              Past Webinars
            </button>
          </nav>
        </div>

        {/* Webinars Grid */}
        {webinarsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {webinarsToDisplay.map((webinar: Webinar) => {
              const webinarId = Number(webinar.id);
              const status = applicationStatuses[webinarId];
              const canApply = canApplyForWebinar(webinarId);
              const webinarData = webinar as WebinarWithApplications;

              return (
                <div key={webinar.id} className="flex justify-center">
                  <div className={`w-full max-w-sm rounded-lg shadow-md border ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'} overflow-hidden`}>

                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                      {webinarData.image ? (
                        <img
                          src={webinarData.image}
                          alt={webinar.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${webinarData.requiresPayment || (webinarData.price && webinarData.price > 0)
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                          }`}>
                          {webinarData.requiresPayment || (webinarData.price && webinarData.price > 0)
                            ? `$${webinarData.price}`
                            : 'FREE'}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {getStatusBadge(webinarId) && (
                        <div className="absolute top-4 left-4">
                          {getStatusBadge(webinarId)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                          {webinar.title}
                        </h3>
                      </div>

                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
                        {webinar.description}
                      </p>

                      {/* Info Grid */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {formatDate(webinar.schedule)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-green-500" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {webinarData.speaker || 'Speaker TBA'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {webinarData.location || 'Online'}
                          </span>
                        </div>

                        {webinarData.availableSpots !== undefined && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {webinarData.availableSpots} spots available
                            </span>
                          </div>
                        )}

                        {webinarData.duration && (
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="w-4 h-4 text-red-500" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {webinarData.duration} minutes
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDetailClick(webinar)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>

                        {canApply && (
                          <button
                            onClick={() => handleApplyClick(webinar)}
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {webinarData.requiresPayment || (webinarData.price && webinarData.price > 0)
                              ? 'Register & Pay'
                              : 'Register Free'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {searchQuery ? 'No webinars found matching your search.' : `No ${activeTab} webinars available.`}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  {selectedWebinar.title}
                </h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Webinar Details
                </p>
              </div>
              <button
                onClick={closeDetailModal}
                className={`p-2 rounded-lg hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
                  }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                    {selectedWebinar.image ? (
                      <img
                        src={selectedWebinar.image}
                        alt={selectedWebinar.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-4 py-2 rounded-full text-lg font-bold ${selectedWebinar.requiresPayment || (selectedWebinar.price && selectedWebinar.price > 0)
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                        }`}>
                        {selectedWebinar.requiresPayment || (selectedWebinar.price && selectedWebinar.price > 0)
                          ? `${selectedWebinar.price}`
                          : 'FREE'}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Schedule
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(selectedWebinar.schedule)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-green-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Speaker
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedWebinar.speaker || 'Speaker TBA'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Location
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedWebinar.location || 'Online'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-red-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Duration
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedWebinar.duration || 60} minutes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Capacity
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedWebinar.availableSpots || selectedWebinar.capacity || 'Unlimited'}
                          {selectedWebinar.capacity && ' spots available'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Registration
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedWebinar._count?.tickets || 0} registered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Description and Details */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Description
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedWebinar.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Questions Preview */}
                  {selectedWebinar.questions && selectedWebinar.questions.length > 0 && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Registration Questions
                      </h3>
                      <div className="space-y-3">
                        {selectedWebinar.questions.slice(0, 3).map((question, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                              {question.question}
                            </p>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Type: {question.type}
                              {question.options && question.options.length > 0 && ` • ${question.options.length} options`}
                            </p>
                          </div>
                        ))}
                        {selectedWebinar.questions.length > 3 && (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            ... and {selectedWebinar.questions.length - 3} more questions
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Refund Policy */}
                  {selectedWebinar.refundPolicy && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Refund Policy
                      </h3>
                      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedWebinar.refundPolicy}
                      </p>
                    </div>
                  )}

                  {/* FAQ */}
                  {selectedWebinar.faq && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        FAQ
                      </h3>
                      <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedWebinar.faq}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
              }`}>
              <button
                type="button"
                onClick={closeDetailModal}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Close
              </button>

              {canApplyForWebinar(Number(selectedWebinar.id)) && (
                <button
                  onClick={() => {
                    closeDetailModal();
                    handleApplyClick(selectedWebinar as Webinar);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {selectedWebinar.requiresPayment || (selectedWebinar.price && selectedWebinar.price > 0)
                    ? `Register & Pay ${selectedWebinar.price}`
                    : 'Register for Free'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions Modal */}
      {showQuestionsModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Registration Questions
                </h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {selectedWebinar.title} • FREE
                </p>
              </div>
              <button
                onClick={closeQuestionsModal}
                className={`p-2 rounded-lg hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <div className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                        {question.question}
                        {question.required !== false && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </div>

                      {renderQuestionInput(question, index)}

                      {errors[index] && (
                        <p className="text-sm text-red-500">{errors[index]}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No questions for this webinar. You can register directly.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
              }`}>
              <button
                type="button"
                onClick={closeQuestionsModal}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Cancel
              </button>

              <button
                onClick={handleQuestionsSubmit}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{isSubmitting ? 'Processing...' : 'Register for Free'}</span>
                {!isSubmitting && <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedWebinar && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-end"
          onClick={(e) => {
            if ((e.target as Element).id === 'modal-backdrop') {
              closePaymentModal();
            }
          }}
        >
          <div
            className="h-full w-full max-w-md animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <PaymentComponent
              amount={selectedWebinar.price?.toString() || "0"}
              webinarId={selectedWebinar.id.toString()}
              type="webinar"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onClose={closePaymentModal}
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

export default UserWebinars;