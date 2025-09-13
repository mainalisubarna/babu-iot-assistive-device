import { MedicineReminder } from '../types';

export const mockMedicineSchedule: MedicineReminder[] = [
  {
    id: '1',
    medicineName: 'Aspirin',
    colorPouch: 'red',
    dosage: 1,
    times: ['08:00', '20:00'],
    voiceInstructions: 'रातो झोलाबाट एक गोली लिनुहोस्',
  },
  {
    id: '2',
    medicineName: 'Vitamin D',
    colorPouch: 'blue',
    dosage: 2,
    times: ['12:00'],
    voiceInstructions: 'निलो झोलाबाट दुई गोली लिनुहोस्',
  },
  {
    id: '3',
    medicineName: 'Blood Pressure',
    colorPouch: 'green',
    dosage: 1,
    times: ['06:00', '18:00'],
    voiceInstructions: 'हरियो झोलाबाट एक गोली लिनुहोस्',
  },
  {
    id: '4',
    medicineName: 'Diabetes',
    colorPouch: 'yellow',
    dosage: 1,
    times: ['07:00', '19:00'],
    voiceInstructions: 'पहेंलो झोलाबाट एक गोली लिनुहोस्',
  },
  {
    id: '5',
    medicineName: 'Calcium',
    colorPouch: 'purple',
    dosage: 2,
    times: ['09:00', '21:00'],
    voiceInstructions: 'बैजनी झोलाबाट दुई गोली लिनुहोस्',
  },
  {
    id: '6',
    medicineName: 'Heart Medicine',
    colorPouch: 'orange',
    dosage: 1,
    times: ['10:00', '22:00'],
    voiceInstructions: 'सुन्तला झोलाबाट एक गोली लिनुहोस्',
  },
];

export const getNextMedicine = (): MedicineReminder | null => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  let nextMedicine: MedicineReminder | null = null;
  let nextTime = Infinity;
  
  for (const medicine of mockMedicineSchedule) {
    for (const timeStr of medicine.times) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const medicineTime = hours * 60 + minutes;
      
      // If medicine time is later today
      if (medicineTime > currentTime && medicineTime < nextTime) {
        nextTime = medicineTime;
        nextMedicine = medicine;
      }
    }
  }
  
  // If no medicine found for today, get first medicine of tomorrow
  if (!nextMedicine && mockMedicineSchedule.length > 0) {
    nextMedicine = mockMedicineSchedule[0];
  }
  
  return nextMedicine;
};

export const getNextMedicineTime = (): string => {
  const nextMedicine = getNextMedicine();
  if (!nextMedicine) return '';
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  for (const timeStr of nextMedicine.times) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const medicineTime = hours * 60 + minutes;
    
    if (medicineTime > currentTime) {
      return timeStr;
    }
  }
  
  // Return first time of the day if no time found for today
  return nextMedicine.times[0];
};