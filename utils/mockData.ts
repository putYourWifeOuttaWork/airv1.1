import { addDays, format, parseISO, isAfter, startOfToday } from 'date-fns';
import type { TimeSlot } from './calendar';

// Generate time slots every 30 minutes from 11 AM to 8 PM
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 11; // 11 AM
  const endHour = 20;   // 8 PM

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      const startTime = `${hour === 12 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
      const endHour = (hour + 4) % 24; // 4-hour slots
      const endTime = `${endHour === 12 ? 12 : endHour % 12}:${minute.toString().padStart(2, '0')} ${endHour < 12 ? 'AM' : 'PM'}`;
      
      slots.push({ start: startTime, end: endTime });
    }
  }
  
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Generate some random bookings for the next 30 days
const generateBookedSlots = () => {
  const bookedSlots = new Set<string>();
  const today = startOfToday();
  
  for (let i = 7; i < 37; i++) {
    if (Math.random() > 0.7) { // 30% chance of a day having bookings
      const date = format(addDays(today, i), 'yyyy-MM-dd');
      const randomSlot = Math.floor(Math.random() * TIME_SLOTS.length);
      bookedSlots.add(`${date}_${TIME_SLOTS[randomSlot].start}`);
    }
  }
  
  return bookedSlots;
};

const BOOKED_SLOTS = generateBookedSlots();

export const generateMockTimeSlots = (date: string): TimeSlot[] => {
  // Only generate slots for valid future dates
  const selectedDate = parseISO(date);
  const minDate = addDays(startOfToday(), 7);
  
  if (!isAfter(selectedDate, minDate)) {
    return TIME_SLOTS.map((slot, index) => ({
      id: `slot-${index}`,
      startTime: slot.start,
      endTime: slot.end,
      available: false
    }));
  }

  return TIME_SLOTS.map((slot, index) => ({
    id: `slot-${index}`,
    startTime: slot.start,
    endTime: slot.end,
    available: !BOOKED_SLOTS.has(`${date}_${slot.start}`)
  }));
};