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

export default theme;

