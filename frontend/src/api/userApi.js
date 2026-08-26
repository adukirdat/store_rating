import api from './axios.js';

const responseData = async (request) => (await request).data.data;

export const getStores = (params = {}) => responseData(api.get('/stores', { params }));
export const rateStore = (storeId, value) => responseData(api.post(`/stores/${storeId}/rate`, { value }));
