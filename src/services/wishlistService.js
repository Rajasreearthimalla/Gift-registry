import api from './api';

const wishlistService = {
  getAll: async () => {
    const { data } = await api.get('/wishlist');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/wishlist', payload);
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/wishlist/${id}`);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/wishlist/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/wishlist/${id}`);
    return data;
  },
  getPublic: async (shareToken) => {
    const { data } = await api.get(`/wishlist/public/${shareToken}`);
    return data;
  }
};

export default wishlistService;

