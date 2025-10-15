import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import ProjectItem from '../../components/cards/ProjectItem';
import ActivityItem from '../../components/cards/ActivityItem';
import { colors, typography, spacing } from '../../theme';
import { ProjectItemData } from '../../types/project';
import { ActivityItemData } from '../../types/activity';
import { ProjectDetailParams } from '../../types/navigation';
import { MOCK_PROJECTS, MOCK_ACTIVITIES } from '../../constants/mockData';

// Using imported constants instead of local definitions

interface HomeScreenProps {
  onNavigateToProjectDetail?: (params: ProjectDetailParams) => void;
}

export default function HomeScreen({ onNavigateToProjectDetail }: HomeScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'projectList' | 'activityLog'>('projectList');

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleTabChange = (tab: 'projectList' | 'activityLog') => {
    setActiveTab(tab);
  };

  const handleProjectPress = (project: ProjectItemData) => {
    console.log('Project pressed:', project.name);
    if (onNavigateToProjectDetail) {
      onNavigateToProjectDetail({
        projectId: project.id,
        projectName: project.name,
      });
    }
  };

  const handleAddMore = () => {
    console.log('Add more pressed');
  };

  const handleActivityPress = (activity: ActivityItemData) => {
    console.log('Activity pressed:', activity.title);
  };

  const renderProjectList = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_PROJECTS.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onPress={() => handleProjectPress(project)}
          />
        ))}
        
        {/* Add more button */}
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
          <Text style={styles.addMoreText}>{t('home.addMore')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderActivityLog = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ACTIVITIES.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onPress={() => handleActivityPress(activity)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <MainLayout
      onProfilePress={handleProfilePress}
      onChatPress={handleChatPress}
      onNotificationPress={handleNotificationPress}
      notificationCount={1}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('projectList')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'projectList' && styles.activeTabText
          ]}>
            {t('home.projectList')}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('activityLog')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'activityLog' && styles.activeTabText
          ]}>
            {t('home.activityLog')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'projectList' ? renderProjectList() : renderActivityLog()}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    // backgroundColor: colors.background,
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
  addMoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
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
