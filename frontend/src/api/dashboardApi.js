import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const dashboardApi = {
  getOverall: () => API.get('/admin/dashboard/overall'),
};