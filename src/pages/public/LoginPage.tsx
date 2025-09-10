import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FormInput } from '../../components/ui/FormInput';
import { Spinner } from '../../components/Spinner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please enter your details
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
              error={error?.includes('email') ? error : undefined}
              placeholder="Enter your email"
            />
            
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              error={error?.includes('password') ? error : undefined}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner size="sm"/>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};