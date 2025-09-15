// src/pages/ResendVerificationPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { FormInput } from '@/components/ui/FormInput';
import { Spinner } from '@/components/Spinner';
import { toast } from 'sonner';

export const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const { resendOtp, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await resendOtp(email);
      toast.success('Verification email sent! Check your inbox.');
      navigate('/login', { 
        state: { message: 'Verification email sent successfully!' } 
      });
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Resend Verification
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a new verification code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              error={error ?? undefined}
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm"/>
                Sending...
              </div>
            ) : (
              'Resend Verification'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Remembered your password?{' '}
            </span>
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};