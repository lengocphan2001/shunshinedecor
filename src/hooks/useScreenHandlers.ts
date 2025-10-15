import { useCallback } from 'react';
import { BaseScreenProps, ScreenHandlers } from '../types/base';

export const useScreenHandlers = (props?: BaseScreenProps): ScreenHandlers => {
  const handleProfilePress = useCallback(() => {
    console.log('Profile pressed');
  }, []);

  const handleChatPress = useCallback(() => {
    console.log('Chat pressed');
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('Notification pressed');
  }, []);

  return {
    handleProfilePress,
    handleChatPress,
    handleNotificationPress,
  };
};
