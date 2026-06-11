import api from './api';

const TOKEN_KEY = 'token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const authService = {
  async register(name, email, password) {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    storeToken(data.token);
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    storeToken(data.token);
    return data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } finally {
      clearStoredToken();
    }
  },

  async getProfile() {
    const { data } = await api.get('/api/auth/profile');
    return data;
  },
};
