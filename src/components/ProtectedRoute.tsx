import { useAuthStore } from "@/store/authStore";
import { ReactNode, useEffect } from "react";
import { Spinner } from "./Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // ✅ added roles support
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, getCurrentUser, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated → go to login
  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  // Role-based check → if roles are defined and user doesn’t match
  if (
    roles &&
    roles.length > 0 &&
    (!user?.role || !roles.includes(user.role))
  ) {
    window.location.href = "/unauthorized"; // 👈 make sure this route exists
    return null;
  }

  return <>{children}</>;
};
