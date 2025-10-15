import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors, typography, spacing, shadows } from '../../theme';
const { width } = Dimensions.get('window');

interface HeaderProps {
  onProfilePress?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function Header({ 
  onProfilePress, 
  onChatPress, 
  onNotificationPress,
  notificationCount = 1
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Left side - SSD Logo */}
        <View style={styles.leftSection}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Right side - Icons */}
        <View style={styles.rightSection}>
          {/* Profile Icon */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onProfilePress}
          >
            <FontAwesome5 name="user-circle" size={20} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Chat Icon */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onChatPress}
          >
            <FontAwesome5 name="comment" size={20} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Notification Icon with Badge */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <View style={styles.notificationContainer}>
              <FontAwesome5 name="bell" size={20} color={colors.text.secondary} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? '9+' : notificationCount.toString()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    // 
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    minHeight: 70,
  },
  underline: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...typography.styles.textSmall,
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
});
