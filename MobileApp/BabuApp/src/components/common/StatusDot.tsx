import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface StatusDotProps {
  status: 'online' | 'offline' | 'success' | 'warning' | 'danger' | 'pending';
  size?: number;
}

export const StatusDot: React.FC<StatusDotProps> = ({ 
  status, 
  size = 8 
}) => {
  const getColor = () => {
    switch (status) {
      case 'online':
      case 'success':
        return Colors.success;
      case 'warning':
      case 'pending':
        return Colors.warning;
      case 'danger':
      case 'offline':
        return Colors.danger;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getColor(),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    // Base styles handled by props
  },
});