export interface ProjectItemData {
  id: string;
  name: string;
  dateRange: string;
  count: number;
  status: 'onSchedule' | 'late' | 'warning';
  statusText: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  progress: number;
  teamMembers: string[];
  tasks: Task[];
}

export type ProjectStatus = 'planning' | 'inProgress' | 'onSchedule' | 'late' | 'warning' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'completed';
  assignee?: string;
  dueDate?: Date;
}
