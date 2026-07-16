// src/api/axiosConfig.jsx
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        // Bỏ qua redirect cho cú gọi thăm dò phiên đăng nhập:
        // guest luôn nhận 403 ở đây và cần được ở lại trang công khai (vd trang chủ).
        const isAuthProbe = url.includes('/api/auth/me');
        if ([401, 403].includes(error.response?.status) && !isAuthProbe) {
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;