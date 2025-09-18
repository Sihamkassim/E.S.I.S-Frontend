import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';

interface DashboardNavbarProps {
  onMobileMenuClick?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ 
  onMobileMenuClick 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 h-16 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-b border-gray-800' 
        : 'bg-white border-b border-gray-200'
    } z-10`}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-lg focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center">
            <span className={`mr-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {user?.email}
            </span>
            <div className="relative group">
              <button
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-1 z-50
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
                border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                invisible group-hover:visible opacity-0 group-hover:opacity-100 
                transition-all duration-200 transform origin-top scale-95 group-hover:scale-100`}>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;