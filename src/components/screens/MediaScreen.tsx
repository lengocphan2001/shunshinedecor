import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, useTheme } from '../../theme';

interface MediaItem {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'image' | 'file';
  thumbnail?: string;
}

interface MediaScreenProps {
  onClose: () => void;
}

export default function MediaScreen({ onClose }: MediaScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'images' | 'files'>('images');

  const styles = createStyles(colors);

  // Mock data
  const mockImages: MediaItem[] = [
    {
      id: '1',
      name: 'screenshot_2024.png',
      size: '2.5 MB',
      date: '21/10/2024',
      type: 'image',
    },
    {
      id: '2',
      name: 'design_mockup.jpg',
      size: '1.8 MB',
      date: '20/10/2024',
      type: 'image',
    },
    {
      id: '3',
      name: 'logo_final.png',
      size: '500 KB',
      date: '19/10/2024',
      type: 'image',
    },
  ];

  const mockFiles: MediaItem[] = [
    {
      id: '1',
      name: 'project_proposal.pdf',
      size: '5.2 MB',
      date: '21/10/2024',
      type: 'file',
    },
    {
      id: '2',
      name: 'budget_estimate.xlsx',
      size: '1.1 MB',
      date: '20/10/2024',
      type: 'file',
    },
    {
      id: '3',
      name: 'meeting_notes.docx',
      size: '800 KB',
      date: '19/10/2024',
      type: 'file',
    },
  ];

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'file-pdf';
      case 'doc':
      case 'docx':
        return 'file-word';
      case 'xls':
      case 'xlsx':
        return 'file-excel';
      case 'ppt':
      case 'pptx':
        return 'file-powerpoint';
      case 'zip':
      case 'rar':
        return 'file-archive';
      default:
        return 'file';
    }
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity style={styles.mediaItem}>
      <View style={styles.mediaIcon}>
        {item.type === 'image' ? (
          <FontAwesome5 name="image" size={24} color={colors.primary} />
        ) : (
          <FontAwesome5 name={getFileIcon(item.name)} size={24} color={colors.primary} />
        )}
      </View>
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.mediaDetails}>
          {item.size} • {item.date}
        </Text>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <FontAwesome5 name="download" size={16} color={colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 
        name={activeTab === 'images' ? 'image' : 'file'} 
        size={48} 
        color={colors.text.tertiary} 
      />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'images' ? 'Chưa có ảnh nào' : 'Chưa có file nào'}
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'images' 
          ? 'Các ảnh được chia sẻ trong cuộc trò chuyện sẽ xuất hiện ở đây'
          : 'Các file được chia sẻ trong cuộc trò chuyện sẽ xuất hiện ở đây'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương tiện</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'images' && styles.activeTab]}
          onPress={() => setActiveTab('images')}
        >
          <FontAwesome5 name="image" size={16} color={activeTab === 'images' ? colors.primary : colors.text.secondary} />
          <Text style={[styles.tabText, activeTab === 'images' && styles.activeTabText]}>
            Ảnh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'files' && styles.activeTab]}
          onPress={() => setActiveTab('files')}
        >
          <FontAwesome5 name="file" size={16} color={activeTab === 'files' ? colors.primary : colors.text.secondary} />
          <Text style={[styles.tabText, activeTab === 'files' && styles.activeTabText]}>
            File
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'images' ? (
          mockImages.length > 0 ? (
            <FlatList
              data={mockImages}
              renderItem={renderMediaItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyState()
          )
        ) : (
          mockFiles.length > 0 ? (
            <FlatList
              data={mockFiles}
              renderItem={renderMediaItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyState()
          )
        )}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: spacing.lg,
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  mediaIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.borderRadius.small,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mediaInfo: {
    flex: 1,
  },
  mediaName: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  mediaDetails: {
    ...typography.styles.textSmall,
    fontSize: 14,
    color: colors.text.secondary,
  },
  downloadButton: {
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.small,
    backgroundColor: colors.divider + '30',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
