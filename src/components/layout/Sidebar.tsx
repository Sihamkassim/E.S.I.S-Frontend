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
  PanelLeft,
  Rocket,
  Settings,
  UserCircle,
  Users,
  Video,
  FileSearch // Added for internship applications
} from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: ('USER' | 'ADMIN')[];
  children?: NavItem[]; // Added for nested items
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
    title: 'Internships',
    path: '/dashboard/admin-internships',
    icon: <Briefcase className="w-5 h-5" />,
    roles: ['ADMIN'],
    children: [
      {
        title: 'Applications',
        path: '/dashboard/internship-applications',
        icon: <FileSearch className="w-4 h-4" />,
        roles: ['ADMIN']
      }
    ]
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
    title: 'Memberships',
    path: '/dashboard/get-memberships',
    icon: <UserCircle className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'Payments',
    path: '/dashboard/get-payment',
    icon: <PanelLeft className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'My Payments',
    path: '/dashboard/my-payment',
    icon: <PanelLeft className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Plans',
    path: '/dashboard/get-plans',
    icon: <PanelLeft className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Startup Programs',
    path: '/dashboard/me-startup',
    icon: <Rocket className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Startup Programs',
    path: '/dashboard/get-startup',
    icon: <Rocket className="w-5 h-5" />,
    roles: ['ADMIN']
  },
  {
    title: 'My Projects',
    path: '/dashboard/projects/my',
    icon: <Building className="w-5 h-5" />,
    roles: ['USER']
  },
  {
    title: 'Manage Projects',
    path: '/dashboard/projects',
    icon: <Building className="w-5 h-5" />,
    roles: ['ADMIN']
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
    path: '/dashboard/membership-plans',
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
  const [isCollapsed, setIsCollapsed] = useState(!isOpen);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  const location = useLocation();

  // Sync collapsed state if isOpen prop changes
  useEffect(() => {
    setIsCollapsed(!isOpen);
  }, [isOpen]);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // Auto-expand parent if child is active
  useEffect(() => {
    const newExpanded = new Set(expandedItems);
    navigationItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child =>
          location.pathname === child.path
        );
        if (isChildActive) {
          newExpanded.add(item.path);
        }
      }
    });
    setExpandedItems(newExpanded);
  }, [location.pathname]);

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  const filteredNavItems = navigationItems.filter(item => item.roles.includes(userRole));

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.path);
    const childItems = hasChildren ? item.children!.filter(child => child.roles.includes(userRole)) : [];
    const hasVisibleChildren = childItems.length > 0;

    return (
      <div key={item.path}>
        <div
          className={`flex items-center p-2 mb-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive
            ? theme === 'dark'
              ? 'bg-primary text-white'
              : 'bg-primary-light/10 text-primary'
            : theme === 'dark'
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          style={{
            paddingLeft: isCollapsed ? '0.5rem' : `${0.5 + level * 1}rem`,
            marginLeft: isCollapsed ? '0' : `${level * 0.5}rem`,
            marginRight: isCollapsed ? '0' : '0.5rem'
          }}
          onClick={(e) => {
            if (hasVisibleChildren) {
              e.preventDefault();
              e.stopPropagation();
              toggleExpanded(item.path);
            } else {
              // Navigate normally if no children or if it's a leaf node
            }
          }}
        >
          <Link
            to={hasVisibleChildren ? '#' : item.path} // Use # for parent items with children
            className={`flex items-center flex-1 ${isCollapsed ? 'justify-center' : ''
              }`}
            onClick={(e) => {
              if (hasVisibleChildren) {
                e.preventDefault();
                // Toggle is handled by the parent div
              } else {
                if (onClose && window.innerWidth < 1024) {
                  onClose();
                }
              }
            }}
          >
            <div className={isCollapsed ? 'mx-auto' : ''}>{item.icon}</div>
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium flex-1">{item.title}</span>
                {hasVisibleChildren && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                      }`}
                  />
                )}
              </>
            )}
          </Link>
        </div>

        {/* Render children if expanded and not collapsed */}
        {hasVisibleChildren && !isCollapsed && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700">
            {childItems.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

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
        className={`absolute -right-3 top-16 p-1.5 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900'
          } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm cursor-pointer`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Section */}
      <div className={`${isCollapsed ? 'justify-center' : ''} flex items-center`}>
        <img
          src="/ESIS-logo.png"
          alt="ESIS Logo"
          className={`${isCollapsed ? 'w-30' : 'w-30'} transition-all duration-300`}
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 px-2">
        {filteredNavItems.map((item) => renderNavItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;