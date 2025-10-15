import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../tabs/HomeScreen';
import ChatScreen from '../tabs/ChatScreen';
import ProfileScreen from '../tabs/ProfileScreen';
import SettingScreen from '../tabs/SettingScreen';
import ProjectDetailScreen from '../project/ProjectDetailScreen';
import ITPInspectionScreen from '../inspection/ITPInspectionScreen';
import InspectionDetailScreen from '../inspection/InspectionDetailScreen';
import BottomMenu from '../../components/common/BottomMenu';
import { TabType, ScreenType, NavigationState, ProjectDetailParams, ITPInspectionParams, InspectionDetailParams, SCREEN_PATHS } from '../../types';
import { colors, spacing } from '../../theme';

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentScreen: 'home',
    activeTab: 'home',
    navigationStack: ['home'],
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNavigationState({
      currentScreen: 'home',
      activeTab: 'home',
      navigationStack: ['home'],
    });
  };

  const handleTabChange = (tab: TabType) => {
    setNavigationState({
      currentScreen: tab,
      activeTab: tab,
      navigationStack: [tab],
    });
  };

  const handleNavigateToProjectDetail = (params: ProjectDetailParams) => {
    const newStack = [...(navigationState.navigationStack || []), 'projectDetail'] as ScreenType[];
    setNavigationState({
      currentScreen: 'projectDetail',
      activeTab: navigationState.activeTab,
      params,
      navigationStack: newStack,
    });
  };

  const handleNavigateToITPInspection = (params: ITPInspectionParams) => {
    const newStack = [...(navigationState.navigationStack || []), 'itpInspection'] as ScreenType[];
    setNavigationState({
      currentScreen: 'itpInspection',
      activeTab: navigationState.activeTab,
      params,
      navigationStack: newStack,
    });
  };

  const handleNavigateToInspectionDetail = (params: InspectionDetailParams) => {
    const newStack = [...(navigationState.navigationStack || []), 'inspectionDetail'] as ScreenType[];
    setNavigationState({
      currentScreen: 'inspectionDetail',
      activeTab: navigationState.activeTab,
      params,
      navigationStack: newStack,
    });
  };

  const handleNavigateToSpecificScreen = (screenType: ScreenType, screenParams?: any) => {
    // Find the screen in the navigation stack or create a new path
    const currentStack = navigationState.navigationStack || [];
    const screenIndex = currentStack.indexOf(screenType);
    
    if (screenIndex !== -1) {
      // Screen exists in stack, navigate back to it
      const newStack = currentStack.slice(0, screenIndex + 1);
      setNavigationState({
        currentScreen: screenType,
        activeTab: navigationState.activeTab,
        params: screenParams || navigationState.params,
        navigationStack: newStack,
      });
    } else {
      // Screen not in stack, add it
      const newStack = [...currentStack, screenType];
      setNavigationState({
        currentScreen: screenType,
        activeTab: navigationState.activeTab,
        params: screenParams || navigationState.params,
        navigationStack: newStack,
      });
    }
  };

  const handleGoBack = () => {
    const currentStack = navigationState.navigationStack || [];
    if (currentStack.length > 1) {
      const newStack = currentStack.slice(0, -1);
      const previousScreen = newStack[newStack.length - 1] as ScreenType;
      
      setNavigationState({
        currentScreen: previousScreen,
        activeTab: navigationState.activeTab,
        navigationStack: newStack,
      });
    } else {
      // Fallback to active tab if no navigation stack
      setNavigationState({
        currentScreen: navigationState.activeTab as ScreenType,
        activeTab: navigationState.activeTab,
        navigationStack: [navigationState.activeTab as ScreenType],
      });
    }
  };

  const renderActiveScreen = () => {
    switch (navigationState.currentScreen) {
      case 'home':
        return <HomeScreen onNavigateToProjectDetail={handleNavigateToProjectDetail} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'setting':
        return <SettingScreen />;
      case 'projectDetail':
        return (
          <ProjectDetailScreen 
            projectId={navigationState.params?.projectId || ''}
            projectName={navigationState.params?.projectName}
            onGoBack={handleGoBack}
            onNavigateToITPInspection={handleNavigateToITPInspection}
            navigationStack={navigationState.navigationStack}
            onNavigateToScreen={handleNavigateToSpecificScreen}
          />
        );
      case 'itpInspection':
        return (
          <ITPInspectionScreen 
            projectId={navigationState.params?.projectId || ''}
            projectName={navigationState.params?.projectName}
            onGoBack={handleGoBack}
            navigationStack={navigationState.navigationStack}
            onNavigateToInspectionDetail={handleNavigateToInspectionDetail}
            onNavigateToScreen={handleNavigateToSpecificScreen}
          />
        );
      case 'inspectionDetail':
        return (
          <InspectionDetailScreen 
            projectId={navigationState.params?.projectId || ''}
            projectName={navigationState.params?.projectName}
            inspectionItemId={navigationState.params?.inspectionItemId || ''}
            inspectionItemTitle={navigationState.params?.inspectionItemTitle || ''}
            onGoBack={handleGoBack}
            navigationStack={navigationState.navigationStack}
            onNavigateToScreen={handleNavigateToSpecificScreen}
          />
        );
      default:
        return <HomeScreen onNavigateToProjectDetail={handleNavigateToProjectDetail} />;
    }
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {renderActiveScreen()}
        </View>
        <BottomMenu
          activeTab={navigationState.activeTab as TabType}
          onTabPress={handleTabChange}
        />
      </View>
    );
  }

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.login.background,
  },
  content: {
    flex: 1,
  },
});
