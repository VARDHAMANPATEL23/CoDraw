import { create } from 'zustand';

const API_BASE = 'http://localhost:5000/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('codraw_user') || 'null'),
  token: localStorage.getItem('codraw_token') || null,
  isAuthenticated: !!localStorage.getItem('codraw_token'),

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('codraw_token', data.token);
    localStorage.setItem('codraw_user', JSON.stringify(data.user));

    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data.user;
  },

  register: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('codraw_token', data.token);
    localStorage.setItem('codraw_user', JSON.stringify(data.user));

    set({ user: data.user, token: data.token, isAuthenticated: true });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('codraw_token');
    localStorage.removeItem('codraw_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
