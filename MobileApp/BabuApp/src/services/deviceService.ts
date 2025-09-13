import { DeviceStatus } from '../types';
import { mockDeviceStatus } from '../data/mockDevice';

export const deviceService = {
  getStatus: async (): Promise<DeviceStatus> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDeviceStatus;
  },
};