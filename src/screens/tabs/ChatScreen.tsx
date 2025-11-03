import React, { useEffect, useState } from 'react';
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
import { ChatItem } from '../../types/chat';
import { ContactItem } from '../../types/contact';
import { listChatsApi } from '../../api/chat';
import { listProjectsApi } from '../../api/projects';
import { useAuth } from '../../contexts/AuthContext';
import AddContactModal from '../../components/modals/AddContactModal';

// Using imported constants instead of local definitions

interface ChatScreenProps {
  onNavigateToChatDetail?: (params: { chatId: string; chatName: string; unreadCount?: number }) => void;
}

export default function ChatScreen({ onNavigateToChatDetail }: ChatScreenProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'contact'>('chat');
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [projectContacts, setProjectContacts] = useState<Record<string, { projectName: string; contacts: ContactItem[] }>>({});
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  
  const styles = createStyles(colors, isDark);

  // Debug logging
  console.log('ChatScreen - isAdmin:', isAdmin);
  console.log('ChatScreen - user:', user);
  console.log('ChatScreen - projectContacts:', projectContacts);

  useEffect(() => {
    (async () => {

      try {
        // Load chats (server filters by role/membership)
        const chatRes = await listChatsApi();
        const mappedChats: ChatItem[] = (chatRes?.chats || []).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          lastMessage: c?.lastMessage?.content || '',
          time: c?.lastMessage?.timestamp ? new Date(c.lastMessage.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
          unreadCount: c?.unreadCount ?? 0,
          isOnline: false,
        }));
        setChats(mappedChats);
      } catch {}

      try {
        // Load projects with contacts
        const projRes = await listProjectsApi();
        const projects: any[] = (projRes as any)?.projects || [];
        const contactMap: Record<string, { projectName: string; contacts: ContactItem[] }> = {};
        for (const p of projects) {
          const contacts = (p.contacts || []).map((ct: any, idx: number) => ({
            id: `${p._id}-${idx}`,
            name: ct.name,
            displayName: ct.displayName,
            phone: ct.phone || '',
            email: ct.email || '',
            department: p.name,
          }));
          contactMap[p._id] = { projectName: p.name, contacts };
        }
        
        // For testing purposes, add mock project if no projects exist
        if (Object.keys(contactMap).length === 0) {
          contactMap['mock-project-1'] = {
            projectName: 'PizzaHUT',
            contacts: []
          };
          contactMap['mock-project-2'] = {
            projectName: 'Pizza4P',
            contacts: []
          };
          contactMap['mock-project-3'] = {
            projectName: 'Dự án 4PS',
            contacts: []
          };
          console.log('Added mock projects for testing');
        }
        
        setProjectContacts(contactMap);
      } catch {}
    })();
  }, []);

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
    if (onNavigateToChatDetail) {
      onNavigateToChatDetail({
        chatId: chat.id,
        chatName: chat.name,
        unreadCount: chat.unreadCount,
      });
    } else {
      console.log('Chat item pressed:', chat.name);
    }
  };

  const handleContactPress = (contact: ContactItem) => {
    console.log('Contact pressed:', contact.displayName);
  };

  const handleTabChange = (tab: 'chat' | 'contact') => {
    setActiveTab(tab);
  };

  const handleAddContact = (projectId: string, projectName: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setShowAddContactModal(true);
  };

  const handleContactAdded = (newContact: ContactItem) => {
    setProjectContacts(prev => {
      const updated = { ...prev };
      if (updated[selectedProjectId]) {
        updated[selectedProjectId] = {
          ...updated[selectedProjectId],
          contacts: [...updated[selectedProjectId].contacts, newContact],
        };
      }
      return updated;
    });
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
        <Text style={styles.contactAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactDisplayName}>{contact.displayName}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        <Text style={styles.contactEmail}>{contact.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContactsByProject = () => {
    const entries = Object.entries(projectContacts);
    console.log('renderContactsByProject - entries:', entries);
    console.log('renderContactsByProject - isAdmin:', isAdmin);
    console.log('renderContactsByProject - user:', user);
    
    if (entries.length === 0) {
      console.log('No project contacts found');
      return null;
    }
    
    return entries.map(([projectId, val]) => {
      console.log(`Rendering project ${projectId}:`, val);
      return (
      <View key={projectId} style={styles.departmentSection}>
        <Text style={styles.departmentTitle}>{val.projectName}</Text>
        {val.contacts.map(renderContactItem)}
          {/* Add Contact Button - Admin only */}
          {isAdmin && (
            <TouchableOpacity style={styles.addMoreButton} onPress={() => handleAddContact(projectId, val.projectName)}>
              <Text style={styles.addMoreText}>{t('home.addMore')}</Text>
            </TouchableOpacity>
          )}
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
        {chats.map(renderChatItem)}
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
        {renderContactsByProject()}
        
        {/* Show add contact button for admin even if no projects */}
        {isAdmin && Object.keys(projectContacts).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Chưa có project nào</Text>
            <TouchableOpacity
              style={styles.addFirstContactButton}
              onPress={() => {
                // You can add logic to create first project or show message
                console.log('No projects available to add contacts');
              }}
            >
              <FontAwesome5 name="plus" size={16} color={colors.primary} />
              <Text style={styles.addFirstContactText}>Tạo Project đầu tiên</Text>
            </TouchableOpacity>
          </View>
        )}
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
            {t('chat.title')}
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

      {/* Add Contact Modal */}
      <AddContactModal
        visible={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        projectId={selectedProjectId}
        projectName={selectedProjectName}
        onContactAdded={handleContactAdded}
      />
    </MainLayout>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: spacing.borderRadius.large,
    borderWidth: 1,
    borderColor: colors.divider,
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
    backgroundColor: colors.cardBackground,
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
    borderColor: colors.cardBackground,
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
  addMoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  addMoreText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyStateText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  addFirstContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addFirstContactText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});
