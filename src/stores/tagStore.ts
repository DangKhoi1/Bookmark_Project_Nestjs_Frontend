import { create } from 'zustand';
import api from '../api/axios';
import type { Tag, CreateTagDto } from '../types';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTags: () => Promise<void>;
  createTag: (dto: CreateTagDto) => Promise<Tag>;
  deleteTag: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Tag[]>('/tag');
      set({ tags: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tải tags',
        isLoading: false,
      });
    }
  },

  createTag: async (dto: CreateTagDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Tag>('/tag', dto);
      // Check if tag already exists in list
      set((state) => {
        const exists = state.tags.some((t) => t.id === response.data.id);
        return {
          tags: exists ? state.tags : [...state.tags, response.data],
          isLoading: false,
        };
      });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tạo tag',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTag: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tag/${id}`);
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể xóa tag',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
