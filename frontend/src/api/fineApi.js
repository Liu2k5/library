// src/api/fineApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

const BASE = '/api/librarian/fines';

// Danh sách phiếu phạt; status tùy chọn: PAID / UNPAID / WAIVED
export const getFines = (status = "") =>
    API.get(`${BASE}${status ? `?status=${status}` : ""}`);

// Đánh dấu đã thanh toán; data = { copyStatus?: "AVAILABLE" | "UNAVAILABLE" }
export const markFinePaid = (id, data = {}) => API.post(`${BASE}/${id}/pay`, data);

// Tạo link/QR PayOS cho phiếu phạt; trả về PaymentResponse (có paymentUrl)
export const createFinePayment = (id) => API.post(`${BASE}/${id}/payos`);
