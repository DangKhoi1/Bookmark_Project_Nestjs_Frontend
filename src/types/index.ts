// User type (without sensitive data like hash)
export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

// Bookmark type
export interface Bookmark {
  id: number;
  title: string;
  description: string | null;
  link: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
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
}

export interface EditBookmarkDto {
  title?: string;
  description?: string;
  link?: string;
}

// User DTOs
export interface EditUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}
