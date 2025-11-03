import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import { typography, spacing, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  isCompleted: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  date: string; // e.g., '3/Oct'
  done: boolean;
}

interface TaskSection {
  id: string;
  title: string; // e.g., '4PS'
  items: TaskItem[];
}

export default function ToDoScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'project' | 'list'>('project');
  
  const styles = createStyles(colors, isDark);

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  // Sections data similar to screenshot (demo)
  const sectionsProject: TaskSection[] = [
    {
      id: '4ps-a',
      title: '4PS',
      items: [
        { id: 'a1', title: 'Làm lại mẫu ghế', date: '3/Oct', done: true },
        { id: 'a2', title: 'Triển khai trinh mẫu', date: '3/Oct', done: true },
        { id: 'a3', title: 'Đẩy nhanh mua hàng', date: '3/Oct', done: true },
      ],
    },
    {
      id: '4ps-b',
      title: '4PS',
      items: [
        { id: 'b1', title: 'Làm lại mẫu ghế', date: '3/Oct', done: true },
        { id: 'b2', title: 'Triển khai trinh mẫu', date: '3/Oct', done: true },
        { id: 'b3', title: 'Đẩy nhanh mua hàng', date: '3/Oct', done: true },
      ],
    },
  ];

  const sectionsList: TaskSection[] = sectionsProject;

  const renderTaskRow = (task: TaskItem) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskRow}
      onPress={() => handleTodoPress({} as any)}
      activeOpacity={0.8}
    >
      <View style={styles.taskLeft}>
        <FontAwesome5 name="check-circle" size={18} color={colors.success} solid />
        <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
      </View>
      <Text style={styles.taskDate}>{task.date}</Text>
    </TouchableOpacity>
  );

  const renderSection = (section: TaskSection) => (
    <View key={section.id} style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionCard}>
        {section.items.map(renderTaskRow)}
      </View>
      <TouchableOpacity onPress={() => handleAddTodo()} activeOpacity={0.7}>
        <Text style={styles.addMoreText}>+ Add more</Text>
      </TouchableOpacity>
    </View>
  );

  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleTodoPress = (todo: TodoItem) => {
    console.log('Todo pressed:', todo.id);
  };

  const handleAddTodo = () => {
    console.log('Add todo pressed');
  };

  // Mock data
  const todoItems: TodoItem[] = [
    {
      id: '1',
      title: 'Review Floor Tile Sample',
      description: 'Check quality and approve floor tile sample for AMARE TIMES CITY',
      priority: 'high',
      dueDate: 'Today',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Update Project Schedule',
      description: 'Review and update project timeline for Keystone Complex',
      priority: 'medium',
      dueDate: 'Tomorrow',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Material Inspection',
      description: 'Inspect wood panel samples for Aurora Expansion',
      priority: 'high',
      dueDate: 'This Week',
      isCompleted: true,
    },
    {
      id: '4',
      title: 'Drawing Review',
      description: 'Review architectural drawings for Central Library',
      priority: 'low',
      dueDate: 'Next Week',
      isCompleted: false,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.text.secondary;
    }
  };

  const renderTodoItem = (todo: TodoItem) => (
    <TouchableOpacity
      key={todo.id}
      style={[
        styles.todoItem,
        todo.isCompleted && styles.completedTodoItem
      ]}
      onPress={() => handleTodoPress(todo)}
    >
      <View style={styles.todoContent}>
        <View style={styles.todoHeader}>
          <View style={styles.todoTitleContainer}>
            <Text style={[
              styles.todoTitle,
              todo.isCompleted && styles.completedTodoTitle
            ]}>
              {todo.title}
            </Text>
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: getPriorityColor(todo.priority) }
            ]} />
          </View>
          <TouchableOpacity style={styles.checkButton}>
            <FontAwesome5 
              name={todo.isCompleted ? 'check-circle' : 'circle'} 
              size={20} 
              color={todo.isCompleted ? colors.success : colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[
          styles.todoDescription,
          todo.isCompleted && styles.completedTodoDescription
        ]}>
          {todo.description}
        </Text>
        
        <View style={styles.todoFooter}>
          <Text style={[
            styles.dueDate,
            todo.isCompleted && styles.completedDueDate
          ]}>
            Due: {todo.dueDate}
          </Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(todo.priority) + '20' }
          ]}>
            <Text style={[
              styles.priorityText,
              { color: getPriorityColor(todo.priority) }
            ]}>
              {todo.priority.toUpperCase()}
            </Text>
          </View>
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
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('project')}>
            <Text style={[styles.tabText, activeTab === 'project' && styles.activeTabText]}>Project to do</Text>
          </TouchableOpacity>
          <View style={styles.tabDivider} />
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('list')}>
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>List to do</Text>
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {(activeTab === 'project' ? sectionsProject : sectionsList).map(renderSection)}
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
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
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeTabText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.displayMedium,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.small,
    marginBottom: spacing.xs,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  taskTitle: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  taskDate: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.secondary,
  },
  addMoreText: {
    ...typography.styles.textMedium,
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
