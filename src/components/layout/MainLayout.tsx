import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Header from '../common/Header';
import { colors } from '../../theme';

interface MainLayoutProps {
  children: React.ReactNode;
  onProfilePress?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function MainLayout({
  children,
  onProfilePress,
  onChatPress,
  onNotificationPress,
  notificationCount = 1
}: MainLayoutProps) {
  return (
    <View style={styles.container}>
      <Header
        onProfilePress={onProfilePress}
        onChatPress={onChatPress}
        onNotificationPress={onNotificationPress}
        notificationCount={notificationCount}
      />
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.login.background,
  },
  content: {
    flex: 1,
  },
});
