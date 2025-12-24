import { create } from 'zustand';
import api from '../api/axios';
import type { Bookmark, CreateBookmarkDto, EditBookmarkDto, Pagination, PaginatedResponse, BookmarkFilterParams } from '../types';

interface BookmarkState {
  bookmarks: Bookmark[];
  selectedBookmark: Bookmark | null;
  pagination: Pagination | null;
  filters: BookmarkFilterParams;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBookmarks: (params?: BookmarkFilterParams) => Promise<void>;
  fetchBookmarkById: (id: number) => Promise<void>;
  createBookmark: (dto: CreateBookmarkDto) => Promise<void>;
  updateBookmark: (id: number, dto: EditBookmarkDto) => Promise<void>;
  deleteBookmark: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  setFilters: (filters: Partial<BookmarkFilterParams>) => void;
  clearFilters: () => void;
  clearSelectedBookmark: () => void;
  clearError: () => void;
}

const defaultFilters: BookmarkFilterParams = {
  sortBy: 'newest',
  page: 1,
  limit: 20,
};

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  selectedBookmark: null,
  pagination: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchBookmarks: async (params?: BookmarkFilterParams) => {
    const currentFilters = params || get().filters;
    set({ isLoading: true, error: null, filters: currentFilters });
    
    try {
      // Build query params
      const queryParams = new URLSearchParams();
      if (currentFilters.search) queryParams.set('search', currentFilters.search);
      if (currentFilters.categoryId) queryParams.set('categoryId', String(currentFilters.categoryId));
      if (currentFilters.tagId) queryParams.set('tagId', String(currentFilters.tagId));
      if (currentFilters.isFavorite !== undefined) queryParams.set('isFavorite', String(currentFilters.isFavorite));
      if (currentFilters.sortBy) queryParams.set('sortBy', currentFilters.sortBy);
      if (currentFilters.page) queryParams.set('page', String(currentFilters.page));
      if (currentFilters.limit) queryParams.set('limit', String(currentFilters.limit));

      const response = await api.get<PaginatedResponse<Bookmark>>(`/bookmark?${queryParams.toString()}`);
      set({ 
        bookmarks: response.data.data, 
        pagination: response.data.pagination,
        isLoading: false 
      });
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
      await api.post<Bookmark>('/bookmark/create', dto);
      // Refresh the list
      await get().fetchBookmarks();
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

  toggleFavorite: async (id: number) => {
    try {
      const response = await api.patch<Bookmark>(`/bookmark/${id}/favorite`);
      set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === id ? { ...b, isFavorite: response.data.isFavorite } : b
        ),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Không thể cập nhật favorite',
      });
    }
  },

  setFilters: (newFilters: Partial<BookmarkFilterParams>) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
    get().fetchBookmarks(updatedFilters);
  },

  clearFilters: () => {
    get().fetchBookmarks(defaultFilters);
  },

  clearSelectedBookmark: () => set({ selectedBookmark: null }),
  clearError: () => set({ error: null }),
}));
