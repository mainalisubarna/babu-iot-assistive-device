import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default',
  size = 'medium'
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.success, text: Colors.surface };
      case 'warning':
        return { bg: Colors.warning, text: Colors.surface };
      case 'danger':
        return { bg: Colors.danger, text: Colors.surface };
      default:
        return { bg: Colors.surface, text: Colors.textPrimary };
    }
  };

  const colors = getColors();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? 4 : 6,
          borderColor: variant === 'default' ? Colors.divider : 'transparent',
          borderWidth: variant === 'default' ? 1 : 0,
        },
      ]}
    >
      <Text
        style={[
          isSmall ? Typography.caption : Typography.small,
          { color: colors.text },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.chip,
    alignSelf: 'flex-start',
  },
});