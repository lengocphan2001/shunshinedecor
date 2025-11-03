import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { typography, spacing, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface ApprovalItem {
  id: string;
  title: string;
  project: string;
  assignee: string;
  date: string;
  thumbnailImage: any;
  type: 'quality' | 'schedule' | 'material' | 'drawing';
}

type FilterTab = 'all' | 'quality' | 'schedule' | 'material' | 'drawing';

export default function ApprovalCenterScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const styles = createStyles(colors, isDark);

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleFilterChange = (filter: FilterTab) => {
    setActiveFilter(filter);
  };

  const handleItemLongPress = (item: ApprovalItem) => {
    setSelectedItem(item);
    setShowDropdown(true);
  };

  const handleApprove = () => {
    console.log('Approved:', selectedItem?.id);
    setShowDropdown(false);
    setSelectedItem(null);
  };

  const handleReject = () => {
    console.log('Rejected:', selectedItem?.id);
    setShowDropdown(false);
    setSelectedItem(null);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setSelectedItem(null);
  };

  const handleSearchPress = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Mock data based on the image
  const approvalItems: ApprovalItem[] = [
    {
      id: 'Q1',
      title: 'Floor Tile Sample',
      project: 'AMARE TIMES CITY',
      assignee: 'an Kamel',
      date: '14 Apr',
      thumbnailImage: require('../../../assets/background.jpg'),
      type: 'quality',
    },
    {
      id: 'Q2',
      title: 'Wood Panel Sample',
      project: 'Keystone Complex',
      assignee: 'Hien',
      date: '13 Apr',
      thumbnailImage: require('../../../assets/background.jpg'),
      type: 'quality',
    },
    {
      id: 'Q3',
      title: 'Floor Tile Sample',
      project: 'Aurora Expansion',
      assignee: 'Amanda Lee',
      date: '11 Apr',
      thumbnailImage: require('../../../assets/background.jpg'),
      type: 'quality',
    },
    {
      id: 'Q4',
      title: 'Wood Panel Sample',
      project: 'Central Library',
      assignee: 'Derek',
      date: '9 Apr',
      thumbnailImage: require('../../../assets/background.jpg'),
      type: 'quality',
    },
  ];

  const filteredItems = approvalItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {(['all', 'quality', 'schedule', 'material', 'drawing'] as FilterTab[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={styles.filterTab}
            onPress={() => handleFilterChange(filter)}
          >
            <Text style={[
              styles.filterTabText,
              activeFilter === filter && styles.activeFilterTabText
            ]}>
              {t(`approval.${filter}`)}
            </Text>
            {activeFilter === filter && <View style={styles.filterUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderApprovalItem = (item: ApprovalItem, index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.approvalItem}
      onLongPress={() => handleItemLongPress(item)}
      delayLongPress={500}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemProject}>{item.project}</Text>
          <Text style={styles.itemAssignee}>{item.assignee} • {item.date}</Text>
        </View>

        <View style={styles.thumbnailContainer}>
          <Image 
            source={item.thumbnailImage} 
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <MainLayout
      onProfilePress={handleProfilePress}
      onChatPress={handleChatPress}
      onNotificationPress={handleNotificationPress}
      notificationCount={1}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('approval.title')}</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <FontAwesome5 
            name={showSearch ? "times" : "search"} 
            size={20} 
            color={colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <FontAwesome5 name="search" size={16} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('approval.search')}
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <FontAwesome5 name="times" size={14} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      {renderFilterTabs()}

      {/* Content */}
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => renderApprovalItem(item, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('approval.noApprovals')}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Approval Modal */}
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
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('approval.review')}</Text>
              <TouchableOpacity onPress={handleCloseDropdown}>
                <FontAwesome5 name="times" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            {selectedItem && (
              <View style={styles.modalContent}>
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemId}>{selectedItem.id}</Text>
                  <Text style={styles.modalItemTitle}>{selectedItem.title}</Text>
                  <Text style={styles.modalItemProject}>{selectedItem.project}</Text>
                  <Text style={styles.modalItemAssignee}>{selectedItem.assignee} • {selectedItem.date}</Text>
                </View>
                
                <View style={styles.modalImageContainer}>
                  <Image 
                    source={selectedItem.thumbnailImage} 
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
                <Text style={styles.approveButtonText}>{t('approval.approve')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.rejectButtonText}>{t('approval.reject')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </MainLayout>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: spacing.borderRadius.large,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  headerTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  searchButton: {
    padding: spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterScrollContent: {
    paddingRight: spacing.lg,
  },
  filterTab: {
    marginRight: spacing.lg,
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  filterTabText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeFilterTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  filterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  approvalItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDetails: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemId: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  itemProject: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  itemAssignee: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: spacing.borderRadius.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.large,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalContent: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  modalItemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  modalItemId: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  modalItemTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  modalItemProject: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  modalItemAssignee: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
  },
  modalImageContainer: {
    width: 80,
    height: 80,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: spacing.borderRadius.small,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  approveButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.small,
    alignItems: 'center',
    flex: 1,
  },
  approveButtonText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.white,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    flex: 1,
  },
  rejectButtonText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.secondary,
  },
});
