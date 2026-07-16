import API from './axiosConfig';

export const loadVectorDb = () =>
    API.post('/api/test/load-vector-db');

export const clearVectorDb = () =>
    API.post('/api/test/clear-vector-db');
