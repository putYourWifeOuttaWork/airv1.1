import { addDays, format, isAfter, startOfToday, parseISO } from 'date-fns';
import { generateMockTimeSlots } from './mockData';
import { toast } from 'sonner';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

// Using mock data by default until API is properly configured
const USE_MOCK_DATA = true;

export const getAvailableTimeSlots = async (date: string): Promise<TimeSlot[]> => {
  if (USE_MOCK_DATA) {
    return generateMockTimeSlots(date);
  }
  
  // Real implementation would go here once API is enabled
  return generateMockTimeSlots(date);
};

export const isDateValid = (date: string): boolean => {
  if (!date) return false;
  const selectedDate = parseISO(date);
  const minDate = addDays(startOfToday(), 7);
  return isAfter(selectedDate, minDate);
};

export const checkDateAvailability = async (date: string): Promise<boolean> => {
  try {
    const slots = await getAvailableTimeSlots(date);
    return slots.some(slot => slot.available);
  } catch (error) {
    console.error('Error checking date availability:', error);
    return false;
  }
};

export const reserveTimeSlot = async (date: string, slotId: string): Promise<boolean> => {
  try {
    const slots = await getAvailableTimeSlots(date);
    const slot = slots.find(s => s.id === slotId);
    
    if (!slot || !slot.available) {
      throw new Error('Time slot is not available');
    }

    // In mock mode, we'll simulate a successful reservation
    toast.success('Time slot reserved successfully');
    return true;
  } catch (error) {
    console.error('Error reserving time slot:', error);
    throw new Error('Failed to reserve time slot');
  }
};