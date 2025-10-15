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
import Breadcrumb, { BreadcrumbItem } from '../../components/common/Breadcrumb';
import { typography, spacing, shadows, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { generateBreadcrumbItems } from '../../utils/breadcrumbUtils';

interface ITPInspectionProps {
  projectId: string;
  projectName?: string;
  onGoBack?: () => void;
  navigationStack?: string[];
  onNavigateToInspectionDetail?: (params: { 
    projectId: string; 
    projectName?: string; 
    inspectionItemId: string; 
    inspectionItemTitle: string; 
  }) => void;
  onNavigateToScreen?: (screenType: any, screenParams?: any) => void;
}

type InspectionTab = 'fitout' | 'me' | 'adv' | 'fur' | 'structure';

interface InspectionItem {
  id: string;
  title: string;
  completed: number;
  total: number;
  status: 'completed' | 'error' | 'warning';
}

export default function ITPInspectionScreen({ 
  projectId, 
  projectName = 'EPS_HMC',
  onGoBack,
  navigationStack,
  onNavigateToInspectionDetail,
  onNavigateToScreen
}: ITPInspectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<InspectionTab>('fitout');
  
  const styles = createStyles(colors);

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleTabChange = (tab: InspectionTab) => {
    setActiveTab(tab);
  };

  // Generate breadcrumb items dynamically
  const breadcrumbItems = generateBreadcrumbItems(
    'itpInspection',
    navigationStack as any[] || [],
    { projectName },
    onGoBack,
    onNavigateToScreen
  );

  // Inspection items based on the image
  const inspectionItems: InspectionItem[] = [
    {
      id: '1',
      title: 'Tường xây',
      completed: 8,
      total: 8,
      status: 'completed',
    },
    {
      id: '2',
      title: 'Trát tường',
      completed: 1,
      total: 4,
      status: 'completed',
    },
    {
      id: '3',
      title: 'Ốp lát',
      completed: 6,
      total: 8,
      status: 'error',
    },
    {
      id: '4',
      title: 'Chống thấm',
      completed: 8,
      total: 8,
      status: 'completed',
    },
    {
      id: '5',
      title: 'Nâng nền',
      completed: 1,
      total: 4,
      status: 'completed',
    },
  ];

  const handleAddMore = () => {
    console.log('Add more pressed');
  };

  const handleInspectionItemPress = (item: InspectionItem) => {
    console.log('Inspection item pressed:', item.title);
    if (onNavigateToInspectionDetail) {
      onNavigateToInspectionDetail({
        projectId,
        projectName,
        inspectionItemId: item.id,
        inspectionItemTitle: item.title,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return { name: 'check', color: colors.status.onSchedule };
      case 'error':
        return { name: 'times', color: colors.status.late };
      case 'warning':
        return { name: 'exclamation-triangle', color: colors.status.warning };
      default:
        return { name: 'info-circle', color: colors.neutral };
    }
  };

  const renderInspectionItems = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {inspectionItems.map((item) => {
          const statusIcon = getStatusIcon(item.status);
          
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.inspectionItem}
              onPress={() => handleInspectionItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: statusIcon.color }]}>
                  <FontAwesome5 name={statusIcon.name} size={16} color={colors.text.white} />
                </View>
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={[
                  styles.itemTitle,
                  item.status === 'error' && styles.errorItemTitle
                ]}>
                  {item.title}
                </Text>
              </View>
              
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {item.completed}|{item.total}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        
        {/* Add more button */}
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
          <Text style={styles.addMoreText}>{t('home.addMore')}</Text>
        </TouchableOpacity>
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
      {/* Breadcrumb */}
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('fitout')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'fitout' && styles.activeTabText
          ]}>
            Fitout
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('me')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'me' && styles.activeTabText
          ]}>
            M&E
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('adv')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'adv' && styles.activeTabText
          ]}>
            Adv
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('fur')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'fur' && styles.activeTabText
          ]}>
            Fur
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('structure')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'structure' && styles.activeTabText
          ]}>
            Structure
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addTabButton}>
          <FontAwesome5 name="plus" size={16} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderInspectionItems()}
    </MainLayout>
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
  addTabButton: {
    marginLeft: spacing.md,
    padding: spacing.xs,
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
  inspectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  errorItemTitle: {
    color: colors.status.late,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
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
});
