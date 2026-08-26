import api from './axios.js';

export const getOwnerDashboard = async (params) => (await api.get('/owner/dashboard', { params })).data.data;
