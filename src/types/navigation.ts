export type ScreenType = 'home' | 'chat' | 'profile' | 'setting' | 'projectDetail' | 'itpInspection' | 'inspectionDetail';

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
  profile: 'Profile',
  setting: 'Setting',
  projectDetail: 'Project Detail',
  itpInspection: 'ITP Inspection',
  inspectionDetail: 'Inspection Detail',
};

// Screen paths for breadcrumb (nested structure)
export const SCREEN_PATHS: Record<ScreenType, string[]> = {
  home: ['Home'],
  chat: ['Chat'],
  profile: ['Profile'],
  setting: ['Setting'],
  projectDetail: ['Projects'],
  itpInspection: ['Projects', 'inspection'],
  inspectionDetail: ['Projects', 'inspection'],
};

export interface InspectionDetailParams {
  projectId: string;
  projectName?: string;
  inspectionItemId: string;
  inspectionItemTitle: string;
}
