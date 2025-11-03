import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { typography, spacing, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../../contexts/AuthContext';

interface MoreMenuItem {
  id: string;
  labelKey: string;
  icon: string;
  hasSeparator?: boolean;
}

interface MoreScreenProps {
  onNavigateToSetting?: () => void;
}

export default function MoreScreen({ onNavigateToSetting }: MoreScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<MoreMenuItem | null>(null);
  
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

  const handleMenuPress = (item: MoreMenuItem, event: any) => {
    setSelectedItem(item);
    
    // Get the position of the pressed item
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setDropdownPosition({
        x: pageX + width / 2 - 100, // Center the dropdown
        y: pageY + height + 10, // Position below the item
      });
      setShowDropdown(true);
    });
  };

  const handleMenuItemPress = (item: MoreMenuItem) => {
    if (item.id === 'setting') {
      onNavigateToSetting && onNavigateToSetting();
    } else if (item.id === 'logout') {
      logout();
    } else {
      console.log('Menu item pressed:', item.id);
    }
    setShowDropdown(false);
    setSelectedItem(null);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setSelectedItem(null);
  };

  const menuItems: MoreMenuItem[] = [
    {
      id: 'form',
      labelKey: 'more.form',
      icon: 'file-alt',
    },
    {
      id: 'drawing',
      labelKey: 'more.drawing',
      icon: 'triangle',
    },
    {
      id: 'photo',
      labelKey: 'more.photo',
      icon: 'image',
      hasSeparator: true,
    },
    {
      id: 'training',
      labelKey: 'more.training',
      icon: 'graduation-cap',
    },
    {
      id: 'exam',
      labelKey: 'more.exam',
      icon: 'file-alt',
      hasSeparator: true,
    },
    {
      id: 'setting',
      labelKey: 'more.setting',
      icon: 'cog',
    },
    {
      id: 'logout',
      labelKey: 'more.logout',
      icon: 'sign-out-alt',
      hasSeparator: true,
    },
  ];

  const renderMenuItem = (item: MoreMenuItem) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={(event) => handleMenuPress(item, event)}
      >
        <View style={styles.menuIconContainer}>
          <FontAwesome5 
            name={item.icon} 
            size={20} 
            color={colors.primary} 
          />
        </View>
        <Text style={styles.menuItemText}>{t(item.labelKey)}</Text>
      </TouchableOpacity>
      {item.hasSeparator && <View style={styles.separator} />}
    </View>
  );

  const renderDropdown = () => (
    <Modal
      visible={showDropdown}
      transparent
      animationType="fade"
      onRequestClose={handleCloseDropdown}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={handleCloseDropdown}
      >
        <View 
          style={[
            styles.dropdown,
            {
              left: dropdownPosition.x,
              top: dropdownPosition.y,
            }
          ]}
        >
          <View style={styles.dropdownArrow} />
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => handleMenuItemPress(selectedItem!)}
          >
            <Text style={styles.dropdownItemText}>
              {selectedItem ? t(selectedItem.labelKey) : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <MainLayout
      onProfilePress={handleProfilePress}
      onChatPress={handleChatPress}
      onNotificationPress={handleNotificationPress}
      notificationCount={1}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{t('more.title')}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </View>

      {renderDropdown()}
    </MainLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  headerContainer: {
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.styles.displayMedium,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  menuContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingVertical: spacing.sm,
    minWidth: 200,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  dropdownArrow: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.cardBackground,
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dropdownItemText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
