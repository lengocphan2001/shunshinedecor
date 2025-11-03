import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSourcePropType } from 'react-native';
import { lightTheme, darkTheme, ThemeColors, Theme } from './themes';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  // Background image selection
  backgroundKey: BackgroundKey;
  setBackgroundKey: (key: BackgroundKey) => void;
  backgroundSource: ImageSourcePropType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';
const BACKGROUND_STORAGE_KEY = 'app-background';

export type BackgroundKey = 'background1' | 'background2' | 'background3';

const BACKGROUND_IMAGES: Record<BackgroundKey, ImageSourcePropType> = {
  background1: require('../../assets/backgrounds/background1.jpg'),
  background2: require('../../assets/backgrounds/background2.jpg'),
  background3: require('../../assets/backgrounds/background3.jpg'),
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundKey, setBackgroundKeyState] = useState<BackgroundKey>('background2');

  // Load saved theme on mount
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
      const savedBackground = await AsyncStorage.getItem(BACKGROUND_STORAGE_KEY);
      if (savedBackground === 'background1' || savedBackground === 'background2' || savedBackground === 'background3') {
        setBackgroundKeyState(savedBackground as BackgroundKey);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setBackgroundKey = async (key: BackgroundKey) => {
    try {
      setBackgroundKeyState(key);
      await AsyncStorage.setItem(BACKGROUND_STORAGE_KEY, key);
    } catch (error) {
      console.error('Error saving background:', error);
    }
  };

  const backgroundSource = useMemo(() => BACKGROUND_IMAGES[backgroundKey], [backgroundKey]);

  const colors = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  const value: ThemeContextType = {
    theme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
    backgroundKey,
    setBackgroundKey,
    backgroundSource,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

