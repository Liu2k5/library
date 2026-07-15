// src/api/membershipApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const membershipApi = {
    // Admin endpoints
    getAll: () => API.get('/admin/membershiptypes'),
    getById: (id) => API.get(`/admin/membershiptypes/${id}`),
    create: (data) => API.post('/admin/membershiptypes', data),
    update: (id, data) => API.put(`/admin/membershiptypes/${id}`, data),
    delete: (id) => API.delete(`/admin/membershiptypes/${id}`),

    // User endpoints
    getAllTypes: () => API.get('/api/membership/types'),
    getCurrent: () => API.get('/api/membership/current'),
    register: (data) => API.post('/api/membership/register', data),
    renew: () => API.post('/api/membership/renew'),
};