// App configuration constants
export const APP_CONFIG = {
  name: 'SunShine Decor',
  version: '1.0.0',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.sunshinedecor.com',
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
