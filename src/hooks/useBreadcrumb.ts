import { useMemo } from 'react';
import { BaseScreenProps } from '../types/base';
import { generateBreadcrumbItems } from '../utils/breadcrumbUtils';
import { ScreenType } from '../types/navigation';

interface UseBreadcrumbProps extends BaseScreenProps {
  currentScreen: ScreenType;
  additionalParams?: Record<string, any>;
}

export const useBreadcrumb = ({
  currentScreen,
  projectId,
  projectName,
  onGoBack,
  navigationStack,
  onNavigateToScreen,
  additionalParams = {},
}: UseBreadcrumbProps) => {
  const breadcrumbItems = useMemo(() => {
    const params = {
      projectId,
      projectName,
      ...additionalParams,
    };

    return generateBreadcrumbItems(
      currentScreen,
      navigationStack || [],
      params,
      onGoBack,
      onNavigateToScreen
    );
  }, [
    currentScreen,
    projectId,
    projectName,
    onGoBack,
    navigationStack,
    onNavigateToScreen,
    additionalParams,
  ]);

  return { breadcrumbItems };
};
