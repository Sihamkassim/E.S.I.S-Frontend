import AdminArticles from '@/pages/admin/AdminArticlesPage';
import EditArticlePage from '@/pages/admin/EditArticlePage';
import PostArticlePage from '@/pages/admin/PostArticlePage';
import UsersPage from '@/pages/admin/UsersPage';
import AccountSettingsPage from '@/pages/portal/AccountSettingsPage';
import AdminAddPlan from '@/pages/portal/AdminAddPlan';
import AdminGetStartups from '@/pages/portal/AdminGetStartups';
import AdminMembership from '@/pages/portal/AdminMembership';
import AdminPayments from '@/pages/portal/AdminPayment';
import AdminPlans from '@/pages/portal/AdminPlans';
import { ArticlePage } from '@/pages/portal/ArticlePage';
import ArticlesPage from '@/pages/portal/ArticlesPage';
import UserCreateStartup from '@/pages/portal/UserCreatStartupp';
import UserGetStartup from '@/pages/portal/UserGetStartup';
import UserPayment from '@/pages/portal/UserPayment';
import UserPlans from '@/pages/portal/UserPlane';
import { TechUpdatePage } from '@/pages/public/articles/TechUpdatePage';
import TechUpdatesPage from '@/pages/public/articles/TechUpdatesPage';
import { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminProjects from '../pages/portal/AdminProjects';
import AdminWebinars from '../pages/portal/AdminWebinar';
import CreateWebinarPage from '../pages/portal/CreateWebinarPage';
import { ChangePasswordPage } from '../pages/portal/UpdatePassword';
import UserInternships from '../pages/portal/UserInternships';
import UserProjects from '../pages/portal/UserProjects';
import UserWebinars from '../pages/portal/UserWebinars';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { LoginPage } from '../pages/public/LoginPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';
import { OAuthCallbackPage } from '../pages/public/OAuthCallbackPage';
import { VerifyEmailPage } from '../pages/public/OTPPage';
import ProjectsPage from '../pages/public/ProjectsPage';
import { PublicPage } from '../pages/public/Public';
import { RegisterPage } from '../pages/public/RegisterPage';
import { WebinarsPage } from '../pages/public/WebinarsPage';
import CreateInternshipPage from '@/pages/admin/CreateInternshipPage';
import EditInternshipPage from '@/pages/admin/EditInternshipPage';
import AdminInternships from '@/pages/admin/AdminInternshipsPage';
import { AdminInternshipPage } from '@/pages/admin/AdminInternshipPage';
import InternshipApplications from '@/pages/portal/AdminInternshipApplications';
import Home from '@/pages/public/HomePage/Home';
import CommunityPage from '@/pages/public/communityPage/CommunityPage';
import AboutPage from '../pages/public/AboutPage/AboutPage';
import DashboardPage from '@/pages/portal/DashboardPage';

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
    element: <Home />,
  },
  {
    path: '/community',
    element: <CommunityPage />,
  },
  {
    path: '/about-us',
    element: <AboutPage />,
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
        element: createProtectedRoute(<UserInternships />, ['USER']),
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
        path: 'get-memberships',
        element: createProtectedRoute(<AdminMembership />, ['ADMIN']),
      },
      {
        path: 'my-payment',
        element: createProtectedRoute(<UserPayment />, ['USER']),
      },
      {
        path: 'get-payment',
        element: createProtectedRoute(<AdminPayments />, ['ADMIN']),
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
        element: createProtectedRoute(<EditInternshipPage />, ['ADMIN']),
      },
      {
        path: 'internship-applications',
        element: createProtectedRoute(<InternshipApplications />, ['ADMIN']),
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
