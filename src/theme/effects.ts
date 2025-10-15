import { colors } from './colors';

// Frosted glass effect (kính mờ)
export const frostedGlass = {
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)', // Note: Limited support in React Native
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
} as const;

// Alternative frosted glass for dark backgrounds
export const frostedGlassDark = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.1)',
} as const;

// Blur configurations
export const blurIntensity = {
  light: 5,
  medium: 10,
  strong: 20,
} as const;

export type Effects = {
  frostedGlass: typeof frostedGlass;
  frostedGlassDark: typeof frostedGlassDark;
  blurIntensity: typeof blurIntensity;
};

