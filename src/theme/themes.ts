/**
 * Theme Configurations
 * Defines light and dark theme color palettes
 */

export interface ThemeColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  neutral: string;
  divider: string;
  background: string;
  cardBackground: string;
  
  login: {
    background: string;
    inputBackground: string;
    buttonBackground: string;
    inputBorder: string;
    languageText: string;
    footerText: string;
    brandBackground: string;
  };
  
  status: {
    onSchedule: string;
    late: string;
    warning: string;
  };
  
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    white: string;
    inverse: string;
  };
  
  overlay: {
    light: string;
    dark: string;
  };
  
  border: string;
  shadow: string;
}

export const lightTheme: ThemeColors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  neutral: '#8E8E93',
  divider: 'rgba(51, 48, 48, 0.3)',
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  
  login: {
    background: '#E8F0F8',
    inputBackground: 'rgba(255, 255, 255, 0.8)',
    buttonBackground: 'rgba(255, 255, 255, 0.8)',
    inputBorder: 'rgba(255, 255, 255, 0.3)',
    languageText: '#007AFF',
    footerText: '#333333',
    brandBackground: '#FF3B30',
  },
  
  status: {
    onSchedule: '#34C759',
    late: '#FF3B30',
    warning: '#FF9500',
  },
  
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    tertiary: '#C7C7CC',
    white: '#FFFFFF',
    inverse: '#FFFFFF',
  },
  
  overlay: {
    light: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
  
  border: '#E5E5EA',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme: ThemeColors = {
  primary: '#0A84FF',
  success: '#32D74B',
  warning: '#FF9F0A',
  danger: '#FF453A',
  neutral: '#98989D',
  divider: 'rgba(255, 255, 255, 0.2)',
  background: '#000000',
  cardBackground: '#1C1C1E',
  
  login: {
    background: '#1C1C1E',
    inputBackground: 'rgba(44, 44, 46, 0.9)',
    buttonBackground: 'rgba(44, 44, 46, 0.9)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    languageText: '#0A84FF',
    footerText: '#E5E5EA',
    brandBackground: '#FF453A',
  },
  
  status: {
    onSchedule: '#32D74B',
    late: '#FF453A',
    warning: '#FF9F0A',
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#98989D',
    tertiary: '#48484A',
    white: '#FFFFFF',
    inverse: '#000000',
  },
  
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
  
  border: '#38383A',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Theme = 'light' | 'dark';

