// Common types used across the app
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  isOnline?: boolean;
}

export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
}

export type TabType = 'home' | 'chat' | 'approval' | 'todo' | 'more';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
