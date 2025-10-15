import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { frostedGlass, frostedGlassDark, blurIntensity } from './effects';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  effects: {
    frostedGlass,
    frostedGlassDark,
    blurIntensity,
  },
} as const;

export type Theme = typeof theme;

// Export individual modules
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { frostedGlass, frostedGlassDark, blurIntensity } from './effects';
export { ThemeProvider, useTheme } from './ThemeContext';
export { lightTheme, darkTheme } from './themes';
export type { ThemeColors, Theme as ThemeMode } from './themes';

export default theme;

