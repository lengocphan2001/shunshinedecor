# Shunshine Decor - Setup Guide

## Multi-Language Support (i18n)

### Overview
The app supports English and Vietnamese languages with easy switching and persistent storage.

### Installation
First, install the required dependencies:
```bash
npm install i18next react-i18next @react-native-async-storage/async-storage
```

### Features
- ✅ English and Vietnamese translations
- ✅ Language persistence across app restarts
- ✅ Easy language switching via Settings
- ✅ Language switcher on Login screen
- ✅ Type-safe translation keys

### File Structure
```
src/
├── i18n/
│   ├── config.ts              # i18n configuration
│   ├── index.ts               # Exports
│   ├── useLanguage.ts         # Custom hook for language management
│   ├── LanguageSwitcher.tsx   # Language switcher component
│   └── locales/
│       ├── en.json            # English translations
│       └── vi.json            # Vietnamese translations
```

### Usage in Components

#### 1. Using the useTranslation hook:
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.appName')}</Text>
  );
}
```

#### 2. Using the LanguageSwitcher component:
```typescript
import { LanguageSwitcher } from '../../i18n';

// As a button with modal
<LanguageSwitcher variant="button" />

// With callback
<LanguageSwitcher 
  variant="button" 
  onLanguageChange={(language) => console.log('Changed to:', language)}
/>
```

#### 3. Using the useLanguage hook:
```typescript
import { useLanguage } from '../../i18n';

function MyComponent() {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  
  return (
    <View>
      <Text>Current: {currentLanguage}</Text>
      <Button 
        onPress={() => changeLanguage('vi')} 
        title="Switch to Vietnamese" 
      />
    </View>
  );
}
```

### Adding New Translations

1. Add keys to both `en.json` and `vi.json`:
```json
// en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// vi.json
{
  "myFeature": {
    "title": "Tính năng của tôi",
    "description": "Đây là tính năng của tôi"
  }
}
```

2. Use in component:
```typescript
<Text>{t('myFeature.title')}</Text>
<Text>{t('myFeature.description')}</Text>
```

---

## Dark Mode Support

### Overview
The app includes a complete dark mode implementation with theme switching and persistent storage.

### Features
- ✅ Light and Dark themes
- ✅ Theme persistence across app restarts
- ✅ Easy toggle in Settings
- ✅ Dynamic StatusBar styling
- ✅ All components support both themes

### File Structure
```
src/
└── theme/
    ├── ThemeContext.tsx    # Theme provider and context
    ├── themes.ts           # Light and dark theme definitions
    ├── colors.ts           # Legacy color definitions
    ├── typography.ts       # Typography styles
    ├── spacing.ts          # Spacing constants
    ├── shadows.ts          # Shadow styles
    └── index.ts            # Exports
```

### Theme Configuration

#### Light Theme Colors:
```typescript
{
  primary: '#007AFF',
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    white: '#FFFFFF',
  },
  // ... more colors
}
```

#### Dark Theme Colors:
```typescript
{
  primary: '#0A84FF',
  background: '#000000',
  cardBackground: '#1C1C1E',
  text: {
    primary: '#FFFFFF',
    secondary: '#98989D',
    white: '#FFFFFF',
  },
  // ... more colors
}
```

### Usage in Components

#### 1. Using the useTheme hook:
```typescript
import { useTheme } from '../../theme';

function MyComponent() {
  const { colors, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text.primary }}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

#### 2. Creating dynamic styles:
```typescript
import { useTheme } from '../../theme';

function MyComponent() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  return <View style={styles.container} />;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.divider,
  },
  text: {
    color: colors.text.primary,
  },
});
```

#### 3. Converting existing components:

**Before:**
```typescript
import { colors, typography, spacing } from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text.primary,
  },
});
```

**After:**
```typescript
import { typography, spacing, useTheme } from '../../theme';

function MyComponent() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // ... rest of component
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text.primary,
  },
});
```

### Theme Toggle Implementation

The theme toggle is integrated into the Settings screen:

```typescript
// In SettingScreen.tsx
const { isDark, toggleTheme } = useTheme();

// Settings item
{
  id: 'darkmode',
  title: 'Dark Mode',
  description: 'Switch between light and dark themes',
  icon: 'moon',
  type: 'toggle',
  value: isDark,
  onValueChange: toggleTheme,
}
```

### Adding Theme Support to New Components

1. Import `useTheme`:
```typescript
import { useTheme } from '../../theme';
```

2. Get colors from context:
```typescript
const { colors } = useTheme();
```

3. Create dynamic styles:
```typescript
const styles = createStyles(colors);
```

4. Define styles function:
```typescript
const createStyles = (colors: any) => StyleSheet.create({
  // ... your styles using colors
});
```

---

## Best Practices

### Multi-Language
1. **Always provide translations for both languages** when adding new strings
2. **Use descriptive translation keys** (e.g., `home.projectList` instead of `home.pl`)
3. **Group related translations** under the same parent key
4. **Keep translations short and clear** for better UX

### Dark Mode
1. **Use `cardBackground` for card-like elements** (not `background`)
2. **Use `background` for screen backgrounds**
3. **Always use theme colors** (never hardcode colors)
4. **Test in both modes** before committing changes

### General
1. **Keep the hook at component top** for consistency
2. **Create styles function below component** for readability
3. **Use TypeScript types** for better development experience
4. **Follow existing patterns** in the codebase

---

## Troubleshooting

### Language not persisting?
- Ensure AsyncStorage is properly installed
- Check that i18n config is imported in App.tsx

### Dark mode not working?
- Verify ThemeProvider wraps your app in App.tsx
- Ensure components use `useTheme()` hook
- Check that styles are created dynamically with `createStyles()`

### Colors not updating?
- Make sure you're using `colors` from `useTheme()`, not imported `colors`
- Verify `createStyles()` function receives `colors` parameter

---

## Support

For questions or issues, please contact the development team.

