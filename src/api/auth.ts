import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from './client';

export async function loginApi(email: string, password: string) {
  const data = await request('/api/auth/login', { method: 'POST', body: { email, password } });
  const accessToken = data?.tokens?.accessToken;
  const refreshToken = data?.tokens?.refreshToken;
  if (accessToken) await AsyncStorage.setItem('accessToken', accessToken);
  if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
  return data?.user;
}

export async function logoutApi() {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
}

export async function meApi() {
  return request('/api/auth/me');
}


