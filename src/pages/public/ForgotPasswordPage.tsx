// src/pages/auth/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FormInput } from '../../components/ui/FormInput';
import { Spinner } from '../../components/Spinner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { checkEmail, forgotPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await checkEmail(email);
      setStep('reset');
    } catch (error) {
      // Error handled by store
    }
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validatePassword()) {
      return;
    }

    try {
      await forgotPassword(email, otp, newPassword);
      navigate('/login', { 
        state: { message: 'Password reset successfully! Please login with your new password.' } 
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
            {step === 'email' ? 'Reset your password' : 'Create new password'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 'email' 
              ? 'Enter your email to receive a verification code'
              : 'Enter the verification code and your new password'
            }
          </p>
        </div>

        {step === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <FormInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              error={error || undefined}
              placeholder="Enter your email"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm"/>
                  Sending code...
                </div>
              ) : (
                'Send verification code'
              )}
            </button>

            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Verification code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code sent to your email"
              />
              
              <FormInput
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Enter new password (min. 6 characters)"
              />
              
              <FormInput
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                error={passwordError}
                placeholder="Confirm your new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!passwordError}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm"/>
                  Resetting password...
                </div>
              ) : (
                'Reset password'
              )}
            </button>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">
                Need to verify your account?{' '}
              </span>
              <Link
                to="/resend-verification"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Resend verification email
              </Link>
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Use different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};