import api from './axios.js';

export const getOwnerDashboard = async () => (await api.get('/owner/dashboard')).data.data;
