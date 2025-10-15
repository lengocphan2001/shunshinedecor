export interface ActivityItemData {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'error' | 'warning';
  thumbnailImage: any; // Image source
  timestamp: Date;
  userId?: string;
}

export interface ActivityLog {
  id: string;
  type: 'comment' | 'update' | 'create' | 'delete';
  description: string;
  timestamp: Date;
  userId: string;
  projectId?: string;
  taskId?: string;
}

export type ActivityStatus = 'success' | 'error' | 'warning' | 'info';
