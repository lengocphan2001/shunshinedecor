import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '../../components/common/Breadcrumb';
import { colors, typography, spacing, shadows } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { generateBreadcrumbItems } from '../../utils/breadcrumbUtils';

interface InspectionDetailProps {
  projectId: string;
  projectName?: string;
  inspectionItemId: string;
  inspectionItemTitle: string;
  onGoBack?: () => void;
  navigationStack?: string[];
  onNavigateToScreen?: (screenType: any, screenParams?: any) => void;
}

interface InspectionDetailItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'error' | 'warning';
  thumbnailImage: any;
  imageCount: number;
}

export default function InspectionDetailScreen({ 
  projectId, 
  projectName = 'EPS_HMC',
  inspectionItemId,
  inspectionItemTitle,
  onGoBack,
  navigationStack,
  onNavigateToScreen
}: InspectionDetailProps) {
  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  // Generate breadcrumb items dynamically
  const breadcrumbItems = generateBreadcrumbItems(
    'inspectionDetail',
    navigationStack as any[] || [],
    { projectName, inspectionItemTitle },
    onGoBack,
    onNavigateToScreen
  );

  // Inspection detail items based on the image
  const inspectionDetailItems: InspectionDetailItem[] = [
    {
      id: '1',
      title: 'Độ thẳng đứng',
      description: 'Dùng laze kết hợp thước vuông ke sa số +-3mm',
      status: 'completed',
      thumbnailImage: require('../../../assets/background.jpg'),
      imageCount: 3,
    },
    {
      id: '2',
      title: 'Độ thẳng đứng',
      description: 'Dùng laze kết hợp thước vuông ke sa số +-3mm',
      status: 'error',
      thumbnailImage: require('../../../assets/background.jpg'),
      imageCount: 3,
    },
    {
      id: '3',
      title: 'Độ thẳng đứng',
      description: 'Dùng laze kết hợp thước vuông ke sa số +-3mm',
      status: 'completed',
      thumbnailImage: require('../../../assets/background.jpg'),
      imageCount: 3,
    },
  ];

  const handleAddMore = () => {
    console.log('Add more pressed');
  };

  const handleInspectionDetailItemPress = (item: InspectionDetailItem) => {
    console.log('Inspection detail item pressed:', item.title);
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

      {/* Content */}
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {inspectionDetailItems.map((item) => {
            const statusIcon = getStatusIcon(item.status);
            
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.inspectionDetailItem}
                onPress={() => handleInspectionDetailItemPress(item)}
                activeOpacity={0.7}
              >
                {/* Status Badge */}
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: statusIcon.color }]}>
                    <FontAwesome5 name={statusIcon.name} size={16} color={colors.text.white} />
                  </View>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>

                {/* Thumbnail */}
                <View style={styles.thumbnailContainer}>
                  <Image 
                    source={item.thumbnailImage} 
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageCountOverlay}>
                    <Text style={styles.imageCountText}>+{item.imageCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          
          {/* Add more button */}
          <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
            <Text style={styles.addMoreText}>+ Add more</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  breadcrumbContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
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
  inspectionDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
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
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnailImage: {
    width: 48,
    height: 48,
    borderRadius: spacing.borderRadius.small,
  },
  imageCountOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  imageCountText: {
    ...typography.styles.textSmall,
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 10,
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
