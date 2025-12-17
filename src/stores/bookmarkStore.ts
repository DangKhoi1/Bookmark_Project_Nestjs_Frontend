import { create } from 'zustand';
import api from '../api/axios';
import type { Bookmark, CreateBookmarkDto, EditBookmarkDto } from '../types';

interface BookmarkState {
  bookmarks: Bookmark[];
  selectedBookmark: Bookmark | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBookmarks: () => Promise<void>;
  fetchBookmarkById: (id: number) => Promise<void>;
  createBookmark: (dto: CreateBookmarkDto) => Promise<void>;
  updateBookmark: (id: number, dto: EditBookmarkDto) => Promise<void>;
  deleteBookmark: (id: number) => Promise<void>;
  clearSelectedBookmark: () => void;
  clearError: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  bookmarks: [],
  selectedBookmark: null,
  isLoading: false,
  error: null,

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Bookmark[]>('/bookmark');
      set({ bookmarks: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tải bookmarks',
        isLoading: false,
      });
    }
  },

  fetchBookmarkById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Bookmark>(`/bookmark/${id}`);
      set({ selectedBookmark: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tải bookmark',
        isLoading: false,
      });
    }
  },

  createBookmark: async (dto: CreateBookmarkDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Bookmark>('/bookmark/create', dto);
      set((state) => ({
        bookmarks: [...state.bookmarks, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể tạo bookmark',
        isLoading: false,
      });
      throw error;
    }
  },

  updateBookmark: async (id: number, dto: EditBookmarkDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<Bookmark>(`/bookmark/${id}`, dto);
      set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === id ? response.data : b
        ),
        selectedBookmark: response.data,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể cập nhật bookmark',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBookmark: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/bookmark/${id}`);
      set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể xóa bookmark',
        isLoading: false,
      });
      throw error;
    }
  },

  clearSelectedBookmark: () => set({ selectedBookmark: null }),
  clearError: () => set({ error: null }),
}));
