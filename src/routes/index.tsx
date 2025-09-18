import { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminWebinars from '../pages/portal/AdminWebinar';
import CreateWebinarPage from '../pages/portal/CreateWebinarPage';
import { DashboardPage } from '../pages/portal/DashboardPage';
import UserWebinars from '../pages/portal/UserWebinars';
import { LoginPage } from '../pages/public/LoginPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { PublicPage } from '../pages/public/Public';
import { RegisterPage } from '../pages/public/RegisterPage';
import { WebinarsPage } from '../pages/public/WebinarsPage';

// Define custom route properties
interface AppRouteCustom {
  auth?: boolean;
  roles?: string[];
}

// Combine with RouteObject type
type AppRoute = RouteObject & AppRouteCustom;

const createProtectedRoute = (
  element: ReactNode,
  roles?: string[]
): ReactNode => {
  return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;
};

export const publicRoutes: AppRoute[] = [
  {
    path: '/',
    element: <PublicPage />,
  },
  {
    path: '/webinars',
    element: <WebinarsPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
];

export const dashboardRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    element: createProtectedRoute(<DashboardLayout />),
    children: [
      {
        index: true,
        element: createProtectedRoute(<DashboardPage />),
      },
      {
        path: 'users',
        element: createProtectedRoute(<div>Users Page</div>, ['ADMIN']),
      },
      {
        path: 'webinars',
        element: createProtectedRoute(<UserWebinars />, ['USER']),
      },
      {
        path: 'admin-webinars',
        element: createProtectedRoute(<AdminWebinars />, ['ADMIN']),
      },
      {
        path: 'admin-webinars/create',
        element: createProtectedRoute(<CreateWebinarPage />, ['ADMIN']),
      },
      {
        path: 'admin-webinars/edit/:id',
        element: createProtectedRoute(<div>Edit Webinar Page</div>, ['ADMIN']),
      },
      {
        path: 'admin-webinars/applicants/:id',
        element: createProtectedRoute(<div>Webinar Applicants Page</div>, ['ADMIN']),
      },
      {
        path: 'internships',
        element: createProtectedRoute(<div>Internships Page</div>, ['USER']),
      },
      {
        path: 'membership',
        element: createProtectedRoute(<div>Membership Page</div>, ['USER', 'ADMIN']),
      },
      {
        path: 'billing',
        element: createProtectedRoute(<div>Billing Page</div>, ['USER']),
      },
      {
        path: 'startup-programs',
        element: createProtectedRoute(<div>Startup Programs</div>, ['USER', 'ADMIN']),
      },
      {
        path: 'projects',
        element: createProtectedRoute(<div>Projects Page</div>, ['USER', 'ADMIN']),
      },
      {
        path: 'articles',
        element: createProtectedRoute(<div>Articles Page</div>, ['USER', 'ADMIN']),
      },
      {
        path: 'settings',
        element: createProtectedRoute(<div>Account Settings</div>, ['USER', 'ADMIN']),
      },
    ],
  },
];

export const errorRoutes: AppRoute[] = [
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Combine all routes
export const routes: AppRoute[] = [
  ...publicRoutes,
  ...dashboardRoutes,
  ...errorRoutes,
];

// Auth redirect routes
export const getAuthRedirects = (isAuthenticated: boolean) => ({
  '/login': isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />,
  '/register': isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />,
});