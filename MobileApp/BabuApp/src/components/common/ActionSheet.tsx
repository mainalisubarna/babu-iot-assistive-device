import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from './Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface ActionSheetOption {
  text: string;
  onPress: () => void;
  style?: 'default' | 'destructive' | 'success';
}

interface ActionSheetProps {
  visible: boolean;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelText: string;
  onCancel: () => void;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  title,
  message,
  options,
  cancelText,
  onCancel,
}) => {
  const getOptionTextColor = (style?: string) => {
    switch (style) {
      case 'destructive':
        return Colors.danger;
      case 'success':
        return Colors.success;
      default:
        return Colors.textPrimary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <Card style={styles.sheet}>
            {(title || message) && (
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {message && <Text style={styles.message}>{message}</Text>}
              </View>
            )}
            
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    index > 0 && styles.optionBorder,
                  ]}
                  onPress={() => {
                    option.onPress();
                    onCancel();
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    { color: getOptionTextColor(option.style) }
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Card style={styles.cancelCard}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sheetContainer: {
    width: '100%',
  },
  sheet: {
    padding: 0,
    marginBottom: Spacing.md,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  optionsContainer: {
    // Options will be added dynamically
  },
  option: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  optionText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  cancelButton: {
    width: '100%',
  },
  cancelCard: {
    padding: 0,
  },
  cancelText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});