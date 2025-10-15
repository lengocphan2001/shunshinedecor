import { ScreenType } from './navigation';

// Base props for all screens
export interface BaseScreenProps {
  projectId?: string;
  projectName?: string;
  onGoBack?: () => void;
  navigationStack?: ScreenType[];
  onNavigateToScreen?: (screenType: ScreenType, screenParams?: any) => void;
}

// Common screen handlers
export interface ScreenHandlers {
  handleProfilePress: () => void;
  handleChatPress: () => void;
  handleNotificationPress: () => void;
}

// Navigation params for different screen types
export interface NavigationParams {
  projectId: string;
  projectName?: string;
  [key: string]: any;
}

// Base item interface for all list items
export interface BaseItem {
  id: string;
  title: string;
  onPress?: () => void;
}

// Status types used across the app
export type ItemStatus = 'completed' | 'error' | 'warning' | 'info';

// Common tab configuration
export interface TabConfig {
  id: string;
  label: string;
  isActive?: boolean;
}

// Common action button props
export interface ActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
}
