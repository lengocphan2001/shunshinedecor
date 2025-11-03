import { request } from './client';

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
  timestamp: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  isDeleted?: boolean;
}

export interface QuickReport {
  _id?: string;
  id?: string;
  projectId: string;
  date: string;
  manpower: ManPowerEntry[];
  qualityEntries: QuickReportEntry[];
  scheduleEntries: QuickReportEntry[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuickReportInput {
  projectId: string;
  date: string;
}

export interface UpdateManpowerInput {
  manpower: ManPowerEntry[];
}

export interface AddEntryInput {
  content: string;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
}

export interface AddCommentInput {
  content: string;
}

export async function getQuickReportApi(projectId: string, date?: string) {
  const url = `/api/quick-reports/project/${projectId}${date ? `?date=${date}` : ''}`;
  return request(url);
}

export async function createQuickReportApi(input: CreateQuickReportInput) {
  return request('/api/quick-reports', {
    method: 'POST',
    body: input,
  });
}

export async function updateManpowerApi(reportId: string, input: UpdateManpowerInput) {
  return request(`/api/quick-reports/${reportId}/manpower`, {
    method: 'PUT',
    body: input,
  });
}

export async function addQualityEntryApi(reportId: string, input: AddEntryInput) {
  return request(`/api/quick-reports/${reportId}/quality`, {
    method: 'POST',
    body: input,
  });
}

export async function addScheduleEntryApi(reportId: string, input: AddEntryInput) {
  return request(`/api/quick-reports/${reportId}/schedule`, {
    method: 'POST',
    body: input,
  });
}

export async function addCommentApi(reportId: string, input: AddCommentInput) {
  return request(`/api/quick-reports/${reportId}/comments`, {
    method: 'POST',
    body: input,
  });
}

