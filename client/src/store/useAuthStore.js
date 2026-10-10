import { create } from 'zustand';
import { db } from '../db/projectDB';
import { API_BASE } from '../utils/api';

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

  logout: async () => {
    // Clear all auth tokens
    localStorage.removeItem('codraw_token');
    localStorage.removeItem('codraw_user');
    sessionStorage.clear();

    // Clear local project data and sync queue for clean slate
    try {
      await db.projects.clear();
      await db.syncQueue.clear();
    } catch (err) {
      console.warn('IndexedDB cleanup error:', err);
    }

    set({ user: null, token: null, isAuthenticated: false });
  },
}));
