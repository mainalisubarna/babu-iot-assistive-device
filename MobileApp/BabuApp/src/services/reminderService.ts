import { Reminder, mockReminders, getNextReminder } from '../data/mockReminders';

export const reminderService = {
  getAll: async (): Promise<Reminder[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockReminders;
  },

  getNext: async (): Promise<Reminder | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return getNextReminder();
  },

  getUpcoming: async (limit: number = 5): Promise<Reminder[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const now = new Date();
    return mockReminders
      .filter(reminder => !reminder.completed && reminder.scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
      .slice(0, limit);
  },
};