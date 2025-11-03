export type ScreenType = 'home' | 'chat' | 'chatDetail' | 'approval' | 'todo' | 'more' | 'profile' | 'setting' | 'projectDetail' | 'itpInspection' | 'inspectionDetail' | 'quickReport';

export interface NavigationState {
  currentScreen: ScreenType;
  activeTab?: string;
  params?: Record<string, any>;
  navigationStack?: ScreenType[];
}

export interface ProjectDetailParams {
  projectId: string;
  projectName?: string;
}

export interface ITPInspectionParams {
  projectId: string;
  projectName?: string;
}

// Screen display names for breadcrumb
export const SCREEN_NAMES: Record<ScreenType, string> = {
  home: 'Home',
  chat: 'Chat',
  chatDetail: 'Chat Detail',
  approval: 'Approval',
  todo: 'To-Do',
  more: 'More',
  profile: 'Profile',
  setting: 'Setting',
  projectDetail: 'Project Detail',
  itpInspection: 'ITP Inspection',
  inspectionDetail: 'Inspection Detail',
  quickReport: 'Quick Report',
};

// Screen paths for breadcrumb (nested structure)
export const SCREEN_PATHS: Record<ScreenType, string[]> = {
  home: ['Home'],
  chat: ['Chat'],
  chatDetail: ['Chat'],
  approval: ['Approval'],
  todo: ['To-Do'],
  more: ['More'],
  profile: ['Profile'],
  setting: ['Setting'],
  projectDetail: ['Projects'],
  itpInspection: ['Projects', 'inspection'],
  inspectionDetail: ['Projects', 'inspection'],
  quickReport: ['Projects'],
};

export interface InspectionDetailParams {
  projectId: string;
  projectName?: string;
  inspectionItemId: string;
  inspectionItemTitle: string;
}

export interface ChatDetailParams {
  chatId: string;
  chatName: string;
  unreadCount?: number;
}

export interface QuickReportParams {
  projectId: string;
  projectName?: string;
}
