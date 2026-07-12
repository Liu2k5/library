import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const notificationApi = {
  getAll: () => API.get('/admin/notifications'),
  getById: (id) => API.get(`/admin/notifications/${id}`),
  create: (notification) => API.post('/admin/notifications', notification),
  update: (id, notification) => API.put(`/admin/notifications/${id}`, notification),
  delete: (id) => API.delete(`/admin/notifications/${id}`),
};
