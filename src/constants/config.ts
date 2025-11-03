// App configuration constants
import { Platform } from 'react-native';
const DEFAULT_API_BASE = 'http://192.168.1.54:4000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_BASE;

export const APP_CONFIG = {
  name: 'SunShine Decor',
  version: '1.0.0',
  apiBaseUrl: API_BASE_URL,
} as const;

// UI Configuration
export const UI_CONFIG = {
  avatarSize: {
    small: 24,
    medium: 50,
    large: 80,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  notification: {
    maxUnreadDisplay: 9, // Show "9+" for counts > 9
  },
} as const;

// Default values
export const DEFAULTS = {
  notificationCount: 1,
  avatarText: 'U', // Default avatar text
  pageSize: 20,
  maxRetries: 3,
} as const;
