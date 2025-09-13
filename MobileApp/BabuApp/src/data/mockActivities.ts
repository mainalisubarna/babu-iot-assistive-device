import { ActivityLog } from '../types';

export const mockActivities: ActivityLog[] = [
  // Today's Activities (more recent)
  {
    id: '1',
    type: 'medicine',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    details: { 
      medicineName: 'Green Pouch Medicine', 
      dosage: 1,
      pouchColor: 'green',
      description: 'Medicine from Green Pouch taken at 8:00 AM.'
    },
    status: 'completed',
  },
  {
    id: '1a',
    type: 'companion',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    details: { 
      activityType: 'voice_chat',
      duration: '5 minutes',
      description: 'Asked Babu about today\'s weather.'
    },
    status: 'completed',
  },
  {
    id: '1b',
    type: 'call',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    details: { 
      contactName: 'Daughter', 
      duration: '8 minutes',
      description: 'Called daughter for daily check-in.'
    },
    status: 'completed',
  },
  {
    id: '2',
    type: 'medicine',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    details: { 
      medicineName: 'Blue Pouch Medicine', 
      dosage: 1,
      pouchColor: 'blue',
      description: 'Medicine from Blue Pouch missed at 2:00 PM.'
    },
    status: 'missed',
  },
  {
    id: '3',
    type: 'fall',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    details: { 
      location: 'Living room', 
      severity: 'emergency',
      description: "Detected distress call 'Babu, help!' – SMS sent to Emergency Contact: Sita (+977-98XXXXXX).",
      emergencyContact: 'Sita (+977-98XXXXXX)'
    },
    location: { latitude: 27.7172, longitude: 85.3240 },
    status: 'pending',
  },
  {
    id: '4',
    type: 'call',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    details: { 
      contactName: 'Kriansh', 
      duration: '8 minutes',
      description: 'Called Kriansh at 5:45 PM via voice command.'
    },
    status: 'completed',
  },
  {
    id: '5',
    type: 'call',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    details: { 
      contactName: 'Ram', 
      duration: '0 minutes',
      description: 'Missed call attempt to Ram due to network issue.',
      failureReason: 'network issue'
    },
    status: 'missed',
  },
  {
    id: '6',
    type: 'medicine',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    details: { 
      medicineName: 'Red Pouch Medicine', 
      dosage: 1,
      pouchColor: 'red',
      description: 'Verified Red Pouch for evening medicine.',
      verification: 'success'
    },
    status: 'completed',
  },
  {
    id: '7',
    type: 'medicine',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    details: { 
      medicineName: 'Yellow Pouch Medicine', 
      dosage: 1,
      pouchColor: 'yellow',
      description: 'Could not verify Yellow Pouch – image mismatch.',
      verification: 'failure'
    },
    status: 'missed',
  },
  // Companionship
  {
    id: '8',
    type: 'companion',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    details: { 
      activityType: 'voice_chat',
      duration: '10 minutes',
      description: 'User had a 10-minute casual talk with Babu.'
    },
    status: 'completed',
  },
  {
    id: '9',
    type: 'companion',
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    details: { 
      activityType: 'news',
      description: 'Nepali news headlines played at 9:00 AM.'
    },
    status: 'completed',
  },
  {
    id: '10',
    type: 'companion',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    details: { 
      activityType: 'rasifal',
      description: 'Sagittarius राशिफल shared at 7:30 AM.',
      zodiacSign: 'Sagittarius'
    },
    status: 'completed',
  },
  {
    id: '11',
    type: 'companion',
    timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    details: { 
      activityType: 'patro',
      description: 'Informed about Ekadasi on upcoming Friday.'
    },
    status: 'completed',
  },
  {
    id: '12',
    type: 'companion',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    details: { 
      activityType: 'tithi',
      description: "User asked for today's tithi – Received 'Purnima'.",
      result: 'Purnima'
    },
    status: 'completed',
  },
  // Mixed/General AI Interaction
  {
    id: '13',
    type: 'reminder',
    timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000), // 13 hours ago
    details: { 
      reminderTitle: 'Visit health camp',
      description: 'Reminder set: Visit health camp in 10 days.',
      daysFromNow: 10
    },
    status: 'completed',
  },
  {
    id: '14',
    type: 'reminder',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    details: { 
      reminderTitle: 'Doctor appointment',
      description: 'Reminder: You have a doctor\'s appointment today at 4:00 PM.',
      time: '4:00 PM'
    },
    status: 'completed',
  },
  {
    id: '15',
    type: 'companion',
    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
    details: { 
      activityType: 'fallback',
      description: "Unknown request: User said 'Babu, play the old song.' (Not supported but logged)",
      userRequest: 'Babu, play the old song.',
      supported: false
    },
    status: 'missed',
  },
  // More today's activities
  {
    id: '15a',
    type: 'reminder',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    details: { 
      reminderTitle: 'Take afternoon walk',
      description: 'Reminder: Take your afternoon walk in the garden.',
      time: '3:00 PM'
    },
    status: 'completed',
  },
  {
    id: '15b',
    type: 'companion',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    details: { 
      activityType: 'news',
      description: 'Played afternoon Nepali news update.'
    },
    status: 'completed',
  },
  {
    id: '15c',
    type: 'medicine',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    details: { 
      medicineName: 'Lunch Medicine', 
      dosage: 1,
      pouchColor: 'blue',
      description: 'Medicine from Blue Pouch taken after lunch.'
    },
    status: 'completed',
  },
  // Additional activities for better filtering demonstration
  {
    id: '16',
    type: 'medicine',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    details: { 
      medicineName: 'Morning Vitamins', 
      dosage: 2,
      pouchColor: 'orange',
      description: 'Morning vitamins from Orange Pouch taken at 7:00 AM.'
    },
    status: 'completed',
  },
  {
    id: '17',
    type: 'call',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    details: { 
      contactName: 'Maya', 
      duration: '15 minutes',
      description: 'Called Maya (neighbor) for daily check-in.'
    },
    status: 'completed',
  },
  {
    id: '18',
    type: 'companion',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    details: { 
      activityType: 'weather',
      description: 'Asked about today\'s weather forecast for Kathmandu.'
    },
    status: 'completed',
  },
  {
    id: '19',
    type: 'fall',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    details: { 
      location: 'Kitchen', 
      severity: 'minor',
      description: 'Minor fall detected in kitchen - user confirmed safe.',
      emergencyContact: 'Ram (+977-98XXXXXX)'
    },
    location: { latitude: 27.7172, longitude: 85.3240 },
    status: 'completed',
  },
  {
    id: '20',
    type: 'reminder',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    details: { 
      reminderTitle: 'Water plants',
      description: 'Reminder: Water the plants in the garden.',
      time: '6:00 PM'
    },
    status: 'completed',
  },

  {
    id: '22',
    type: 'medicine',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    details: { 
      medicineName: 'Blood Pressure Medicine', 
      dosage: 1,
      pouchColor: 'white',
      description: 'Blood pressure medicine from White Pouch taken at 8:00 PM.'
    },
    status: 'completed',
  },
  {
    id: '23',
    type: 'call',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    details: { 
      contactName: 'Doctor Sharma', 
      duration: '12 minutes',
      description: 'Called Dr. Sharma for medication consultation.'
    },
    status: 'completed',
  },

  {
    id: '25',
    type: 'reminder',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    details: { 
      reminderTitle: 'Bank visit',
      description: 'Reminder: Visit bank for pension collection.',
      time: '10:00 AM'
    },
    status: 'completed',
  },
  {
    id: '26',
    type: 'medicine',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    details: { 
      medicineName: 'Calcium Tablets', 
      dosage: 1,
      pouchColor: 'pink',
      description: 'Calcium supplement from Pink Pouch taken at 9:00 AM.'
    },
    status: 'completed',
  },
  {
    id: '27',
    type: 'companion',
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    details: { 
      activityType: 'music',
      description: 'Played classic Nepali songs for 45 minutes.'
    },
    status: 'completed',
  },
  {
    id: '28',
    type: 'call',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    details: { 
      contactName: 'Grandson Arjun', 
      duration: '25 minutes',
      description: 'Long conversation with grandson about his studies.'
    },
    status: 'completed',
  },
  {
    id: '29',
    type: 'fall',
    timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
    details: { 
      location: 'Bathroom', 
      severity: 'moderate',
      description: 'Fall detected in bathroom - family notified immediately.',
      emergencyContact: 'Sita (+977-98XXXXXX)'
    },
    location: { latitude: 27.7172, longitude: 85.3240 },
    status: 'completed',
  },

];

export const getRecentActivities = (limit: number = 5): ActivityLog[] => {
  return mockActivities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};