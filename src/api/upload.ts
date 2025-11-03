import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

export interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload a file to the server
 */
export async function uploadFileApi(fileUri: string, fileName: string, mimeType: string): Promise<UploadedFile> {
  const token = await AsyncStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to upload file');
  }

  const data = await response.json();
  return data.file;
}

