// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await authApi.getCurrentUser();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error("Auth check failed:", error.response?.status);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authApi.login(credentials);
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, data: userData };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            await authApi.register(userData);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const forgotPassword = async (email) => {
        try {
            setError(null);
            await authApi.forgotPassword(email);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset link';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const resetPassword = async (data) => {
        try {
            setError(null);
            await authApi.resetPassword(data);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const changePassword = async (data) => {
        try {
            setError(null);
            await authApi.changePassword(data);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const updateProfile = async (data) => {
        try {
            setError(null);
            const response = await authApi.updateProfile(data);
            const updatedUser = response.data;
            setUser(prev => ({ ...prev, ...updatedUser }));
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true, data: updatedUser };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
        checkAuth,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};