import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors, typography, spacing, shadows } from '../../theme';
import StatusIcon from './StatusIcon';

interface ItemCardProps {
  id: string;
  title: string;
  description?: string;
  status?: 'completed' | 'error' | 'warning' | 'info';
  thumbnailImage?: any;
  imageCount?: number;
  progressText?: string;
  showChevron?: boolean;
  onPress?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function ItemCard({
  id,
  title,
  description,
  status,
  thumbnailImage,
  imageCount,
  progressText,
  showChevron = false,
  onPress,
  leftContent,
  rightContent,
}: ItemCardProps) {
  const renderLeftContent = () => {
    if (leftContent) return leftContent;
    
    if (status) {
      return (
        <View style={styles.statusContainer}>
          <StatusIcon status={status} />
        </View>
      );
    }
    
    return null;
  };

  const renderRightContent = () => {
    if (rightContent) return rightContent;
    
    if (thumbnailImage) {
      return (
        <View style={styles.thumbnailContainer}>
          <Image 
            source={thumbnailImage} 
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          {imageCount && imageCount > 0 && (
            <View style={styles.imageCountOverlay}>
              <Text style={styles.imageCountText}>+{imageCount}</Text>
            </View>
          )}
        </View>
      );
    }
    
    if (progressText) {
      return (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progressText}</Text>
        </View>
      );
    }
    
    if (showChevron) {
      return (
        <FontAwesome5 name="chevron-right" size={16} color={colors.text.secondary} />
      );
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {renderLeftContent()}
      
      <View style={styles.contentSection}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      
      {renderRightContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  title: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
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
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
});
