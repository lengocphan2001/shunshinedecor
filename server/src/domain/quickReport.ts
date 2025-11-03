export interface ManPowerEntry {
  role: string;
  count: number;
}

export interface QuickReportEntry {
  authorId: string;
  authorName: string;
  content: string;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
  timestamp: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  isDeleted?: boolean;
}

export interface QuickReportProps {
  projectId: string;
  date: Date;
  manpower: ManPowerEntry[];
  qualityEntries: QuickReportEntry[];
  scheduleEntries: QuickReportEntry[];
  comments: Comment[];
}

