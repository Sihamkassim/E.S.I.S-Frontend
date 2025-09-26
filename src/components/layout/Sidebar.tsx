import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

// Icons
import {
    Briefcase,
    Building,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    CreditCard,
    FileText,
    LayoutDashboard,
    Rocket,
    Settings,
    UserCircle,
    Users,
    Video
} from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: ('USER' | 'ADMIN')[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'Internships',
    path: '/dashboard/internships',
    icon: <Briefcase className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'My Webinars',
    path: '/dashboard/webinars',
    icon: <Video className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Manage Webinars',
    path: '/dashboard/admin-webinars',
    icon: <Video className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'Membership',
    path: '/dashboard/membership',
    icon: <UserCircle className="w-5 h-5" />,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Billing',
    path: '/dashboard/billing',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['USER']
  },
  
  {
    title: 'Startup Programs',
    path: '/dashboard/startup-programs',
    icon: <Rocket className="w-5 h-5" />,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Projects',
    path: '/dashboard/projects',
    icon: <Building className="w-5 h-5" />,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Articles',
    path: '/dashboard/articles',
    icon: <FileText className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Manage Articles',
    path: '/dashboard/admin-articles',
    icon: <FileText className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'Membership Plans',
    path: '/admin/membership-plans',
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'Account Settings',
    path: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['USER', 'ADMIN']
  }
];

interface SidebarProps {
  userRole: 'USER' | 'ADMIN';
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, isOpen = false, onClose }) => {
  // Initialize collapsed state based on isOpen
  const [isCollapsed, setIsCollapsed] = useState(!isOpen); // ❌ invert logic if needed
  const { theme } = useTheme();
  const location = useLocation();

  // Sync collapsed state if isOpen prop changes
  useEffect(() => {
    setIsCollapsed(!isOpen); // or just setIsCollapsed(!isOpen) depending on your design
  }, [isOpen]);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  }, [location.pathname, onClose]);

  const filteredNavItems = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out 
        ${theme === 'dark' ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-16 p-1.5 rounded-full ${
          theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm cursor-pointer`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Section */}
      <div className={`p-4 ${isCollapsed ? 'justify-center' : ''} flex items-center`}>
        <img
          src="/ESIS-logo.png"
          alt="ESIS Logo"
          className={`${isCollapsed ? 'w-8' : 'w-12'} transition-all duration-300`}
        />
        {!isCollapsed && (
          <span className={`ml-2 font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            E.S.I.S
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 px-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-2 mb-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-primary text-white'
                    : 'bg-primary-light/10 text-primary'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className={isCollapsed ? 'mx-auto' : ''}>{item.icon}</div>
              {!isCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;