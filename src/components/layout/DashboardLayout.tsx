import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Default to 'USER' role if not specified
  const userRole = user?.role || 'USER';

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`h-screen flex overflow-hidden bg-gray-100 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0`}
      >
        <Sidebar
          userRole={userRole as 'USER' | 'ADMIN'}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </aside>
      {/* beside */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden">
        <DashboardNavbar onMobileMenuClick={toggleMobileMenu} />

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;