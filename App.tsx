/**
 * ShunshineDecor App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import AppNavigator from './src/screens/navigation/AppNavigator';
import './src/i18n/config'; // Initialize i18n

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
}

export default App;
