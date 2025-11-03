import { request } from './client';

export interface CreateProjectInput {
  name: string;
  startDate: string; // ISO
  endDate: string;   // ISO
}

export async function listProjectsApi() {
  return request('/api/projects');
}

export async function createProjectApi(input: CreateProjectInput) {
  return request('/api/projects', { method: 'POST', body: input });
}

export async function addProjectContactApi(projectId: string, contactData: {
  name: string;
  displayName: string;
  phone?: string;
  email?: string;
}) {
  return request(`/api/projects/${projectId}/contacts`, { 
    method: 'POST', 
    body: contactData 
  });
}


