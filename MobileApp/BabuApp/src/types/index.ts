// Device types
export interface DeviceStatus {
  isOnline: boolean;
  batteryLevel: number;
  lastSync: Date;
  deviceId: string;
}

export interface BabuDevice {
  id: string;
  deviceId: string;
  userId: string;
  isActive: boolean;
  batteryLevel: number;
  lastSync: Date;
  settings: DeviceSettings;
}

export interface DeviceSettings {
  wakeWordSensitivity: number;
  speakerVolume: number;
  language: 'en' | 'ne';
  emergencyContacts: Contact[];
  medicineSchedule: MedicineReminder[];
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  voiceTag: string;
  isEmergencyContact: boolean;
}

// Medicine types
export interface MedicineReminder {
  id: string;
  medicineName: string;
  colorPouch: string;
  dosage: number;
  times: string[];
  voiceInstructions: string;
}

// Activity types
export interface ActivityLog {
  id: string;
  type: 'fall' | 'medicine' | 'call' | 'reminder' | 'companion';
  timestamp: Date;
  details: any;
  location?: GPSCoordinate;
  status: 'completed' | 'missed' | 'pending';
}

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string | any; // Can be URL string or require() image
  preferredLanguage: 'en' | 'ne';
  createdAt: Date;
  updatedAt: Date;
}

// App settings
export interface AppSettings {
  notifications: boolean;
  wakeWordSensitivity: number;
  speakerVolume: number;
}