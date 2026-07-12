import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const membershipApi = {
  getAll: () => API.get('/admin/membershiptypes'),

  getById: (id) => API.get(`/admin/membershiptypes/${id}`),

  create: (membershiptypes) => API.post('/admin/membershiptypes', membershiptypes),

  update: (id, membershiptypes) =>
    API.put(`/admin/membershiptypes/${id}`, membershiptypes),

  delete: (id) => API.delete(`/admin/membershiptypes/${id}`),
};