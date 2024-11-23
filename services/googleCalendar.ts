import type { TimeSlot } from '../utils/calendar';
import { generateMockTimeSlots } from '../utils/mockData';

const CALENDAR_ID = 'info@openairphotobooth.rentals';
const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID;

// Use mock data in development or when API fails
const USE_MOCK_DATA = true;

class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private initialized: boolean = false;
  private initPromise: Promise<boolean> | null = null;

  private constructor() {}

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  private async init(): Promise<boolean> {
    if (this.initialized) return true;
    if (USE_MOCK_DATA) return false;
    
    if (!this.initPromise) {
      this.initPromise = new Promise<boolean>((resolve) => {
        try {
          gapi.load('client', async () => {
            try {
              await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              });
              
              this.initialized = true;
              resolve(true);
            } catch (error) {
              console.error('Error initializing GAPI client:', error);
              resolve(false);
            }
          });
        } catch (error) {
          console.error('Error loading GAPI:', error);
          resolve(false);
        }
      });
    }

    return this.initPromise;
  }

  async getAvailableSlots(date: string): Promise<TimeSlot[]> {
    if (USE_MOCK_DATA) {
      return generateMockTimeSlots(date);
    }

    try {
      const initialized = await this.init();
      if (!initialized) {
        console.warn('Using mock data - Calendar service not initialized');
        return generateMockTimeSlots(date);
      }

      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      const response = await gapi.client.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.result.items || [];

      // Define available time slots (4-hour blocks)
      const timeSlots = [
        { start: '10:00 AM', end: '2:00 PM' },
        { start: '12:00 PM', end: '4:00 PM' },
        { start: '2:00 PM', end: '6:00 PM' },
        { start: '4:00 PM', end: '8:00 PM' },
        { start: '6:00 PM', end: '10:00 PM' }
      ];

      return timeSlots.map((slot, index) => {
        const slotStart = new Date(date);
        const [time, period] = slot.start.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        slotStart.setHours(hour, minutes, 0, 0);

        // Check if this time slot overlaps with any existing events
        const isBooked = events.some(event => {
          const eventStart = new Date(event.start.dateTime || event.start.date);
          const eventEnd = new Date(event.end.dateTime || event.end.date);
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(slotEnd.getHours() + 4);

          return (
            (slotStart >= eventStart && slotStart < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (slotStart <= eventStart && slotEnd >= eventEnd)
          );
        });

        return {
          id: `slot-${index}`,
          startTime: slot.start,
          endTime: slot.end,
          available: !isBooked
        };
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return generateMockTimeSlots(date);
    }
  }

  async checkDateAvailability(date: string): Promise<boolean> {
    try {
      const slots = await this.getAvailableSlots(date);
      return slots.some(slot => slot.available);
    } catch (error) {
      console.error('Error checking date availability:', error);
      return true; // Default to available if check fails
    }
  }
}

export const calendarService = GoogleCalendarService.getInstance();