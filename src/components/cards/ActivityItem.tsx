import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, shadows, useTheme } from '../../theme';
import { ActivityItemData } from '../../types/activity';

interface ActivityItemProps {
  activity: ActivityItemData;
  onPress?: () => void;
}

export default function ActivityItem({ activity, onPress }: ActivityItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return { name: 'check' as const, color: colors.status.onSchedule };
      case 'error':
        return { name: 'times' as const, color: colors.status.late };
      case 'warning':
        return { name: 'exclamation-triangle' as const, color: colors.status.warning };
      default:
        return { name: 'info-circle' as const, color: colors.neutral };
    }
  };

  const statusIcon = getStatusIcon(activity.status);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Left side - Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusIcon.color }]}>
          <FontAwesome5 name={statusIcon.name} size={16} color={colors.text.white} />
        </View>
      </View>

      {/* Middle - Text Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{activity.title}</Text>
        <Text style={styles.descriptionText}>{activity.description}</Text>
      </View>

      {/* Right side - Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image 
          source={activity.thumbnailImage} 
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 80, // Ensure consistent height
    
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  thumbnailContainer: {
    marginLeft: spacing.md,
  },
  thumbnailImage: {
    width: 48,
    height: 48,
    borderRadius: spacing.borderRadius.small,
  },
});
