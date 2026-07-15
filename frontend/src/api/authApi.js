// src/api/authApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const authApi = {
    // Register new user
    register: (userData) => API.post('/api/auth/register', userData),

    // Login with email and password
    login: (credentials) => API.post('/api/auth/login', credentials),

    // Logout
    logout: () => API.post('/api/auth/logout'),

    // Get current user info
    getCurrentUser: () => API.get('/api/auth/me'),

    // Forgot password
    forgotPassword: (email) => API.post('/api/auth/forgot-password', { email }),

    // Reset password with token
    resetPassword: (data) => API.post('/api/auth/reset-password', data),

    // Change password
    changePassword: (data) => API.post('/api/auth/change-password', data),

    // Get user profile
    getProfile: () => API.get('/api/user/profile'),

    // Update user profile
    updateProfile: (data) => API.put('/api/user/profile', data),
};