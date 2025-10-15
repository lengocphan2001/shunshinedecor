import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { typography, spacing, shadows, useTheme } from '../../theme';
import { ProjectItemData } from '../../types/project';

interface ProjectItemProps {
  project: ProjectItemData;
  onPress?: () => void;
}

export default function ProjectItem({ project, onPress }: ProjectItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onSchedule':
        return colors.status.onSchedule;
      case 'late':
        return colors.status.late;
      case 'warning':
        return colors.status.warning;
      default:
        return colors.neutral;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Left side - Project Info */}
      <View style={styles.leftSection}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.dateRange}>{project.dateRange}</Text>
      </View>

      {/* Middle - Count */}
      <View style={styles.middleSection}>
        <Text style={styles.count}>{project.count}</Text>
      </View>

      {/* Right side - Status Badge */}
      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={styles.statusText}>{project.statusText}</Text>
        </View>
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
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  projectName: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dateRange: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  middleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  count: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.small,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    ...typography.styles.textSmall,
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.white,
  },
});
