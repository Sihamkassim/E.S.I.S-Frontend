import { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminProjects from '../pages/portal/AdminProjects';
import AdminWebinars from '../pages/portal/AdminWebinar';
import CreateWebinarPage from '../pages/portal/CreateWebinarPage';
import { DashboardPage } from '../pages/portal/DashboardPage';
import UserProjects from '../pages/portal/UserProjects';
import UserWebinars from '../pages/portal/UserWebinars';
import { LoginPage } from '../pages/public/LoginPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import ProjectsPage from '../pages/public/ProjectsPage';
import { PublicPage } from '../pages/public/Public';
import { RegisterPage } from '../pages/public/RegisterPage';
import { WebinarsPage } from '../pages/public/WebinarsPage';
import { ChangePasswordPage } from '../pages/portal/UpdatePassword';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { OAuthCallbackPage } from '../pages/public/OAuthCallbackPage';
import { VerifyEmailPage } from '../pages/public/OTPPage';
import AdminAddPlan from '@/pages/portal/AdminAddPlan';
import AdminPlans from '@/pages/portal/AdminPlans';
import UserPlans from '@/pages/portal/UserPlane';
import UserCreateStartup from '@/pages/portal/UserCreatStartupp';
import AdminGetStartups from '@/pages/portal/AdminGetStartups';
import UserGetStartup from '@/pages/portal/UserGetStartup';
import UsersPage from '@/pages/admin/UsersPage';
import AdminArticles from '@/pages/admin/AdminArticlesPage';
import TechUpdatesPage from '@/pages/public/articles/TechUpdatesPage';
import { TechUpdatePage } from '@/pages/public/articles/TechUpdatePage';
import { ArticlePage } from '@/pages/portal/ArticlePage';
import ArticlesPage from '@/pages/portal/ArticlesPage';
import PostArticlePage from '@/pages/admin/PostArticlePage';
import EditArticlePage from '@/pages/admin/EditArticlePage';
import AccountSettingsPage from '@/pages/portal/AccountSettingsPage';
import CreateInternshipPage from '@/pages/admin/CreateInternshipPage';
import EditInternshipPage from '@/pages/admin/EditInternshipPage';
import AdminInternships from '@/pages/admin/AdminInternshipsPage';
import { AdminInternshipPage } from '@/pages/admin/AdminInternshipPage';

interface AppRouteCustom {
  auth?: boolean;
  roles?: string[];
}

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
    path: '/tech-updates',
    element: <TechUpdatesPage />,
  },
  {
    path: 'tech-updates/:slug',
    element: <TechUpdatePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
  }

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
        element: createProtectedRoute(<UsersPage />, ['ADMIN']),
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
        path: 'projects/my',
        element: createProtectedRoute(<UserProjects />, ['USER']),
      },
      {
        path: 'projects',
        element: createProtectedRoute(<AdminProjects />, ['ADMIN']),
      },
      {
        path: 'articles',
        element: createProtectedRoute(<ArticlesPage />, ['USER', 'ADMIN']),
      },
      {
        path: 'articles/:slug',
        element: createProtectedRoute(<ArticlePage />, ['USER', 'ADMIN']),
      },
      {
        path: 'admin-articles',
        element: createProtectedRoute(<AdminArticles />, ['ADMIN']),
      },
      {
        path: 'admin-articles/create',
        element: createProtectedRoute(<PostArticlePage />, ['ADMIN']),
      },
      {
        path: 'admin-articles/:id/edit',
        element: createProtectedRoute(<EditArticlePage />, ['ADMIN']),
      },
      {
        path: 'settings',
        element: createProtectedRoute(<AccountSettingsPage />, ['USER', 'ADMIN']),
      },
      {
        path: 'change-password',
        element: createProtectedRoute(<ChangePasswordPage />, ['USER', 'ADMIN']),
      },
      {
        path: 'change-password',
        element: createProtectedRoute(<ChangePasswordPage />, ['USER', 'ADMIN']),
      },
      {
        path: 'membership-plans',
        element: createProtectedRoute(<AdminPlans />, ['USER', 'ADMIN']),
      },
      {
        path: 'add-plans',
        element: createProtectedRoute(<AdminAddPlan />, ['ADMIN']),
      },
      {
        path: 'get-plans',
        element: createProtectedRoute(<UserPlans />, ['USER']),
      },
      {
        path: 'post-startup',
        element: createProtectedRoute(<UserCreateStartup />, ['USER', 'ADMIN']),
      },
      {
        path: 'get-startup',
        element: createProtectedRoute(<AdminGetStartups />, ['ADMIN']),
      },
      {
        path: 'me-startup',
        element: createProtectedRoute(<UserGetStartup />, ['USER']),
      },
      {
        path: 'admin-internships/:id',
        element: createProtectedRoute(<AdminInternshipPage />, ['ADMIN']),
      },
      {
        path: 'admin-internships',
        element: createProtectedRoute(<AdminInternships />, ['ADMIN']),
      },
      {
        path: 'admin-internships/create',
        element: createProtectedRoute(<CreateInternshipPage />, ['ADMIN']),
      },
      {
        path: 'admin-internships/:id/edit',
        element: createProtectedRoute(<EditInternshipPage/>, ['ADMIN']),
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

export const routes: AppRoute[] = [
  ...publicRoutes,
  ...dashboardRoutes,
  ...errorRoutes,
];

// 🚀 Auth redirect helper
export const getAuthRedirects = (isAuthenticated: boolean) => ({
  '/login': isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />,
  '/register': isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />,
  '/verify-email': isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyEmailPage />,
  '/forgot-password': isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />,
  '/oauth-callback': isAuthenticated ? <Navigate to="/dashboard" replace /> : <OAuthCallbackPage />,
});
