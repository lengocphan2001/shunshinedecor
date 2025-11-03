import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meApi } from '../api/auth';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'INVESTOR' | 'ADMIN' | 'STAFF';
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await meApi();
      // Backend returns { user: { _id, email, ... } }
      const userData = response?.user || response;
      if (userData) {
        // Map MongoDB _id to id for frontend
        const mappedUser: User = {
          id: userData._id?.toString() || userData.id?.toString() || '',
          email: userData.email || '',
          fullName: userData.fullName || '',
          role: userData.role || 'STAFF',
          isActive: userData.isActive !== false,
        };
        setUser(mappedUser);
        console.log('User refreshed:', mappedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          await refreshUser();
        } else {
          // No token, no user
          setUser(null);
          console.log('No access token found, user is null');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAdmin,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
