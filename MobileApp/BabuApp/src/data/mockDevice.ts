import { DeviceStatus, BabuDevice } from '../types';

export const mockDeviceStatus: DeviceStatus = {
  isOnline: true,
  batteryLevel: 84,
  lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  deviceId: 'BABU-001-XYZ',
};

export const mockBabuDevice: BabuDevice = {
  id: '1',
  deviceId: 'BABU-001-XYZ',
  userId: 'user-123',
  isActive: true,
  batteryLevel: 78,
  lastSync: new Date(Date.now() - 5 * 60 * 1000),
  settings: {
    wakeWordSensitivity: 0.7,
    speakerVolume: 0.8,
    language: 'ne',
    emergencyContacts: [],
    medicineSchedule: [],
  },
};