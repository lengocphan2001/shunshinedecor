import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenLayout from '../../components/layout/ScreenLayout';
import ItemCard from '../../components/common/ItemCard';
import { typography, spacing, useTheme } from '../../theme';
import { useScreenHandlers, useBreadcrumb } from '../../hooks';
import { BaseScreenProps, ActionButtonProps } from '../../types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface ProjectDetailProps extends BaseScreenProps {
  onNavigateToITPInspection?: (params: { projectId: string; projectName?: string }) => void;
}

type ProjectTab = 'tool' | 'overview' | 'doc' | 'photo';

interface ToolAction extends ActionButtonProps {
  id: string;
}

export default function ProjectDetailScreen({ 
  projectId, 
  projectName = 'EPS_HMC',
  onGoBack,
  onNavigateToITPInspection,
  navigationStack,
  onNavigateToScreen
}: ProjectDetailProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<ProjectTab>('tool');
  
  const styles = createStyles(colors);
  
  // Use custom hooks
  const screenHandlers = useScreenHandlers();
  const { breadcrumbItems } = useBreadcrumb({
    currentScreen: 'projectDetail',
    projectId: projectId || '',
    projectName,
    onGoBack,
    navigationStack,
    onNavigateToScreen,
  });

  const handleTabChange = (tab: ProjectTab) => {
    setActiveTab(tab);
  };

  // Tool actions as separate items
  const toolActions: ToolAction[] = [
    {
      id: '1',
      title: 'Quick Report',
      icon: 'bolt',
      onPress: () => console.log('Quick Report pressed'),
    },
    {
      id: '2',
      title: 'Daily Report',
      icon: 'clipboard-list',
      onPress: () => console.log('Daily Report pressed'),
    },
    {
      id: '3',
      title: 'ITP_Inspection',
      icon: 'check-circle',
      onPress: () => {
        if (onNavigateToITPInspection) {
          onNavigateToITPInspection({
            projectId: projectId || '',
            projectName,
          });
        } else {
          console.log('ITP_Inspection pressed');
        }
      },
    },
    {
      id: '4',
      title: 'Deffect list',
      icon: 'exclamation-triangle',
      onPress: () => console.log('Deffect list pressed'),
    },
    {
      id: '5',
      title: 'Schedule',
      icon: 'calendar-clock',
      onPress: () => console.log('Schedule pressed'),
    },
    {
      id: '6',
      title: 'Maintenance',
      icon: 'tools',
      onPress: () => console.log('Maintenance pressed'),
    },
  ];

  const handleAddMore = () => {
    console.log('Add more pressed');
  };

  const renderToolTab = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {toolActions.map((action) => (
          <ItemCard
            key={action.id}
            id={action.id}
            title={action.title}
            showChevron={true}
            onPress={action.onPress}
            leftContent={
              <View style={styles.actionIconContainer}>
                <FontAwesome5 name={action.icon} size={20} color={colors.text.primary} />
              </View>
            }
          />
        ))}
        
        {/* Add more button */}
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
          <Text style={styles.addMoreText}>{t('home.addMore')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.placeholderText}>Overview Content</Text>
        <Text style={styles.placeholderSubtext}>Project overview and statistics will be displayed here.</Text>
      </ScrollView>
    </View>
  );

  const renderDocTab = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.placeholderText}>Documentation</Text>
        <Text style={styles.placeholderSubtext}>Project documents and files will be displayed here.</Text>
      </ScrollView>
    </View>
  );

  const renderPhotoTab = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.placeholderText}>Photos</Text>
        <Text style={styles.placeholderSubtext}>Project photos and images will be displayed here.</Text>
      </ScrollView>
    </View>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'tool':
        return renderToolTab();
      case 'overview':
        return renderOverviewTab();
      case 'doc':
        return renderDocTab();
      case 'photo':
        return renderPhotoTab();
      default:
        return renderToolTab();
    }
  };

  return (
    <ScreenLayout
      breadcrumbItems={breadcrumbItems}
      onProfilePress={screenHandlers.handleProfilePress}
      onChatPress={screenHandlers.handleChatPress}
      onNotificationPress={screenHandlers.handleNotificationPress}
      notificationCount={1}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('tool')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'tool' && styles.activeTabText
          ]}>
            Tool
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('overview')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'overview' && styles.activeTabText
          ]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('doc')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'doc' && styles.activeTabText
          ]}>
            Doc
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('photo')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'photo' && styles.activeTabText
          ]}>
            Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderActiveTabContent()}
    </ScreenLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  breadcrumbContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabText: {
    ...typography.styles.textMedium,
    fontSize: 18,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeTabText: {
    ...typography.styles.textMedium,
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  addMoreButton: {
    alignItems: 'flex-start',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  addMoreText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  placeholderSubtext: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
  },
});
