import { api } from './api'


export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    profile?: {
        name: string;
        avatarUrl?: string;
    };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
}

export interface VerifyOtpData {
    email: string;
    otp: string;
}

export interface ForgotPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token?: string;
}

export interface OAuthData {
  code: string;
  redirectUri?: string;
}

export const authService = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    register: async (data: SignupData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<AuthResponse>("/auth/me");
        return response.data.user;
    },

    logout: async (): Promise<void> => {
        const response = await api.post("/auth/logout");
        localStorage.removeItem('token');
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/verify-otp', data);
        return response.data;
    },

    checkEmail: async (email: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/check-email', { email });
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/forgot-password', data);
        return response.data;
    },

    updatePassword: async (data: UpdatePasswordData): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/update-password', data);
        return response.data;
    },

    resendOtp: async (email: string) => {
        const response = await api.post<{ message: string }>('/auth/resent-otp', { email });
        return response.data;
    },

    googleAuth: async (data: OAuthData) => {
        try {
            const response = await api.post('/auth/google', {
                ...data,
                redirectUri: data.redirectUri || `${import.meta.env.VITE_FRONTEND_URL}/oauth-callback`
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Invalid OAuth request. Please try again.');
            } else if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please try again.');
            } else {
                throw new Error(error.response?.data?.message || 'Google authentication failed');
            }
        }
    },

    githubAuth: async (data: OAuthData) => {
        try {
            const response = await api.post('/auth/github', {
                ...data,
                redirectUri: data.redirectUri || `${window.location.origin}/oauth-callback`
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Invalid OAuth request. Please try again.');
            } else if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please try again.');
            } else {
                throw new Error(error.response?.data?.message || 'GitHub authentication failed');
            }
        }
    },
}

export const oauthService = {
};