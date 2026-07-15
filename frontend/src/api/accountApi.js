import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const accountApi = {
  getAll: () => API.get('/admin/accounts'),

  getByUsername: (username) =>
    API.get(`/admin/accounts/${username}`),

  create: (user) =>
    API.post('/admin/accounts', user),

  update: (username, user) =>
    API.put(`/admin/accounts/${username}`, user),
};