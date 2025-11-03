import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../tabs/HomeScreen';
import ChatScreen from '../tabs/ChatScreen';
import { ChatDetailScreen } from '../chat';
import ApprovalCenterScreen from '../tabs/ApprovalCenterScreen';
import ToDoScreen from '../tabs/ToDoScreen';
import MoreScreen from '../tabs/MoreScreen';
import ProfileScreen from '../tabs/ProfileScreen';
import SettingScreen from '../tabs/SettingScreen';
import ProjectDetailScreen from '../project/ProjectDetailScreen';
import { QuickReportScreen } from '../project';
import ITPInspectionScreen from '../inspection/ITPInspectionScreen';
import InspectionDetailScreen from '../inspection/InspectionDetailScreen';
import BottomMenu from '../../components/common/BottomMenu';
import { TabType, ScreenType, NavigationState, ProjectDetailParams, ITPInspectionParams, InspectionDetailParams, ChatDetailParams, QuickReportParams, SCREEN_PATHS } from '../../types';
import { colors, spacing, useTheme } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meApi, logoutApi } from '../../api/auth';

export default function AppNavigator() {
  const { backgroundSource } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentScreen: 'home',
    activeTab: 'home',
    navigationStack: ['home'],
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await logoutApi();
    setIsLoggedIn(false);
    setNavigationState({
      currentScreen: 'home',
      activeTab: 'home',
      navigationStack: ['home'],
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          await meApi(); // validate token
          setIsLoggedIn(true);
        }
      } catch {}
      finally { setRestoring(false); }
    })();
  }, []);

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

  const handleNavigateToQuickReport = (params: QuickReportParams) => {
    const newStack = [...(navigationState.navigationStack || []), 'quickReport'] as ScreenType[];
    setNavigationState({
      currentScreen: 'quickReport',
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

  const handleNavigateToChatDetail = (params: ChatDetailParams) => {
    const newStack = [...(navigationState.navigationStack || []), 'chatDetail'] as ScreenType[];
    setNavigationState({
      currentScreen: 'chatDetail',
      activeTab: navigationState.activeTab,
      params,
      navigationStack: newStack,
    });
  };

  const handleOpenSetting = () => {
    const newStack = [...(navigationState.navigationStack || []), 'setting'] as ScreenType[];
    setNavigationState({
      currentScreen: 'setting',
      activeTab: navigationState.activeTab,
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
        return <ChatScreen onNavigateToChatDetail={handleNavigateToChatDetail} />;
      case 'chatDetail':
        return (
          <ChatDetailScreen 
            chatId={navigationState.params?.chatId || ''}
            chatName={navigationState.params?.chatName || ''}
            unreadCount={navigationState.params?.unreadCount}
            onGoBack={handleGoBack}
            navigationStack={navigationState.navigationStack}
            onNavigateToScreen={handleNavigateToSpecificScreen}
          />
        );
      case 'approval':
        return <ApprovalCenterScreen />;
      case 'todo':
        return <ToDoScreen />;
      case 'more':
        return <MoreScreen onNavigateToSetting={handleOpenSetting} />;
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
            onNavigateToQuickReport={handleNavigateToQuickReport}
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
      case 'quickReport':
        return (
          <QuickReportScreen 
            projectId={navigationState.params?.projectId || ''}
            projectName={navigationState.params?.projectName}
            onGoBack={handleGoBack}
            navigationStack={navigationState.navigationStack}
            onNavigateToScreen={handleNavigateToSpecificScreen}
          />
        );
      default:
        return <HomeScreen onNavigateToProjectDetail={handleNavigateToProjectDetail} />;
    }
  };

  if (restoring) {
    return null;
  }

  if (isLoggedIn) {
    const hideBottomForScreens: ScreenType[] = ['chatDetail', 'projectDetail', 'itpInspection', 'inspectionDetail', 'setting', 'quickReport'];
    const shouldShowBottomMenu = !hideBottomForScreens.includes(navigationState.currentScreen as ScreenType);
    return (
      <ImageBackground
        source={backgroundSource}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {renderActiveScreen()}
          </View>
          {shouldShowBottomMenu && (
            <BottomMenu
              activeTab={navigationState.activeTab as TabType}
              onTabPress={handleTabChange}
            />
          )}
        </View>
      </ImageBackground>
    );
  }

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});
