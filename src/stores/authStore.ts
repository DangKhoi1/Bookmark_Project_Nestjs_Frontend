import { create } from 'zustand';
import api from '../api/axios';
import type { User, AuthDto, AuthResponse, EditUserDto } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (dto: AuthDto) => Promise<void>;
  signup: (dto: AuthDto) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (dto: EditUserDto) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (dto: AuthDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/signin', dto);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      set({ token: access_token, isLoading: false });
      await get().fetchUser();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Đăng nhập thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (dto: AuthDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/signup', dto);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      set({ token: access_token, isLoading: false });
      await get().fetchUser();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Đăng ký thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, error: null });
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<User>('/user/me');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateUser: async (dto: EditUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<User>('/user/update', dto);
      set({ user: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Cập nhật thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
