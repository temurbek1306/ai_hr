import axios from 'axios';
import { toast } from 'react-hot-toast';

// Axios instance configuration with backend API URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const url = config.url || '';
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/forgot-password');
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Xatolik yuz berdi';

        if (error.response?.status === 401) {
            console.warn('Authentication error: Token expired or invalid');
        } else if (error.response?.status && error.response.status >= 400) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
