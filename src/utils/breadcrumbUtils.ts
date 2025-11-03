import { BreadcrumbItem } from '../components/common/Breadcrumb';
import { ScreenType, SCREEN_PATHS } from '../types/navigation';

export const generateBreadcrumbItems = (
  currentScreen: ScreenType,
  navigationStack: ScreenType[],
  params?: Record<string, any>,
  onGoBack?: () => void,
  onNavigateToScreen?: (screenType: ScreenType, screenParams?: any) => void
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [];
  
  // Build breadcrumb based on navigation stack
  if (currentScreen === 'projectDetail') {
    // For project detail: Projects > [ProjectName]
    items.push({
      id: '1',
      label: 'Projects',
      onPress: () => {
        if (onNavigateToScreen) {
          onNavigateToScreen('home', { projectId: params?.projectId, projectName: params?.projectName });
        } else if (onGoBack) {
          onGoBack();
        }
      },
    });
    
    if (params?.projectName) {
      items.push({
        id: '2',
        label: params.projectName,
      });
    }
  } else if (currentScreen === 'itpInspection') {
    // For ITP inspection: Projects > [ProjectName] > inspection
    items.push({
      id: '1',
      label: 'Projects',
      onPress: () => {
        if (onNavigateToScreen) {
          onNavigateToScreen('home', { projectId: params?.projectId, projectName: params?.projectName });
        } else if (onGoBack) {
          onGoBack();
        }
      },
    });
    
    if (params?.projectName) {
      items.push({
        id: '2',
        label: params.projectName,
        onPress: () => {
          if (onNavigateToScreen) {
            onNavigateToScreen('projectDetail', { projectId: params?.projectId, projectName: params?.projectName });
          }
        },
      });
    }
    
    items.push({
      id: '3',
      label: 'inspection',
    });
  } else if (currentScreen === 'inspectionDetail') {
    // For inspection detail: Projects > [ProjectName] > inspection > [ItemTitle]
    items.push({
      id: '1',
      label: 'Projects',
      onPress: () => {
        if (onNavigateToScreen) {
          onNavigateToScreen('home', { projectId: params?.projectId, projectName: params?.projectName });
        } else if (onGoBack) {
          onGoBack();
        }
      },
    });
    
    if (params?.projectName) {
      items.push({
        id: '2',
        label: params.projectName,
        onPress: () => {
          if (onNavigateToScreen) {
            onNavigateToScreen('projectDetail', { projectId: params?.projectId, projectName: params?.projectName });
          }
        },
      });
    }
    
    items.push({
      id: '3',
      label: 'inspection',
      onPress: () => {
        if (onNavigateToScreen) {
          onNavigateToScreen('itpInspection', { projectId: params?.projectId, projectName: params?.projectName });
        }
      },
    });
    
    if (params?.inspectionItemTitle) {
      items.push({
        id: '4',
        label: params.inspectionItemTitle,
      });
    }
  } else if (currentScreen === 'chatDetail') {
    // For chat detail: Chat > [ChatName]
    items.push({
      id: '1',
      label: 'Chat',
      onPress: () => {
        if (onNavigateToScreen) {
          onNavigateToScreen('chat');
        } else if (onGoBack) {
          onGoBack();
        }
      },
    });
    if (params?.chatName) {
      items.push({
        id: '2',
        label: params.chatName,
      });
    }
  } else {
    // For other screens, use simple path
    const currentPath = SCREEN_PATHS[currentScreen];
    currentPath.forEach((pathSegment, index) => {
      const isLast = index === currentPath.length - 1;
      items.push({
        id: (index + 1).toString(),
        label: pathSegment,
        onPress: isLast ? undefined : onGoBack,
      });
    });
  }
  
  return items;
};
