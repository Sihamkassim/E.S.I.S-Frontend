// src/pages/OAuthCallback.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/Spinner';

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleAuth, githubAuth } = useAuthStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');
  const [provider, setProvider] = useState<string>('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const stateParam = searchParams.get('state');
        
        let detectedProvider = stateParam || sessionStorage.getItem('oauthProvider') || '';
        
        sessionStorage.removeItem('oauthProvider');
        setProvider(detectedProvider);

        if (errorParam) {
          setError(errorDescription || errorParam || 'Authentication failed');
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setError('Invalid OAuth response: missing authorization code');
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!detectedProvider) {
          setError('Invalid OAuth response: missing provider information');
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const redirectUri = `${import.meta.env.VITE_FRONTEND_URL}/oauth-callback`;
        
        if (detectedProvider === 'google') {
          await googleAuth({ code, redirectUri });
        } else if (detectedProvider === 'github') {
          await githubAuth({ code, redirectUri });
        } else {
          throw new Error('Unsupported provider');
        }

        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (err: any) {
        console.error('OAuth error:', err);
        setError(err.response?.data?.message || err.message || 'Authentication failed');
        setStatus('error');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, googleAuth, githubAuth]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Return to Login
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Authentication Successful!</h2>
          <p className="mt-2 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <Spinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Completing authentication with {provider}...</h2>
        <p className="mt-2 text-gray-600">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};