import { api } from './api'

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    profile?: any;
}

export interface AuthResponse {
    message: string;
    user: User;
    token?: string;
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
        localStorage.removeItem('token');
        await api.post('/auth/logout');
    }
}