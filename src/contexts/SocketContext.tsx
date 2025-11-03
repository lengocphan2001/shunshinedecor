import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socket.service';
import { useAuth } from './AuthContext';

interface SocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Auto-connect when user is available
    if (user) {
      console.log('SocketContext - User changed, reconnecting socket for:', user.email);
      
      // Add a small delay to ensure token is saved to AsyncStorage
      const reconnectTimer = setTimeout(() => {
        socketService.reconnect().then(() => {
          setIsConnected(true);
          console.log('Socket reconnected with new token');
        }).catch(err => {
          console.error('Failed to reconnect socket:', err);
          setIsConnected(false);
        });
      }, 500); // 500ms delay to ensure token is saved
      
      return () => clearTimeout(reconnectTimer);
    } else {
      // No user, disconnect
      console.log('SocketContext - No user, disconnecting socket');
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [user]);

  const connect = async () => {
    try {
      await socketService.connect();
      setIsConnected(true);
      console.log('Socket service connected');
    } catch (error) {
      console.error('Failed to connect socket:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    socketService.disconnect();
    setIsConnected(false);
  };

  return (
    <SocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

