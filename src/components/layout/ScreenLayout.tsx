import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainLayout from './MainLayout';
import Breadcrumb from '../common/Breadcrumb';
import { colors, spacing } from '../../theme';
import { BreadcrumbItem } from '../common/Breadcrumb';

interface ScreenLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  onProfilePress?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function ScreenLayout({
  children,
  breadcrumbItems,
  onProfilePress,
  onChatPress,
  onNotificationPress,
  notificationCount = 1,
}: ScreenLayoutProps) {
  return (
    <MainLayout
      onProfilePress={onProfilePress}
      onChatPress={onChatPress}
      onNotificationPress={onNotificationPress}
      notificationCount={notificationCount}
    >
      {breadcrumbItems && (
        <View style={styles.breadcrumbContainer}>
          <Breadcrumb items={breadcrumbItems} />
        </View>
      )}
      {children}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  breadcrumbContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
});
