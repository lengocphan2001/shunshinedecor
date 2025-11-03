import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const DEFAULT_TIMEOUT_MS = 20000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  return await Promise.race<T>([
    promise,
    new Promise<T>((_r, reject) => {
      timer = setTimeout(() => reject(new Error('Request timeout')), ms);
    }) as Promise<T>,
  ]).finally(() => clearTimeout(timer!));
}

export async function request(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string>; timeoutMs?: number } = {}) {
  const url = `${APP_CONFIG.apiBaseUrl}${path}`;
  const accessToken = await AsyncStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await withTimeout(
    fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    }),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { const j = await res.json(); message = j?.error?.message || message; } catch {}
    throw new Error(message);
  }
  try { return await res.json(); } catch { return null; }
}


