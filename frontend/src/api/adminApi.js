import api from './axios.js';

const responseData = async (request) => (await request).data.data;

export const getDashboardStats = () => responseData(api.get('/admin/dashboard-stats'));
export const getUsers = (params = {}) => responseData(api.get('/admin/users', { params }));
export const getUserById = (userId) => responseData(api.get(`/admin/users/${userId}`));
export const createUser = (payload) => responseData(api.post('/admin/users', payload));
export const getStores = (params = {}) => responseData(api.get('/admin/stores', { params }));
export const createStore = (payload) => responseData(api.post('/admin/stores', payload));
