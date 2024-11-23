import { apiService } from './api';
import type { TimeSlot } from './api';

const CALENDAR_ID = 'info@openairphotobooth.rentals';

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
    
    if (!this.initPromise) {
      this.initPromise = new Promise<boolean>((resolve) => {
        try {
          gapi.load('client:auth2', async () => {
            try {
              await gapi.client.init({
                apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                clientId: '720919814468-8p7n778egbmlsc4c0pkf2r5u5ppi5qdh.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/calendar.events',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
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

  async createCalendarEvent(booking: {
    date: string;
    timeSlot: TimeSlot;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    try {
      const initialized = await this.init();
      if (!initialized) {
        throw new Error('Google Calendar not initialized');
      }

      const [startHour, startMinute] = booking.timeSlot.startTime.split(':');
      const [endHour, endMinute] = booking.timeSlot.endTime.split(':');

      const startTime = new Date(booking.date);
      startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endTime = new Date(booking.date);
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const event = {
        summary: `Photo Booth Booking - ${booking.firstName} ${booking.lastName}`,
        description: `Photo booth rental booking for ${booking.firstName} ${booking.lastName}\nEmail: ${booking.email}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/New_York'
        },
        attendees: [{ email: booking.email }],
        reminders: {
          useDefault: true
        }
      };

      await gapi.client.calendar.events.insert({
        calendarId: CALENDAR_ID,
        resource: event
      });
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }
}

export const googleCalendarService = GoogleCalendarService.getInstance();