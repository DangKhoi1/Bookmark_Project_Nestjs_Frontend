import { create } from 'zustand';
import api from '../api/axios';
import type { Category, CreateCategoryDto, EditCategoryDto } from '../types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: (dto: CreateCategoryDto) => Promise<Category>;
  updateCategory: (id: number, dto: EditCategoryDto) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Category[]>('/category');
      set({ categories: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tải categories',
        isLoading: false,
      });
    }
  },

  createCategory: async (dto: CreateCategoryDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Category>('/category', dto);
      set((state) => ({
        categories: [...state.categories, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tạo category',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id: number, dto: EditCategoryDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<Category>(`/category/${id}`, dto);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? response.data : c
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể cập nhật category',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/category/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể xóa category',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
