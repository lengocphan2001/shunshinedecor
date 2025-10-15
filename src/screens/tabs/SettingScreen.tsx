import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { colors, typography, spacing, shadows } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LanguageSwitcher, useLanguage } from '../../i18n';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'info';
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function SettingScreen() {
  const { t } = useTranslation();
  const { getCurrentLanguageInfo } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleLanguagePress = () => {
    setLanguageModalVisible(true);
  };

  const currentLanguageInfo = getCurrentLanguageInfo();

  const settingItems: SettingItem[] = [
    {
      id: 'account',
      title: t('settings.personalInfo'),
      description: t('profile.personalInfo'),
      icon: 'user',
      type: 'navigation',
      onPress: () => console.log('Account Settings'),
    },
    {
      id: 'notifications',
      title: t('settings.pushNotifications'),
      description: t('settings.notifications'),
      icon: 'bell',
      type: 'toggle',
      value: notifications,
      onValueChange: setNotifications,
    },
    {
      id: 'privacy',
      title: t('settings.privacy'),
      description: t('settings.privacy'),
      icon: 'shield-alt',
      type: 'navigation',
      onPress: () => console.log('Privacy'),
    },
    {
      id: 'security',
      title: t('common.edit'),
      description: t('auth.password'),
      icon: 'lock',
      type: 'navigation',
      onPress: () => console.log('Security'),
    },
    {
      id: 'darkmode',
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      icon: 'moon',
      type: 'toggle',
      value: darkMode,
      onValueChange: setDarkMode,
    },
    {
      id: 'sync',
      title: 'Auto Sync',
      description: 'Automatically sync data',
      icon: 'sync',
      type: 'toggle',
      value: autoSync,
      onValueChange: setAutoSync,
    },
    {
      id: 'language',
      title: t('settings.language'),
      description: currentLanguageInfo?.nativeName || 'English',
      icon: 'language',
      type: 'navigation',
      onPress: handleLanguagePress,
    },
    {
      id: 'about',
      title: t('settings.about'),
      description: `${t('settings.version')} 1.0.0`,
      icon: 'info-circle',
      type: 'info',
      onPress: () => console.log('About'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.type === 'navigation' || item.type === 'info' ? item.onPress : undefined}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <View style={styles.settingIconContainer}>
            <FontAwesome5 name={item.icon} size={20} color={colors.text.primary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.settingDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.divider, true: colors.primary }}
              thumbColor={colors.background}
            />
          ) : (
            <FontAwesome5 name="chevron-right" size={16} color={colors.text.secondary} />
          )}
        </View>
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
          {settingItems.map(renderSettingItem)}
        </ScrollView>
      </View>

      {/* Language Switcher Modal */}
      {languageModalVisible && (
        <LanguageSwitcher 
          variant="button" 
          onLanguageChange={() => setLanguageModalVisible(false)}
        />
      )}
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
  settingItem: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.login.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  settingDescription: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.secondary,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
