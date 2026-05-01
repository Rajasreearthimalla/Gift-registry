import api from './api';

const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  }
};

export default authService;

