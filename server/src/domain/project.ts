export enum ProjectStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface ProjectProps {
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  status: ProjectStatus;
  progress: number; // 0-100
  teamMembers: string[]; // user ids or emails
  tasks: Array<{
    title: string;
    done: boolean;
  }>;
}


