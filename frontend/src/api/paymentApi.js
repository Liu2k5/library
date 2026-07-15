// src/api/paymentApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const paymentApi = {
    // Create a new payment
    createPayment: (data) => API.post('/api/payment/create', data),

    // Get payment by ID
    getPayment: (paymentId) => API.get(`/api/payment/${paymentId}`),

    // Get current user's payment history (paginated)
    getMyPayments: (page = 0, size = 10) =>
        API.get(`/api/payment/my-payments?page=${page}&size=${size}`),

    // Cancel a pending payment
    cancelPayment: (paymentId) => API.post(`/api/payment/${paymentId}/cancel`),

    // Get bill for a specific payment
    getBill: (paymentId) => API.get(`/api/payment/${paymentId}/bill`),
};