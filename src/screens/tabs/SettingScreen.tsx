import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { typography, spacing, shadows, useTheme } from '../../theme';
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
  const { currentLanguage, changeLanguage, languages, getCurrentLanguageInfo } = useLanguage();
  const { isDark, toggleTheme, colors, backgroundKey, setBackgroundKey } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);

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

  const backgroundLabel = useMemo(() => {
    switch (backgroundKey) {
      case 'background1':
        return 'Background 1';
      case 'background2':
        return 'Background 2';
      case 'background3':
      default:
        return 'Background 3';
    }
  }, [backgroundKey]);

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
      id: 'background',
      title: 'Background',
      description: backgroundLabel,
      icon: 'image',
      type: 'navigation',
      onPress: () => setBackgroundModalVisible(true),
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
      value: isDark,
      onValueChange: toggleTheme,
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

  const styles = createStyles(colors);

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

      {/* Language Bottom Sheet Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
                <TouchableOpacity
                  onPress={() => setLanguageModalVisible(false)}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                style={styles.languageList}
                renderItem={({ item }) => {
                  const isSelected = item.code === currentLanguage;
                  return (
                    <TouchableOpacity
                      style={[styles.languageOption, isSelected && styles.selectedOption]}
                      onPress={async () => {
                        await changeLanguage(item.code);
                        setLanguageModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.languageInfo}>
                        <Text style={[styles.languageName, isSelected && styles.selectedText]}>
                          {item.nativeName}
                        </Text>
                        <Text style={[styles.languageCode, isSelected && styles.selectedSubtext]}>
                          {item.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Background Picker Modal */}
      <Modal
        visible={backgroundModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBackgroundModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Background</Text>
                <TouchableOpacity
                  onPress={() => setBackgroundModalVisible(false)}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalGrid}>
                {(['background1', 'background2', 'background3'] as const).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.modalItem,
                      backgroundKey === key && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setBackgroundKey(key);
                      setBackgroundModalVisible(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={
                        key === 'background1'
                          ? require('../../../assets/backgrounds/background1.jpg')
                          : key === 'background2'
                            ? require('../../../assets/backgrounds/background2.jpg')
                            : require('../../../assets/backgrounds/background3.jpg')
                      }
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.modalLabel}>
                      {key === 'background1' ? 'Background 1' : key === 'background2' ? 'Background 2' : 'Background 3'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    ...typography.styles.displayMedium,
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.secondary,
  },
  modalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  modalItem: {
    flex: 1,
    marginRight: spacing.md,
    borderRadius: spacing.borderRadius.medium,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalItemActive: {
    borderColor: colors.primary,
  },
  modalImage: {
    width: '100%',
    height: 120,
  },
  modalLabel: {
    ...typography.styles.textMedium,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    color: colors.text.secondary,
    backgroundColor: colors.cardBackground,
  },
  settingItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    
  },
  // Language list styles (match LanguageSwitcher)
  languageList: {
    paddingHorizontal: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  selectedOption: {
    backgroundColor: colors.primary + '15',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  languageCode: {
    ...typography.styles.textMedium,
    fontSize: 13,
    color: colors.text.secondary,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedSubtext: {
    color: colors.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
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
    backgroundColor: colors.background,
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
