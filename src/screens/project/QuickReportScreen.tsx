import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenLayout from '../../components/layout/ScreenLayout';
import { typography, spacing, useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { BaseScreenProps } from '../../types/base';
import {
  getQuickReportApi,
  createQuickReportApi,
  updateManpowerApi,
  addQualityEntryApi,
  addScheduleEntryApi,
  addCommentApi,
  QuickReport,
  ManPowerEntry,
  AddEntryInput,
  UploadedFile,
} from '../../api/quickReport';
import { uploadFileApi } from '../../api/upload';
import { editImageWithCropRotate } from '../../components/modals/ImageEditorModal';

interface QuickReportScreenProps extends BaseScreenProps {
  projectId: string;
  projectName?: string;
}

export default function QuickReportScreen({
  projectId,
  projectName = 'Quick Report',
  onGoBack,
  navigationStack,
  onNavigateToScreen,
}: QuickReportScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, isAdmin } = useAuth();
  const styles = createStyles(colors);

  const [quickReport, setQuickReport] = useState<QuickReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ManPower states
  const [manpowerRows, setManpowerRows] = useState<ManPowerEntry[]>([]);
  const [editingManpower, setEditingManpower] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newCount, setNewCount] = useState('');

  // Entry states
  const [selectedCategory, setSelectedCategory] = useState<'quality' | 'schedule'>('quality');
  const [entryContent, setEntryContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);

  // Comments state
  const [commentText, setCommentText] = useState('');

  // Load quick report
  useEffect(() => {
    loadQuickReport();
  }, [projectId, selectedDate]);

  const loadQuickReport = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await getQuickReportApi(projectId, dateStr);
      
      if (response.quickReport) {
        setQuickReport(response.quickReport);
        setManpowerRows(response.quickReport.manpower || []);
      } else {
        // If no report exists, create one for today
        if (isAdmin && dateStr === new Date().toISOString().split('T')[0]) {
          await createQuickReport();
        }
      }
    } catch (error: any) {
      console.error('Error loading quick report:', error);
      Alert.alert('Error', 'Failed to load quick report');
    } finally {
      setLoading(false);
    }
  };

  const createQuickReport = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await createQuickReportApi({
        projectId,
        date: dateStr,
      });
      setQuickReport(response.quickReport);
      setManpowerRows(response.quickReport.manpower || []);
    } catch (error: any) {
      console.error('Error creating quick report:', error);
      Alert.alert('Error', error.message || 'Failed to create quick report');
    }
  };

  const handleSaveManpower = async () => {
    if (!quickReport) return;
    
    try {
      const response = await updateManpowerApi(quickReport._id || quickReport.id || '', {
        manpower: manpowerRows,
      });
      setQuickReport(response.quickReport);
      setManpowerRows(response.quickReport.manpower);
      setEditingManpower(false);
      Alert.alert('Success', 'Manpower updated successfully');
    } catch (error: any) {
      console.error('Error updating manpower:', error);
      Alert.alert('Error', 'Failed to update manpower');
    }
  };

  const handleAddManpowerRow = () => {
    if (!newRole.trim()) {
      Alert.alert('Error', 'Please enter a role');
      return;
    }
    setManpowerRows([...manpowerRows, { role: newRole.trim(), count: parseInt(newCount) || 0 }]);
    setNewRole('');
    setNewCount('');
  };

  const handleRemoveManpowerRow = (index: number) => {
    setManpowerRows(manpowerRows.filter((_, i) => i !== index));
  };

  const handlePickImage = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        quality: 0.9,
        maxWidth: 1920,
        maxHeight: 1080,
        cropping: false,
      });

      if (!images || (Array.isArray(images) && images.length === 0)) return;

      const imageArray = Array.isArray(images) ? images : [images];
      setUploadingFile(true);

      const uploadPromises = imageArray.map(async (img) => {
        const fileName = img.path.split('/').pop() || 'image.jpg';
        const mimeType = img.mime || 'image/jpeg';
        const uploadedFile = await uploadFileApi(img.path, fileName, mimeType);
        return { ...uploadedFile, localPath: img.path } as UploadedFile & { localPath: string };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const handleEditImage = async (file: UploadedFile & { localPath?: string }, index: number) => {
    const localPath = (file as any).localPath;
    if (!localPath) {
      Alert.alert('Info', 'Cannot edit image after uploading');
      return;
    }

    await editImageWithCropRotate(localPath, async (editedImagePath: string) => {
      try {
        setUploadingFile(true);
        const fileName = editedImagePath.split('/').pop() || 'edited.jpg';
        const mimeType = 'image/jpeg';
        const uploadedFile = await uploadFileApi(editedImagePath, fileName, mimeType);
        const editedFileWithPath = { ...uploadedFile, localPath: editedImagePath } as UploadedFile & { localPath: string };
        setSelectedFiles(prev => prev.map((f, i) => i === index ? editedFileWithPath : f));
      } catch (error: any) {
        console.error('Error saving edited image:', error);
        Alert.alert('Error', 'Failed to save edited image');
      } finally {
        setUploadingFile(false);
      }
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddEntry = async () => {
    if (!quickReport || !entryContent.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    try {
      setUploadingFile(true);
      const input: AddEntryInput = {
        content: entryContent.trim(),
        attachments: selectedFiles.map(f => ({
          url: f.url,
          fileName: f.fileName,
          fileSize: f.fileSize,
          mimeType: f.mimeType,
        })),
      };

      let response;
      if (selectedCategory === 'quality') {
        response = await addQualityEntryApi(quickReport._id || quickReport.id || '', input);
      } else {
        response = await addScheduleEntryApi(quickReport._id || quickReport.id || '', input);
      }

      setQuickReport(response.quickReport);
      setEntryContent('');
      setSelectedFiles([]);
      setShowAddEntry(false);
      Alert.alert('Success', 'Entry added successfully');
    } catch (error: any) {
      console.error('Error adding entry:', error);
      Alert.alert('Error', 'Failed to add entry');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddComment = async () => {
    if (!quickReport || !commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      const response = await addCommentApi(quickReport._id || quickReport.id || '', {
        content: commentText.trim(),
      });
      setQuickReport(response.quickReport);
      setCommentText('');
      Alert.alert('Success', 'Comment added successfully');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const getCategoryColor = (category: 'quality' | 'schedule') => {
    return category === 'quality' ? colors.danger : colors.status.onSchedule;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScreenLayout
      breadcrumbItems={[
        { label: 'Home', onPress: onGoBack },
        { label: projectName, onPress: () => {} },
        { label: 'Quick Report', onPress: () => {} },
      ]}
      onProfilePress={() => {}}
      onChatPress={() => {}}
      onNotificationPress={() => {}}
      notificationCount={0}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Date Picker */}
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <FontAwesome5 name="calendar-alt" size={16} color={colors.text.secondary} />
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString('vi-VN')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ManPower Section - Admin only */}
          {isAdmin && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ManPower</Text>
                {editingManpower ? (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.saveButton]}
                      onPress={handleSaveManpower}
                    >
                      <Text style={styles.actionButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => {
                        setEditingManpower(false);
                        setManpowerRows(quickReport?.manpower || []);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditingManpower(true)}
                  >
                    <FontAwesome5 name="edit" size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>

              {editingManpower && (
                <View style={styles.addRowContainer}>
                  <TextInput
                    style={[styles.textInput, { flex: 2 }]}
                    placeholder="Role"
                    value={newRole}
                    onChangeText={setNewRole}
                  />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="Count"
                    value={newCount}
                    onChangeText={setNewCount}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.addRowButton}
                    onPress={handleAddManpowerRow}
                  >
                    <FontAwesome5 name="plus" size={16} color={colors.text.white} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.table}>
                {manpowerRows.length === 0 ? (
                  <Text style={styles.emptyText}>No manpower data</Text>
                ) : (
                  manpowerRows.map((row, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 2 }]}>{row.role}</Text>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{row.count}</Text>
                      {editingManpower && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveManpowerRow(index)}
                        >
                          <FontAwesome5 name="trash" size={14} color={colors.danger} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* Quality Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: getCategoryColor('quality') }]}>
              Quality
            </Text>
            {quickReport?.qualityEntries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.authorName}>{entry.authorName}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(entry.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {entry.attachments && entry.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    {entry.attachments.map((att, attIdx) => (
                      <Image
                        key={attIdx}
                        source={{ uri: att.url }}
                        style={styles.attachmentImage}
                      />
                    ))}
                  </View>
                )}
                <Text style={styles.entryContent}>{entry.content}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedCategory('quality');
                setShowAddEntry(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Add more</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: getCategoryColor('schedule') }]}>
              Schedule
            </Text>
            {quickReport?.scheduleEntries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.authorName}>{entry.authorName}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(entry.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {entry.attachments && entry.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    {entry.attachments.map((att, attIdx) => (
                      <Image
                        key={attIdx}
                        source={{ uri: att.url }}
                        style={styles.attachmentImage}
                      />
                    ))}
                  </View>
                )}
                <Text style={styles.entryContent}>{entry.content}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedCategory('schedule');
                setShowAddEntry(true);
              }}
            >
              <Text style={styles.addButtonText}>+ Add more</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddComment}
                disabled={!commentText.trim()}
              >
                <FontAwesome5 name="paper-plane" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {quickReport?.comments.filter(c => !c.isDeleted).map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.authorName}>{comment.authorName}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(comment.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date && event.type !== 'dismissed') {
                setSelectedDate(date);
              }
            }}
          />
        )}

        {/* Add Entry Modal */}
        <Modal visible={showAddEntry} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add {selectedCategory}</Text>
                <TouchableOpacity onPress={() => setShowAddEntry(false)}>
                  <FontAwesome5 name="times" size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <ScrollView horizontal style={styles.selectedFilesContainer}>
                  {selectedFiles.map((file, index) => (
                    <View key={index} style={styles.selectedFileItem}>
                      <Image source={{ uri: file.url }} style={styles.selectedFileImage} />
                      {(file as any).localPath && (
                        <TouchableOpacity
                          style={styles.editFileButton}
                          onPress={() => handleEditImage(file, index)}
                          disabled={uploadingFile}
                        >
                          <FontAwesome5 name="edit" size={12} color={colors.primary} />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.removeFileButton}
                        onPress={() => handleRemoveFile(index)}
                      >
                        <FontAwesome5 name="times-circle" size={16} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.modalInputRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handlePickImage}
                  disabled={uploadingFile}
                >
                  <FontAwesome5 name="image" size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                {uploadingFile && (
                  <ActivityIndicator size="small" color={colors.primary} />
                )}
              </View>

              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter content..."
                value={entryContent}
                onChangeText={setEntryContent}
                multiline
              />

              <TouchableOpacity
                style={[styles.modalSaveButton, !entryContent.trim() && styles.modalSaveButtonDisabled]}
                onPress={handleAddEntry}
                disabled={!entryContent.trim() || uploadingFile}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  dateContainer: {
    marginBottom: spacing.lg,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
  },
  dateText: {
    ...typography.styles.textMedium,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.heading3,
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.small,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.divider,
  },
  actionButtonText: {
    ...typography.styles.textSmall,
    color: colors.text.white,
    fontWeight: '600',
  },
  addRowContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.borderRadius.small,
    padding: spacing.sm,
    backgroundColor: colors.cardBackground,
    ...typography.styles.textMedium,
    color: colors.text.primary,
  },
  addRowButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tableCell: {
    ...typography.styles.textMedium,
    color: colors.text.primary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  emptyText: {
    ...typography.styles.textSmall,
    color: colors.text.tertiary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  entryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorName: {
    ...typography.styles.textSmall,
    fontWeight: '600',
    color: colors.text.primary,
  },
  timestamp: {
    ...typography.styles.textSmall,
    color: colors.text.tertiary,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.borderRadius.small,
  },
  entryContent: {
    ...typography.styles.textMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  addButton: {
    padding: spacing.sm,
  },
  addButtonText: {
    ...typography.styles.textSmall,
    color: colors.text.tertiary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    ...typography.styles.textMedium,
    color: colors.text.primary,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  commentContent: {
    ...typography.styles.textMedium,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: spacing.borderRadius.large,
    borderTopRightRadius: spacing.borderRadius.large,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.heading3,
    color: colors.text.primary,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    backgroundColor: colors.background,
    ...typography.styles.textMedium,
    color: colors.text.primary,
    minHeight: 100,
    marginBottom: spacing.md,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.medium,
    alignItems: 'center',
  },
  modalSaveButtonDisabled: {
    backgroundColor: colors.divider,
  },
  modalSaveButtonText: {
    ...typography.styles.textMedium,
    color: colors.text.white,
    fontWeight: '600',
  },
  selectedFilesContainer: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedFileItem: {
    marginRight: spacing.sm,
  },
  selectedFileImage: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.small,
  },
  editFileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  removeFileButton: {
    position: 'absolute',
    top: -5,
    right: 5,
  },
});

