export const spacing = {
  // Layout dimensions
  layout: {
    topBar: 48,
    footer: 60,
    contentPercentage: 75, // 75% of screen height
  },
  
  // Common spacing values
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  
  // Padding
  padding: {
    small: 8,
    medium: 12,
    large: 16,
  },
  
  // Margins
  margin: {
    small: 8,
    medium: 12,
    large: 16,
  },
  
  // Border radius
  borderRadius: {
    xs: 4,
    small: 8,
    medium: 12,
    large: 16,
    round: 999,
  },
} as const;

export type Spacing = typeof spacing;

