import api from './axios.js';

export const signup = async (payload) => (await api.post('/auth/signup', payload)).data;
export const login = async (payload) => (await api.post('/auth/login', payload)).data;
export const updatePassword = async (payload) => (await api.patch('/auth/update-password', payload)).data;
