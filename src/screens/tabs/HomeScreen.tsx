import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MainLayout from '../../components/layout/MainLayout';
import ProjectItem from '../../components/cards/ProjectItem';
import ActivityItem from '../../components/cards/ActivityItem';
import { typography, spacing, useTheme } from '../../theme';
import { ProjectItemData } from '../../types/project';
import { ActivityItemData } from '../../types/activity';
import { ProjectDetailParams } from '../../types/navigation';
import { MOCK_ACTIVITIES } from '../../constants/mockData';
import { createProjectApi, listProjectsApi } from '../../api/projects';
import { useAuth } from '../../contexts/AuthContext';

// Using imported constants instead of local definitions

interface HomeScreenProps {
  onNavigateToProjectDetail?: (params: ProjectDetailParams) => void;
}

export default function HomeScreen({ onNavigateToProjectDetail }: HomeScreenProps) {
  const formatDateLabel = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : 'YYYY-MM-DD');
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'projectList' | 'activityLog'>('projectList');
  const [projects, setProjects] = useState<ProjectItemData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const styles = createStyles(colors, isDark);

  // Map server project to ProjectItemData for display
  const mapProjectToItemData = (p: any): ProjectItemData => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    const today = new Date();
    const isCompleted = p.status === 'COMPLETED';
    const isLate = !isCompleted && end.getTime() < today.getTime();
    const daysUntilEnd = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isWarning = !isCompleted && !isLate && daysUntilEnd <= 3;

    const status: ProjectItemData['status'] = isLate ? 'late' : isWarning ? 'warning' : 'onSchedule';
    const statusText = isCompleted
      ? 'Completed'
      : p.status === 'PLANNED'
        ? 'Planned'
        : p.status === 'IN_PROGRESS'
          ? (isLate ? 'Overdue' : isWarning ? 'Due soon' : 'In Progress')
          : 'In Progress';

    // Format date range như mockdata ban đầu: dd/Month-dd/Month
    const formatDateToShort = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      return `${day}/${month}`;
    };
    
    const dateRange = `${formatDateToShort(start)}-${formatDateToShort(end)}`;

    return {
      id: p._id,
      name: p.name,
      dateRange,
      count: daysUntilEnd, // Đếm ngược ngày còn lại
      status,
      statusText,
    };
  };

  const fetchProjects = async () => {
    try {
      const res = (await listProjectsApi()) as any;
      if (res?.projects) {
        setProjects(res.projects.map(mapProjectToItemData));
      }
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
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

  const handleTabChange = (tab: 'projectList' | 'activityLog') => {
    setActiveTab(tab);
  };

  const handleProjectPress = (project: ProjectItemData) => {
    console.log('Project pressed:', project.name);
    if (onNavigateToProjectDetail) {
      onNavigateToProjectDetail({
        projectId: project.id,
        projectName: project.name,
      });
    }
  };

  const handleAddMore = () => {
    if (!isAdmin) return;
    setShowAdd(true);
  };

  const handleCreate = async () => {
    try {
      const startIso = newStartDate ? newStartDate.toISOString() : newStart;
      const endIso = newEndDate ? newEndDate.toISOString() : newEnd;
      if (!newName || !startIso || !endIso) return;
      const res = (await createProjectApi({ name: newName, startDate: startIso, endDate: endIso })) as any;
      const p = res?.project;
      if (p) await fetchProjects();
      setShowAdd(false);
      setNewName(''); setNewStart(''); setNewEnd(''); setNewStartDate(null); setNewEndDate(null);
    } catch (e) {
      console.log('Create project error', e);
    }
  };

  const handleActivityPress = (activity: ActivityItemData) => {
    console.log('Activity pressed:', activity.title);
  };

  const renderProjectList = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {projects.length === 0 && (
          <Text style={styles.addMoreText}>{t('home.noProjects')}</Text>
        )}
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onPress={() => handleProjectPress(project)}
          />
        ))}
        
        {/* Add more button (ADMIN only) */}
        {isAdmin && (
          <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
            <Text style={styles.addMoreText}>{t('home.addMore')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  const renderActivityLog = () => (
    <View style={styles.contentContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ACTIVITIES.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onPress={() => handleActivityPress(activity)}
          />
        ))}
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
          onPress={() => handleTabChange('projectList')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'projectList' && styles.activeTabText
          ]}>
            {t('home.projectList')}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabChange('activityLog')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'activityLog' && styles.activeTabText
          ]}>
            {t('home.activityLog')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'projectList' ? renderProjectList() : renderActivityLog()}

      {/* Add Project Modal */}
      <Modal
        visible={showAdd}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAdd(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <FontAwesome5 name="times" size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{t('home.addProject') || 'Add Project'}</Text>
            <TouchableOpacity 
              onPress={handleCreate}
              disabled={!newName.trim()}
            >
              <Text style={[
                styles.modalSaveButton,
                !newName.trim() && styles.modalSaveButtonDisabled
              ]}>
                {t('common.create') || 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalForm}>
              {/* Project Name */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('project.name') || 'Name'} *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('project.name') || 'Name'}
                  placeholderTextColor={colors.text.tertiary}
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              {/* Start Date */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('project.startDate') || 'Start Date'}</Text>
                <TouchableOpacity 
                  style={styles.modalInput} 
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.modalDateText}>
                    {formatDateLabel(newStartDate)}
                  </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={newStartDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, date) => { setShowStartPicker(false); if (date) setNewStartDate(date); }}
              />
            )}
              </View>

              {/* End Date */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>{t('project.endDate') || 'End Date'}</Text>
                <TouchableOpacity 
                  style={styles.modalInput} 
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.modalDateText}>
                    {formatDateLabel(newEndDate)}
                  </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={newEndDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, date) => { setShowEndPicker(false); if (date) setNewEndDate(date); }}
              />
            )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.styles.displayMedium,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  placeholderSubtext: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
  },
  // Modal styles (giống AddContactModal)
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
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
  modalHeaderTitle: {
    ...typography.styles.displayMedium,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalSaveButton: {
    ...typography.styles.textMedium,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.small,
  },
  modalSaveButtonDisabled: {
    color: colors.text.tertiary,
    backgroundColor: colors.divider + '30',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  modalForm: {
    paddingBottom: spacing.xl,
  },
  modalInputGroup: {
    marginBottom: spacing.xl,
  },
  modalLabel: {
    ...typography.styles.textMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  modalInput: {
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
  modalDateText: {
    ...typography.styles.textMedium,
    fontSize: 17,
    color: colors.text.primary,
  },
});
