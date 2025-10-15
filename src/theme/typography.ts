export const typography = {
  fonts: {
    displayMedium: 'SF Pro Display',
    textLight: 'SF Pro Text',
  },
  
  fontSizes: {
    large: 12,      // SF Pro Display Medium 12pt
    medium: 9,      // SF Pro Text Light 9pt
    small: 8,       // SF Pro Text Light 8pt
    login: {
      language: 16,     // Language selector
      input: 16,        // Input field text
      button: 16,       // Button text
      footer: 12,       // Footer text
      brand: 10,        // Brand logo text
    },
  },
  
  fontWeights: {
    medium: '500' as const,
    light: '300' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
  
  // Predefined text styles
  styles: {
    displayMedium: {
      fontFamily: 'SF Pro Display',
      fontSize: 12,
      fontWeight: '500' as const,
    },
    textMedium: {
      fontFamily: 'SF Pro Text',
      fontSize: 9,
      fontWeight: '300' as const,
    },
    textSmall: {
      fontFamily: 'SF Pro Text',
      fontSize: 8,
      fontWeight: '300' as const,
    },
    // Login screen specific styles
    login: {
      language: {
        fontFamily: 'SF Pro Text',
        fontSize: 16,
        fontWeight: '600' as const,
      },
      input: {
        fontFamily: 'SF Pro Text',
        fontSize: 16,
        fontWeight: '300' as const,
      },
      button: {
        fontFamily: 'SF Pro Text',
        fontSize: 16,
        fontWeight: '500' as const,
      },
      footer: {
        fontFamily: 'SF Pro Text',
        fontSize: 12,
        fontWeight: '300' as const,
      },
      brand: {
        fontFamily: 'SF Pro Text',
        fontSize: 10,
        fontWeight: 'bold' as const,
      },
    },
  },
} as const;

export type Typography = typeof typography;

