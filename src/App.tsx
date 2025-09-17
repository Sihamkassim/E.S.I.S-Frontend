import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { DashboardPage } from './pages/portal/DashboardPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { VerifyEmailPage } from './pages/public/OTPPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ChangePasswordPage } from './pages/portal/UpdatePassword';
import { OAuthCallbackPage } from './pages/public/OAuthCallbackPage';

function App() {
  const { isAuthenticated, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        <Route path="/verify-email" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyEmailPage />
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />
        } />
        <Route path="/oauth-callback" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <OAuthCallbackPage />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;