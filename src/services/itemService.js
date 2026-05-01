import api from './api';

const itemService = {
  create: async (payload) => {
    const { data } = await api.post('/items', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/items/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  },
  reserve: async (id, payload) => {
    const { data } = await api.post(`/items/${id}/reserve`, payload);
    return data;
  }
};

export default itemService;

