import api from './axios.js';

const responseData = async (request) => (await request).data.data;

export const signup = (payload) => responseData(api.post('/auth/signup', payload));
export const login = (payload) => responseData(api.post('/auth/login', payload));
export const updatePassword = (payload) => responseData(api.patch('/auth/update-password', payload));
