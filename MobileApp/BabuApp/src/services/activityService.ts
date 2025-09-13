import { ActivityLog } from '../types';
import { mockActivities, getRecentActivities } from '../data/mockActivities';

export const activityService = {
  getAll: async (): Promise<ActivityLog[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockActivities;
  },

  getAllActivities: async (): Promise<ActivityLog[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockActivities;
  },

  getRecent: async (limit: number = 5): Promise<ActivityLog[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRecentActivities(limit);
  },

  updateActivity: async (activityId: string, updates: Partial<ActivityLog>): Promise<ActivityLog> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const activityIndex = mockActivities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      mockActivities[activityIndex] = { ...mockActivities[activityIndex], ...updates };
      return mockActivities[activityIndex];
    }
    throw new Error('Activity not found');
  },

  markAsChecked: async (activityId: string): Promise<ActivityLog> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const activityIndex = mockActivities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      mockActivities[activityIndex].status = 'completed';
      return mockActivities[activityIndex];
    }
    throw new Error('Activity not found');
  },
};