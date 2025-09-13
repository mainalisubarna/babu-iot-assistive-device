export interface Reminder {
  id: string;
  title: string;
  scheduledTime: Date;
  type: 'appointment' | 'personal' | 'medicine';
  completed: boolean;
}

export const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Doctor Appointment',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    type: 'appointment',
    completed: false,
  },
  {
    id: '2',
    title: 'Call daughter',
    scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    type: 'personal',
    completed: false,
  },
  {
    id: '3',
    title: 'Take evening walk',
    scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    type: 'personal',
    completed: false,
  },
  {
    id: '4',
    title: 'Blood test at clinic',
    scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    type: 'appointment',
    completed: false,
  },
  {
    id: '5',
    title: 'Buy groceries',
    scheduledTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    type: 'personal',
    completed: false,
  },
  {
    id: '6',
    title: 'Physical therapy session',
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    type: 'appointment',
    completed: false,
  },
  {
    id: '7',
    title: 'Call son for birthday',
    scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    type: 'personal',
    completed: false,
  },
  {
    id: '8',
    title: 'Dentist checkup',
    scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    type: 'appointment',
    completed: false,
  },
];

export const getNextReminder = (): Reminder | null => {
  const now = new Date();
  const upcomingReminders = mockReminders
    .filter(reminder => !reminder.completed && reminder.scheduledTime > now)
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  
  return upcomingReminders.length > 0 ? upcomingReminders[0] : null;
};