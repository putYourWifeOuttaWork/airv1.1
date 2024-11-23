import { z } from 'zod';

const API_BASE_URL = '/.netlify/functions/api';

// Validation schemas
const TimeSlotSchema = z.object({
  id: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  available: z.boolean()
});

const BookingSchema = z.object({
  date: z.string(),
  timeSlot: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string()
});

export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type Booking = z.infer<typeof BookingSchema>;

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async getTimeSlots(date: string): Promise<TimeSlot[]> {
    const response = await this.fetchApi<TimeSlot[]>(`timeslots?date=${date}`);
    return response.map(slot => TimeSlotSchema.parse(slot));
  }

  async createBooking(booking: Booking): Promise<{ message: string }> {
    // Validate booking data before sending
    BookingSchema.parse(booking);

    return this.fetchApi<{ message: string }>('bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  }
}

export const apiService = ApiService.getInstance();