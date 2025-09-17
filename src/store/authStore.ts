import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, User, LoginData, SignupData, OAuthData } from "@/services/authService";
import { toast } from 'sonner';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    tempEmail: string | null;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: SignupData) => Promise<void>;
    logout: () => void; // Changed to synchronous
    getCurrentUser: () => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    checkEmail: (email: string) => Promise<void>;
    setTempEmail: (email: string | null) => void;
    forgotPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    googleAuth: (data: OAuthData) => Promise<void>;
    githubAuth: (data: OAuthData) => Promise<void>;
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
            tempEmail: null,

            // In your auth store login method
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
                });
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Login failed';
                
                set({
                error: errorMessage,
                isLoading: false,
                });

                // Specific handling for unverified accounts
                if (errorMessage.includes('verify') || errorMessage.includes('verified')) {
                // This will be used by the component to show resend options
                throw new Error('UNVERIFIED_ACCOUNT');
                } else {
                toast.error('Login Failed', {
                    description: errorMessage,
                });
                }
                throw error;
            }
            },

            register: async (data: SignupData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(data);
                    set({
                        user: response.user,
                        token: response.token || null, // Handle if token is returned
                        isAuthenticated: !!response.token,
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

            logout: () => {
                set({ isLoading: true });
                try {
                    authService.logout().catch(() => {
                        // Silently fail if API call fails, but still cleanup locally
                    });
                } catch (error) {
                    console.log('Logout error:', error);
                } finally {
                    // Single source of truth for logout state
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    localStorage.removeItem('token');
                    toast.success('Logged out successfully!');
                    window.location.href = '/login';
                }
            },

            getCurrentUser: async () => {
                const { token } = get();
                if (!token) return;
                
                set({ isLoading: true });
                try {
                    const user = await authService.getCurrentUser();
                    set({ user, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || "Failed to get user data",
                        isLoading: false,
                    });
                    
                    if (error.response?.status === 401) {
                        // Handle 401 without causing infinite loops
                        set({ 
                            user: null, 
                            token: null, 
                            isAuthenticated: false 
                        });
                        localStorage.removeItem('token');
                    } else {
                        toast.error('Session error', {
                            description: error.response?.data?.message || "Failed to get user data",
                        });
                    }
                }
            },

            setTempEmail: (email: string | null) => set({ tempEmail: email }),

            verifyOtp: async (email: string, otp: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.verifyOtp({ email, otp });
                    set({ isLoading: false, tempEmail: null });
                    toast.success('Email verified successfully!');
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'OTP verification failed',
                        isLoading: false,
                    });
                    toast.error('Verification Failed', {
                        description: error.response?.data?.message || 'OTP verification failed',
                    });
                    throw error;
                }
            },

            checkEmail: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.checkEmail(email);
                    set({ isLoading: false });
                    toast.success('OTP sent to your email!');
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Failed to send OTP',
                        isLoading: false,
                    });
                    toast.error('Failed to send OTP', {
                        description: error.response?.data?.message || 'Failed to send OTP',
                    });
                    throw error;
                }
            },

            forgotPassword: async (email: string, otp: string, newPassword: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.forgotPassword({ email, otp, newPassword });
                    set({ isLoading: false });
                    toast.success('Password reset successfully!');
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Password reset failed',
                        isLoading: false,
                    });
                    toast.error('Reset Failed', {
                        description: error.response?.data?.message || 'Password reset failed',
                    });
                    throw error;
                }
            },

            updatePassword: async (currentPassword: string, newPassword: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.updatePassword({ currentPassword, newPassword });
                    set({ isLoading: false });
                    toast.success('Password updated successfully!');
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Password update failed',
                        isLoading: false,
                    });
                    toast.error('Update Failed', {
                        description: error.response?.data?.message || 'Password update failed',
                    });
                    throw error;
                }
            },

            resendOtp: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.resendOtp(email);
                    set({ isLoading: false });
                    toast.success('OTP resent successfully');
                } catch (error: any) {
                    set({ error: error.response?.data?.message || "Failed to resend OTP", isLoading: false });
                    toast.error("Resend Failed", {
                        description: error.response?.data?.message,
                    });
                    throw error;
                }
            },

            googleAuth: async (data: OAuthData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.googleAuth(data);
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                    }
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Google login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            githubAuth: async (data: OAuthData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.githubAuth(data);
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                    }
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'GitHub login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    throw new Error(errorMessage);
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
);