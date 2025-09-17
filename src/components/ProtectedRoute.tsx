import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "./Spinner";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

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

    if (!isAuthenticated) {
        window.location.href = '/login';
        return null
    }

    return <>{children}</>
}