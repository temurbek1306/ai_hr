import api from '../api/axios';
import type {
    ApiResponse,
    AuthLogin,
    AuthRegister,
    LoginResponse,
    ForgotPasswordRequest
} from '../types/api.types';

export const authService = {
    /**
     * Login with username and password
     * POST /auth/login or /api/v1/auth/login
     */
    login: async (credentials: AuthLogin): Promise<string> => {
        try {
            const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);

            if (response.data.success && response.data.body) {
                const { token, role, username } = response.data.body;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                if (username) localStorage.setItem('username', username);
                return token;
            }
            throw new Error(response.data.message || 'Login failed');
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * Register new user
     * POST /auth/register or /api/v1/auth/register
     */
    register: async (data: AuthRegister): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>('/auth/register', data);
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    /**
     * Request password reset
     * POST /api/v1/auth/forgot-password
     */
    forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
        try {
            const request: ForgotPasswordRequest = { email };
            const response = await api.post<ApiResponse<any>>('/api/v1/auth/forgot-password', request);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password error:', error);
            throw new Error(error.response?.data?.message || 'Password reset request failed');
        }
    },

    /**
     * Logout current user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
    },

    /**
     * Get current auth token
     */
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    /**
     * Get current user role
     */
    getRole: (): string | null => {
        return localStorage.getItem('role');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    /**
     * Check if user is admin
     */
    isAdmin: (): boolean => {
        const role = localStorage.getItem('role');
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    }
};
