// User type (without sensitive data like hash)
export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookmarks: number;
  };
}

// Tag type
export interface Tag {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  _count?: {
    bookmarks: number;
  };
}

// Bookmark type
export interface Bookmark {
  id: number;
  title: string;
  description: string | null;
  link: string;
  isFavorite: boolean;
  position: number;
  userId: number;
  categoryId: number | null;
  category?: Category | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

// Pagination type
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Auth DTOs
export interface AuthDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

// Bookmark DTOs
export interface CreateBookmarkDto {
  title: string;
  description?: string;
  link: string;
  categoryId?: number;
  tagNames?: string[];
}

export interface EditBookmarkDto {
  title?: string;
  description?: string;
  link?: string;
  categoryId?: number | null;
  tagNames?: string[];
}

// Category DTOs
export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string;
}

export interface EditCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}

// Tag DTOs
export interface CreateTagDto {
  name: string;
}

// User DTOs
export interface EditUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Filter params
export interface BookmarkFilterParams {
  search?: string;
  categoryId?: number;
  tagId?: number;
  isFavorite?: boolean;
  sortBy?: 'newest' | 'oldest' | 'title' | 'position';
  page?: number;
  limit?: number;
}
