import { User, Contact } from '../types';

export const mockUser: User = {
    id: 'user-123',
    email: 'ramesh.sharma@email.com',
    name: 'Ramesh Sharma',
    profilePicture: undefined, // Will show initials until image loading is properly configured
    preferredLanguage: 'ne',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
};

export const mockEmergencyContacts: Contact[] = [
    {
        id: 'contact-1',
        name: 'Sita Sharma (Daughter)',
        phoneNumber: '+977-9841234567',
        voiceTag: 'छोरी',
        isEmergencyContact: true,
    },
    {
        id: 'contact-2',
        name: 'Raj Sharma (Son)',
        phoneNumber: '+977-9851234567',
        voiceTag: 'छोरा',
        isEmergencyContact: true,
    },
    {
        id: 'contact-3',
        name: 'Dr. Krishna Thapa',
        phoneNumber: '+977-9861234567',
        voiceTag: 'डाक्टर',
        isEmergencyContact: true,
    },
    {
        id: 'contact-4',
        name: 'Maya Gurung (Neighbor)',
        phoneNumber: '+977-9871234567',
        voiceTag: 'छिमेकी',
        isEmergencyContact: true,
    },
    {
        id: 'contact-5',
        name: 'Hari Bahadur (Caretaker)',
        phoneNumber: '+977-9881234567',
        voiceTag: 'हेरचाहकर्ता',
        isEmergencyContact: true,
    },
];

export const mockDeviceInfo = {
    deviceId: 'BABU-001-XYZ',
    model: 'Babu Care v1.0',
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    firmwareVersion: '1.2.3',
    batteryLevel: 84,
    isOnline: true,
};