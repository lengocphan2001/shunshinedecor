import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage, Language, LanguageOption } from './useLanguage';
import { typography, spacing, useTheme } from '../theme';

interface LanguageSwitcherProps {
  variant?: 'button' | 'modal';
  onLanguageChange?: (language: Language) => void;
}

/**
 * Language Switcher Component
 * 
 * Can be used in two ways:
 * 1. As a button that opens a modal to select language
 * 2. As a standalone component showing language options
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'button',
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  
  const styles = createStyles(colors);

  const handleLanguageSelect = async (language: Language) => {
    await changeLanguage(language);
    setModalVisible(false);
    onLanguageChange?.(language);
  };

  const renderLanguageOption = ({ item }: { item: LanguageOption }) => {
    const isSelected = item.code === currentLanguage;

    return (
      <TouchableOpacity
        style={[styles.languageOption, isSelected && styles.selectedOption]}
        onPress={() => handleLanguageSelect(item.code)}
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
  };

  if (variant === 'button') {
    const currentLangInfo = languages.find(lang => lang.code === currentLanguage);

    return (
      <>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {currentLanguage.toUpperCase()}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {t('settings.selectLanguage')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={languages}
                  renderItem={renderLanguageOption}
                  keyExtractor={(item) => item.code}
                  style={styles.languageList}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </>
    );
  }

  // Inline variant
  return (
    <View style={styles.inlineContainer}>
      <FlatList
        data={languages}
        renderItem={renderLanguageOption}
        keyExtractor={(item) => item.code}
      />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  // Button variant styles
  languageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    minWidth: 50,
  },
  buttonText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
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
    maxHeight: '50%',
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
    fontSize: 18,
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

  // Language option styles
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
    backgroundColor: colors.primary + '15', // 15 is alpha transparency
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

  // Inline variant styles
  inlineContainer: {
    flex: 1,
  },
});

export default LanguageSwitcher;

