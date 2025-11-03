import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, useTheme } from '../../theme';
import { ContactItem } from '../../types/contact';
import { addProjectContactApi } from '../../api/projects';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onContactAdded: (contact: ContactItem) => void;
}

export default function AddContactModal({
  visible,
  onClose,
  projectId,
  projectName,
  onContactAdded,
}: AddContactModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(colors);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      Alert.alert('Lỗi', 'Tên và tên hiển thị là bắt buộc');
      return;
    }

    setIsLoading(true);
    try {
      await addProjectContactApi(projectId, formData);
      
      const newContact: ContactItem = {
        id: `${projectId}-${Date.now()}`,
        name: formData.name,
        displayName: formData.displayName,
        phone: formData.phone,
        email: formData.email,
        department: projectName,
      };

      onContactAdded(newContact);
      
      // Reset form
      setFormData({
        name: '',
        displayName: '',
        phone: '',
        email: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to add contact:', error);
      Alert.alert('Lỗi', 'Không thể thêm contact. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        displayName: '',
        phone: '',
        email: '',
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={isLoading}>
            <FontAwesome5 name="times" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thêm Contact</Text>
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isLoading || !formData.name.trim() || !formData.displayName.trim()}
          >
            <Text style={[
              styles.saveButton,
              (!formData.name.trim() || !formData.displayName.trim() || isLoading) && styles.saveButtonDisabled
            ]}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectLabel}>Project:</Text>
            <Text style={styles.projectName}>{projectName}</Text>
          </View>

          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên"
                placeholderTextColor={colors.text.tertiary}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!isLoading}
              />
            </View>

            {/* Display Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên hiển thị *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên hiển thị"
                placeholderTextColor={colors.text.tertiary}
                value={formData.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                editable={!isLoading}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={colors.text.tertiary}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                placeholderTextColor={colors.text.tertiary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  saveButton: {
    ...typography.styles.textMedium,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.small,
  },
  saveButtonDisabled: {
    color: colors.text.tertiary,
    backgroundColor: colors.divider + '30',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  projectInfo: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  projectLabel: {
    ...typography.styles.textMedium,
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  projectName: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  form: {
    paddingBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.styles.textMedium,
    fontSize: 17,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.divider,
    minHeight: 50,
  },
});
