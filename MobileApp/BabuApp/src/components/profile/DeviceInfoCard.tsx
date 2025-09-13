import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, StatusDot } from '../common';
import { Colors, Typography, Spacing } from '../../constants';

interface DeviceInfo {
  deviceId: string;
  model: string;
  lastSync: Date;
  firmwareVersion: string;
  batteryLevel: number;
  isOnline: boolean;
}

interface DeviceInfoCardProps {
  deviceInfo: DeviceInfo;
  language: 'en' | 'ne';
  onManageDevice?: () => void;
}

export const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({
  deviceInfo,
  language,
  onManageDevice,
}) => {
  const getTitle = () => {
    return language === 'ne' ? 'यन्त्रको जानकारी' : 'Device Information';
  };

  const getManageText = () => {
    return language === 'ne' ? 'व्यवस्थापन गर्नुहोस्' : 'Manage';
  };

  const getStatusText = () => {
    return language === 'ne' 
      ? (deviceInfo.isOnline ? 'अनलाइन' : 'अफलाइन')
      : (deviceInfo.isOnline ? 'Online' : 'Offline');
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

  const getInfoRows = () => {
    return [
      {
        label: language === 'ne' ? 'यन्त्र ID' : 'Device ID',
        value: deviceInfo.deviceId,
      },
      {
        label: language === 'ne' ? 'मोडेल' : 'Model',
        value: deviceInfo.model,
      },
      {
        label: language === 'ne' ? 'फर्मवेयर' : 'Firmware',
        value: `v${deviceInfo.firmwareVersion}`,
      },
      {
        label: language === 'ne' ? 'ब्याट्री' : 'Battery',
        value: `${deviceInfo.batteryLevel}%`,
      },
      {
        label: language === 'ne' ? 'अन्तिम सिंक' : 'Last Sync',
        value: formatLastSync(deviceInfo.lastSync),
      },
    ];
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={onManageDevice}>
          <Text style={styles.manageText}>{getManageText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          <StatusDot status={deviceInfo.isOnline ? 'online' : 'offline'} size={10} />
          <Text style={[styles.statusText, { 
            color: deviceInfo.isOnline ? Colors.success : Colors.danger 
          }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.infoList}>
        {getInfoRows().map((row, index) => (
          <View key={index} style={[styles.infoRow, index > 0 && { marginTop: Spacing.sm }]}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  manageText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '500',
  },
  statusRow: {
    marginBottom: Spacing.lg,
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
  infoList: {
    // marginTop handled by individual rows
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