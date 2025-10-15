/**
 * ShunshineDecor App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/screens/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';
import './src/i18n/config'; // Initialize i18n

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
