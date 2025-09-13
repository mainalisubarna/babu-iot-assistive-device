import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CircularProgress, StatusDot } from '../common';
import { Colors, Typography, Spacing } from '../../constants';
import { DeviceStatus } from '../../types';

interface DeviceStatusCardProps {
  deviceStatus: DeviceStatus;
  language: 'en' | 'ne';
}

export const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({
  deviceStatus,
  language,
}) => {
  const { isOnline, batteryLevel, lastSync, deviceId } = deviceStatus;

  const getBatteryColor = (level: number) => {
    if (level > 80) return Colors.success;
    if (level > 20) return Colors.warning;
    return Colors.danger;
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (language === 'ne') {
      if (diffInMinutes < 1) return 'अहिले';
      if (diffInMinutes < 60) return `${diffInMinutes} मिनेट अगाडि`;
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} घण्टा अगाडि`;
    } else {
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
  };

  const getStatusText = () => {
    return language === 'ne' 
      ? (isOnline ? 'अनलाइन' : 'अफलाइन')
      : (isOnline ? 'Online' : 'Offline');
  };

  const getDeviceTitle = () => {
    return language === 'ne' ? 'बाबु यन्त्र' : 'Babu Device';
  };

  const getLastSyncLabel = () => {
    return language === 'ne' ? 'अन्तिम सिंक' : 'Last sync';
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{getDeviceTitle()}</Text>
          <View style={styles.statusContainer}>
            <StatusDot status={isOnline ? 'online' : 'offline'} size={10} />
            <Text style={[styles.statusText, { color: isOnline ? Colors.success : Colors.danger }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
        <Text style={styles.deviceId}>{deviceId}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.batterySection}>
          <CircularProgress
            progress={batteryLevel}
            size={80}
            strokeWidth={8}
            color={getBatteryColor(batteryLevel)}
            backgroundColor={Colors.progressBackground}
          >
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
          </CircularProgress>
          <Text style={styles.batteryLabel}>
            {language === 'ne' ? 'ब्याट्री' : 'Battery'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{getLastSyncLabel()}</Text>
            <Text style={styles.infoValue}>{formatLastSync(lastSync)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  deviceId: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  batterySection: {
    alignItems: 'center',
  },
  batteryText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  batteryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  infoSection: {
    flex: 1,
    marginLeft: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});