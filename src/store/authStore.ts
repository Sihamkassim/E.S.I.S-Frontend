import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, User, LoginData, SignupData } from "@/services/authService";
import { toast } from 'sonner';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: localStorage.getItem('token'),
            isAuthenticated: !!localStorage.getItem('token'),
            isLoading: false,
            error: null,


            login: async (data: LoginData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(data);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success('Login successful!', {
                        description: 'Welcome back',
                    })
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false,
                    });
                    toast.error('Login Failed', {
                        description: error.response?.data?.message || 'Login failed',
                    });
                    throw error;
                }
            },

            register: async (data: SignupData) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await authService.register(data);
                    set({
                        user: response.user,
                        isLoading: false,
                    });
                    toast.success('Account created successfully!', {
                        description: 'You can now sign in with your credentials',
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false,
                    });
                    toast.error('Sign up failed', {
                        description: error.response?.data?.message || 'Registration failed',
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true});
                try {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    localStorage.removeItem('token');
                    toast.success('Logged out successfully!');
                } catch (error) {
                    console.log('Logout error:', error)
                    toast.error('Logout failed');
                } finally {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    localStorage.removeItem('token');
                }
            },

            getCurrentUser: async () => {
                if (!get().token) return;
                set({ isLoading: true })
                try {
                    const user = await authService.getCurrentUser()
                    set({ user, isLoading: false })
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || "Failed to get user data",
                        isLoading: false,
                    });
                    toast.error('Session error', {
                        description: error.response?.data?.message || "Failed to get user data",
                    })
                    if (error.response?.status === 401) {
                        get().logout();
                    }
                }
            },
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)