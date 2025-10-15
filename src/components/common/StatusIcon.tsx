import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../theme';

interface StatusIconProps {
  status: 'completed' | 'error' | 'warning' | 'info';
  size?: number;
  iconSize?: number;
}

export default function StatusIcon({ 
  status, 
  size = 32, 
  iconSize = 16 
}: StatusIconProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { name: 'check', color: colors.status.onSchedule };
      case 'error':
        return { name: 'times', color: colors.status.late };
      case 'warning':
        return { name: 'exclamation-triangle', color: colors.status.warning };
      case 'info':
      default:
        return { name: 'info-circle', color: colors.neutral };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.statusBadge, { 
      width: size, 
      height: size, 
      borderRadius: size / 2,
      backgroundColor: config.color 
    }]}>
      <FontAwesome5 
        name={config.name} 
        size={iconSize} 
        color={colors.text.white} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
