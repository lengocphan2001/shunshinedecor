import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, useTheme } from '../../theme';

interface ConfigScreenProps {
  chatName: string;
  onClose: () => void;
  onAddUser?: (email: string) => void;
  onRenameGroup?: (newName: string) => void;
}

export default function ConfigScreen({
  chatName,
  onClose,
  onAddUser,
  onRenameGroup,
}: ConfigScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [newGroupName, setNewGroupName] = useState(chatName);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const styles = createStyles(colors);

  const handleRenameGroup = () => {
    if (newGroupName.trim() && newGroupName !== chatName) {
      onRenameGroup?.(newGroupName.trim());
      setIsEditingName(false);
      Alert.alert('Thành công', 'Đã đổi tên nhóm');
    }
  };

  const handleAddUser = () => {
    if (newUserEmail.trim()) {
      onAddUser?.(newUserEmail.trim());
      setNewUserEmail('');
      Alert.alert('Thành công', 'Đã gửi lời mời tham gia nhóm');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt nhóm</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin nhóm</Text>
          
          {/* Group Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên nhóm</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Nhập tên nhóm"
                placeholderTextColor={colors.text.tertiary}
                editable={isEditingName}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  if (isEditingName) {
                    handleRenameGroup();
                  } else {
                    setIsEditingName(true);
                  }
                }}
              >
                <FontAwesome5 
                  name={isEditingName ? "check" : "edit"} 
                  size={16} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành viên</Text>
          
          {/* Add User */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thêm thành viên</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                placeholder="Nhập email thành viên"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddUser}
                disabled={!newUserEmail.trim()}
              >
                <FontAwesome5 
                  name="plus" 
                  size={16} 
                  color={colors.text.white} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Members */}
          <View style={styles.membersList}>
            <Text style={styles.membersTitle}>Thành viên hiện tại</Text>
            <View style={styles.memberItem}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberAvatarText}>A</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>Admin User</Text>
                <Text style={styles.memberEmail}>admin@test.com</Text>
              </View>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hành động</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="bell" size={16} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>Thông báo nhóm</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="volume-mute" size={16} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>Tắt thông báo</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
            <FontAwesome5 name="sign-out-alt" size={16} color={colors.status.late} />
            <Text style={[styles.actionButtonText, styles.dangerText]}>Rời khỏi nhóm</Text>
            <FontAwesome5 name="chevron-right" size={14} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    ...typography.styles.displayMedium,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.textMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.divider,
    minHeight: 50,
  },
  editButton: {
    backgroundColor: colors.primary + '15',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  membersList: {
    marginTop: spacing.lg,
  },
  membersTitle: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  memberAvatarText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  memberEmail: {
    ...typography.styles.textSmall,
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.small,
  },
  adminBadgeText: {
    ...typography.styles.textSmall,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionButtonText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: spacing.md,
    flex: 1,
  },
  dangerButton: {
    borderColor: colors.status.late + '30',
  },
  dangerText: {
    color: colors.status.late,
  },
});
