export const colors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  neutral: '#8E8E93',
  divider: 'rgba(51, 48, 48, 0.3)',
  background: '#FFFFFF',
  
  // Login screen specific colors
  login: {
    background: '#E8F0F8', // Light blue background (fallback)
    inputBackground: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for inputs
    buttonBackground: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for button
    inputBorder: 'rgba(255, 255, 255, 0.3)', // Semi-transparent border
    languageText: '#007AFF', // Dark blue for language selector
    footerText: '#333333', // Dark gray for footer text
    brandBackground: '#FF3B30', // Red for brand logo
  },
  
  // Project status colors
  status: {
    onSchedule: '#34C759', // Green for on schedule
    late: '#FF3B30', // Red for late
    warning: '#FF9500', // Orange for warning
  },
  
  // Additional utility colors
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    white: '#FFFFFF',
  },
  
  // Overlay for frosted glass effect
  overlay: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type Colors = typeof colors;

