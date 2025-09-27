import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useWebinarStore, Webinar, WebinarQuestion } from '../../store/useWebinarstore';

interface WebinarApplyModalProps {
  webinar: Webinar;
  isOpen: boolean;
  onClose: () => void;
  onTicketIssued?: () => void;
}

const WebinarApplyModal: React.FC<WebinarApplyModalProps> = ({ webinar, isOpen, onClose, onTicketIssued }) => {
  const { theme } = useTheme();
  const { applyForWebinar, initializeWebinarPayment } = useWebinarStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Initialize answers dynamically
  const getInitialAnswers = (): Record<string, string | string[]> => {
    const initial: Record<string, string | string[]> = {};
    webinar.questions?.forEach((q: WebinarQuestion) => {
      initial[q.id] = q.type === 'checkbox' ? [] : '';
    });
    return initial;
  };

  const [answers, setAnswers] = useState<Record<string, string | string[]>>(getInitialAnswers());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset answers when webinar changes
  useEffect(() => {
    setAnswers(getInitialAnswers());
  }, [webinar]);

  const handleInputChange = (q: WebinarQuestion, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [q.id]: value }));
  };

  const handleCheckboxChange = (q: WebinarQuestion, option: string) => {
    const current = answers[q.id] as string[];
    handleInputChange(q, current.includes(option) ? current.filter(o => o !== option) : [...current, option]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate(`/login?redirect=/webinars/${webinar.id}`);
      return;
    }

    // Validate required questions
    for (const q of webinar.questions || []) {
      const ans = answers[q.id];
      if (q.required && ((Array.isArray(ans) && ans.length === 0) || (!Array.isArray(ans) && !ans))) {
        toast.error(`Please answer: "${q.question}"`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Ensure webinar ID is number
      const webinarId = typeof webinar.id === 'string' ? Number(webinar.id) : webinar.id;
      const application = await applyForWebinar(webinarId, answers);

      // Paid path: redirect to payment
      if (application.requiresPayment && application.price && application.price > 0) {
        toast.success('Application submitted. Redirecting to payment...', {
          description: 'Please complete payment to secure your spot.'
        });
        try {
          const paymentInit = await initializeWebinarPayment?.(webinarId, application.price);
          const checkoutUrl = paymentInit?.data?.checkout_url || paymentInit?.data?.data?.checkout_url;
          if (checkoutUrl) {
            // Close modal before redirect
            onClose();
            window.location.href = checkoutUrl;
            return;
          }
          toast.error('Failed to get payment checkout link', { description: 'Try again or contact support.' });
        } catch (err: any) {
          toast.error('Payment initialization failed', { description: err?.message || 'Try again later.' });
        }
      } else {
        // Free path now returns ticket immediately
        if ((application as any).ticket) {
          toast.success('Your seat is confirmed!', {
            description: `Ticket code: ${(application as any).ticket.code}`
          });
          onTicketIssued?.();
        } else {
          toast.success('Registered successfully!');
        }
        if (!(application as any).ticket) {
          onClose();
        }
      }
    } catch (error: any) {
      toast.error('Failed to submit application', {
        description: error?.message || 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose}></div>

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-xl shadow-2xl z-50 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Apply for {webinar.title}
          </h3>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Please answer these questions to complete your application
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {webinar.questions && webinar.questions.length > 0 ? (
              webinar.questions.map(q => (
                <div key={q.id}>
                  <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {q.question} {q.required && <span className="text-red-500">*</span>}
                  </label>

                  {q.type === 'text' && (
                    <input
                      type="text"
                      value={answers[q.id] as string}
                      onChange={e => handleInputChange(q, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Type your answer..."
                    />
                  )}

                  {q.type === 'textarea' && (
                    <textarea
                      value={answers[q.id] as string}
                      onChange={e => handleInputChange(q, e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Type your answer..."
                    />
                  )}

                  {q.type === 'radio' && q.options && (
                    <div className="flex flex-col gap-2">
                      {q.options.map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleInputChange(q, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'checkbox' && q.options && (
                    <div className="flex flex-col gap-2">
                      {q.options.map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(answers[q.id] as string[]).includes(opt)}
                            onChange={() => handleCheckboxChange(q, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'select' && q.options && (
                    <select
                      value={answers[q.id] as string}
                      onChange={e => handleInputChange(q, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="">Select an option</option>
                      {q.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))
            ) : (
              <p className={`text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                No questions available for this webinar.
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white flex items-center justify-center min-w-24 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>}
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default WebinarApplyModal;
