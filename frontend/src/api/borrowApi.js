// src/api/borrowApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

// Base path khác các API khác: có tiền tố /api (khớp BorrowApi.java)
const BASE = '/api/librarian/borrows';

// Tạo phiếu mượn: { email, barcodes: [], durationDay? }
export const createBorrow = (data) => API.post(BASE, data);

// Trả sách: { borrowId, barcodes?: [] } (bỏ trống barcodes = trả tất cả)
export const returnBooks = (data) => API.post(`${BASE}/return`, data);

// Lập phiếu phạt do mất sách: { borrowId, barcode, amount?, reason? }
// amount bỏ trống = lấy theo giá sách. Trả về FineResponse.
export const reportLostBook = (data) => API.post(`${BASE}/lost`, data);

// Danh sách phiếu mượn theo email thành viên
export const getBorrowsByEmail = (email) =>
    API.get(`${BASE}?email=${encodeURIComponent(email)}`);

// Chi tiết 1 phiếu mượn
export const getBorrow = (id) => API.get(`${BASE}/${id}`);
