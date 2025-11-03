import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, shadows, useTheme } from '../../theme';

import { TabType } from '../../types/common';

interface BottomMenuProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

interface TabConfig {
  id: TabType;
  labelKey: string;
  icon: string;
  activeIcon: string;
}

const tabsConfig: TabConfig[] = [
  {
    id: 'home',
    labelKey: 'navigation.home',
    icon: 'chart-bar',
    activeIcon: 'chart-bar',
  },
  {
    id: 'chat',
    labelKey: 'navigation.chat',
    icon: 'comment',
    activeIcon: 'comment',
  },
  {
    id: 'approval',
    labelKey: 'navigation.approval',
    icon: 'check-circle',
    activeIcon: 'check-circle',
  },
  {
    id: 'todo',
    labelKey: 'navigation.todo',
    icon: 'clipboard-list',
    activeIcon: 'clipboard-list',
  },
  {
    id: 'more',
    labelKey: 'navigation.more',
    icon: 'ellipsis-h',
    activeIcon: 'ellipsis-h',
  },
];

export default function BottomMenu({ activeTab, onTabPress }: BottomMenuProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {tabsConfig.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <FontAwesome5
                name={isActive ? tab.activeIcon : tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.text.secondary}
                solid={isActive}
              />
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
              ]}>
                {t(tab.labelKey)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.xs,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
    borderRadius: spacing.borderRadius.large,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    ...typography.styles.textSmall,
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontWeight: '400',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
