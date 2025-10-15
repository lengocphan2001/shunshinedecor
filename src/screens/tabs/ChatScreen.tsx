import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MainLayout from '../../components/layout/MainLayout';
import { colors, typography, spacing, shadows } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ChatItem } from '../../types/chat';
import { ContactItem } from '../../types/contact';
import { MOCK_CHATS, MOCK_CONTACTS, DEPARTMENTS } from '../../constants/mockData';

// Using imported constants instead of local definitions

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState<'chat' | 'contact'>('chat');

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleChatItemPress = (chat: ChatItem) => {
    console.log('Chat item pressed:', chat.name);
  };

  const handleContactPress = (contact: ContactItem) => {
    console.log('Contact pressed:', contact.displayName);
  };

  const handleTabChange = (tab: 'chat' | 'contact') => {
    setActiveTab(tab);
  };

  const renderChatItem = (chat: ChatItem) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => handleChatItemPress(chat)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {chat.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {(chat.unreadCount ?? 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContactItem = (contact: ContactItem) => (
    <TouchableOpacity
      key={contact.id}
      style={styles.contactItem}
      onPress={() => handleContactPress(contact)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>{contact.name}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactDisplayName}>{contact.displayName}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        <Text style={styles.contactEmail}>{contact.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContactsByDepartment = () => {
    return DEPARTMENTS.map((dept) => {
      const departmentContacts = MOCK_CONTACTS.filter(contact => contact.department === dept);
      
      return (
        <View key={dept} style={styles.departmentSection}>
          <Text style={styles.departmentTitle}>{dept}</Text>
          {departmentContacts.map(renderContactItem)}
        </View>
      );
    });
  };

  const renderChatList = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_CHATS.map(renderChatItem)}
      </ScrollView>
    </View>
  );

  const renderContactList = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContactsByDepartment()}
      </ScrollView>
    </View>
  );

  return (
    <MainLayout
      onProfilePress={handleProfilePress}
      onChatPress={handleChatPress}
      onNotificationPress={handleNotificationPress}
      notificationCount={1}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('chat')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'chat' && styles.activeTabText
          ]}>
            Chat
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('contact')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'contact' && styles.activeTabText
          ]}>
            Contact
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chat' ? renderChatList() : renderContactList()}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    // backgroundColor: colors.background,
  },
  tab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabText: {
    ...typography.styles.textMedium,
    fontSize: 18,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeTabText: {
    ...typography.styles.textMedium,
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  contentContainer: {
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.styles.displayMedium,
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status.onSchedule,
    borderWidth: 2,
    borderColor: colors.background,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  chatTime: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    ...typography.styles.textSmall,
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  // Contact styles
  departmentSection: {
    marginBottom: spacing.xl,
  },
  departmentTitle: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactAvatarText: {
    ...typography.styles.displayMedium,
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactDisplayName: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  contactPhone: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  contactEmail: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
  },
});
