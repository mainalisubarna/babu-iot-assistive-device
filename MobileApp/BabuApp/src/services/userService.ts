import { User, Contact } from '../types';
import { mockUser, mockEmergencyContacts, mockDeviceInfo } from '../data/mockUser';

export const userService = {
  getProfile: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUser;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    Object.assign(mockUser, updates);
    mockUser.updatedAt = new Date();
    return mockUser;
  },

  getEmergencyContacts: async (): Promise<Contact[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockEmergencyContacts;
  },

  addEmergencyContact: async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const newContact: Contact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    mockEmergencyContacts.push(newContact);
    return newContact;
  },

  updateEmergencyContact: async (contactId: string, updates: Partial<Contact>): Promise<Contact> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const contactIndex = mockEmergencyContacts.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      Object.assign(mockEmergencyContacts[contactIndex], updates);
      return mockEmergencyContacts[contactIndex];
    }
    throw new Error('Contact not found');
  },

  deleteEmergencyContact: async (contactId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const contactIndex = mockEmergencyContacts.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      mockEmergencyContacts.splice(contactIndex, 1);
    } else {
      throw new Error('Contact not found');
    }
  },

  getDeviceInfo: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDeviceInfo;
  },
};