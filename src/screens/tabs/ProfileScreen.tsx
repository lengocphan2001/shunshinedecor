import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { typography, spacing, shadows, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface ProfileOption {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
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

  const profileOptions: ProfileOption[] = [
    {
      id: 'edit',
      title: t('profile.editProfile'),
      icon: 'user',
      onPress: () => console.log('Edit Profile'),
    },
    {
      id: 'projects',
      title: t('project.title'),
      icon: 'folder',
      onPress: () => console.log('My Projects'),
    },
    {
      id: 'notifications',
      title: t('settings.notifications'),
      icon: 'bell',
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'privacy',
      title: t('settings.privacy'),
      icon: 'shield-alt',
      onPress: () => console.log('Privacy & Security'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'question-circle',
      onPress: () => console.log('Help & Support'),
    },
    {
      id: 'logout',
      title: t('settings.logout'),
      icon: 'sign-out-alt',
      onPress: () => console.log('Logout'),
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <TouchableOpacity style={styles.editAvatarButton}>
          <FontAwesome5 name="camera" size={16} color={colors.text.white} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.userName}>John Doe</Text>
      <Text style={styles.userEmail}>john.doe@example.com</Text>
      
      <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileText}>{t('profile.editProfile')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.onPress}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionLeft}>
          <View style={styles.optionIconContainer}>
            <FontAwesome5 name={option.icon} size={20} color={colors.text.primary} />
          </View>
          <Text style={styles.optionTitle}>{option.title}</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={16} color={colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );

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
          {renderProfileHeader()}
          
          <View style={styles.optionsContainer}>
            {profileOptions.map(renderProfileOption)}
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.styles.displayMedium,
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 24,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  userName: {
    ...typography.styles.displayMedium,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  editProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.small,
  },
  editProfileText: {
    ...typography.styles.textMedium,
    color: colors.text.white,
    fontWeight: '500',
  },
  optionsContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    
  },
  optionItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionTitle: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '400',
  },
});
