import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';
import { useAuthStore } from '../store/authStore';

export function AppRoutes() {
  const { isAuthenticated, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  return useRoutes(routes);
}