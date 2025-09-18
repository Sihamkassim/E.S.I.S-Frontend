import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FormInput } from '../../components/ui/FormInput';
import { Spinner } from '../../components/Spinner';
import { toast } from 'sonner';

export const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  const { 
    verifyOtp, 
    resendOtp, // Make sure this exists in your store
    isLoading, 
    error, 
    clearError, 
    tempEmail 
  } = useAuthStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or store
  const email = location.state?.email || tempEmail || '';

  useEffect(() => {
    clearError();
    // Start resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOtp(email, otp);
      navigate('/login', { 
        state: { message: 'Email verified successfully! You can now login.' } 
      });
    } catch (error) {
      // Error handled by store
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;
    
    setIsResending(true);
    clearError();
    
    try {
      await resendOtp(email);
      setResendCooldown(60); // 60 seconds cooldown
      toast.success('New OTP sent to your email!');
    } catch (error) {
      // Error handled by store
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the verification code sent to
          </p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              label="Verification Code"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              required
              placeholder="Enter 6-digit code"
              error={error ?? undefined}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || !email || isResending}
                className="text-sm text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isResending ? (
                  <>
                    <Spinner size="sm" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend code in ${formatTime(resendCooldown)}`
                ) : (
                  "Didn't receive the code? Resend"
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm"/>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Wrong email?{' '}
            </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={() => useAuthStore.getState().setTempEmail(null)}
            >
              Go back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};