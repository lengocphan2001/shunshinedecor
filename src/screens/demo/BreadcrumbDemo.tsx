import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumb, { BreadcrumbItem } from '../../components/common/Breadcrumb';
import { colors, typography, spacing, shadows } from '../../theme';

export default function BreadcrumbDemo() {
  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  // Example 1: Basic breadcrumb
  const basicBreadcrumb: BreadcrumbItem[] = [
    { id: '1', label: 'Home', onPress: () => console.log('Navigate to Home') },
    { id: '2', label: 'Projects', onPress: () => console.log('Navigate to Projects') },
    { id: '3', label: 'Current Project' },
  ];

  // Example 2: Long breadcrumb path
  const longBreadcrumb: BreadcrumbItem[] = [
    { id: '1', label: 'Home', onPress: () => console.log('Navigate to Home') },
    { id: '2', label: 'Dashboard', onPress: () => console.log('Navigate to Dashboard') },
    { id: '3', label: 'Projects', onPress: () => console.log('Navigate to Projects') },
    { id: '4', label: 'Design', onPress: () => console.log('Navigate to Design') },
    { id: '5', label: 'UI Components', onPress: () => console.log('Navigate to UI Components') },
    { id: '6', label: 'Breadcrumb' },
  ];

  // Example 3: With max items (showing ellipsis)
  const maxItemsBreadcrumb: BreadcrumbItem[] = [
    { id: '1', label: 'Home', onPress: () => console.log('Navigate to Home') },
    { id: '2', label: 'Level 1', onPress: () => console.log('Navigate to Level 1') },
    { id: '3', label: 'Level 2', onPress: () => console.log('Navigate to Level 2') },
    { id: '4', label: 'Level 3', onPress: () => console.log('Navigate to Level 3') },
    { id: '5', label: 'Level 4', onPress: () => console.log('Navigate to Level 4') },
    { id: '6', label: 'Current Page' },
  ];

  // Example 4: Different separators
  const slashBreadcrumb: BreadcrumbItem[] = [
    { id: '1', label: 'Home', onPress: () => console.log('Navigate to Home') },
    { id: '2', label: 'Settings', onPress: () => console.log('Navigate to Settings') },
    { id: '3', label: 'Account' },
  ];

  const dotBreadcrumb: BreadcrumbItem[] = [
    { id: '1', label: 'Dashboard', onPress: () => console.log('Navigate to Dashboard') },
    { id: '2', label: 'Analytics', onPress: () => console.log('Navigate to Analytics') },
    { id: '3', label: 'Reports' },
  ];

  return (
    <MainLayout
      onProfilePress={handleProfilePress}
      onChatPress={handleChatPress}
      onNotificationPress={handleNotificationPress}
      notificationCount={1}
    >
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Breadcrumb Component Examples</Text>

          {/* Example 1: Basic */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Basic Breadcrumb (Chevron)</Text>
            <Breadcrumb items={basicBreadcrumb} />
          </View>

          {/* Example 2: Long Path */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Long Path (Scrollable)</Text>
            <Breadcrumb items={longBreadcrumb} />
          </View>

          {/* Example 3: With Max Items */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>With Max Items (3 items + ellipsis)</Text>
            <Breadcrumb items={maxItemsBreadcrumb} maxItems={4} />
          </View>

          {/* Example 4: Slash Separator */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Slash Separator</Text>
            <Breadcrumb items={slashBreadcrumb} separator="slash" />
          </View>

          {/* Example 5: Dot Separator */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Dot Separator</Text>
            <Breadcrumb items={dotBreadcrumb} separator="dot" />
          </View>

          {/* Usage Guide */}
          <View style={styles.usageCard}>
            <Text style={styles.usageTitle}>Usage Guide</Text>
            <Text style={styles.usageText}>
              <Text style={styles.bold}>Import:</Text>{'\n'}
              import Breadcrumb from '../../components/common/Breadcrumb';{'\n\n'}
              
              <Text style={styles.bold}>Props:</Text>{'\n'}
              • items: BreadcrumbItem[] (required){'\n'}
              • separator: 'chevron' | 'slash' | 'dot' (default: 'chevron'){'\n'}
              • maxItems: number (optional, shows ellipsis when exceeded){'\n\n'}
              
              <Text style={styles.bold}>BreadcrumbItem:</Text>{'\n'}
              • id: string (unique identifier){'\n'}
              • label: string (display text){'\n'}
              • onPress?: () =&gt; void (navigation handler){'\n\n'}
              
              <Text style={styles.bold}>Notes:</Text>{'\n'}
              • Last item is always active (bold, no click){'\n'}
              • Items without onPress are disabled{'\n'}
              • Long paths are horizontally scrollable{'\n'}
              • maxItems creates ellipsis after first item
            </Text>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    ...typography.styles.displayMedium,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  exampleCard: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    
  },
  exampleTitle: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  usageCard: {
    backgroundColor: colors.login.inputBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  usageTitle: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  usageText: {
    ...typography.styles.textMedium,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

