import { MedicineReminder } from '../types';
import { mockMedicineSchedule, getNextMedicine, getNextMedicineTime } from '../data/mockMedicine';

export const medicineService = {
  getSchedule: async (): Promise<MedicineReminder[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockMedicineSchedule;
  },

  getNextMedicine: async (): Promise<{ medicine: MedicineReminder | null; time: string; todaysMedicines: MedicineReminder[] }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const medicine = getNextMedicine();
    const time = getNextMedicineTime();
    const todaysMedicines = mockMedicineSchedule; // In real app, filter by today's date
    return { medicine, time, todaysMedicines };
  },
};