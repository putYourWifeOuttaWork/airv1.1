import { Handler } from '@netlify/functions';
import { createClient } from '@libsql/client';
import { google } from 'googleapis';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// Initialize Google Calendar API
const calendar = google.calendar('v3');
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar']
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://airbooth.rent',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/calendar/', '');

  try {
    switch (path) {
      case 'check':
        if (event.httpMethod === 'GET') {
          const { date } = event.queryStringParameters || {};
          if (!date) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Date parameter is required' })
            };
          }

          // Check Google Calendar for events on this date
          const response = await calendar.events.list({
            auth,
            calendarId: 'info@openairphotobooth.rentals',
            timeMin: `${date}T00:00:00-04:00`,
            timeMax: `${date}T23:59:59-04:00`,
            singleEvents: true,
            orderBy: 'startTime'
          });

          const events = response.data.items || [];
          const blockedTimes = events.map(event => ({
            start: event.start?.dateTime,
            end: event.end?.dateTime
          }));

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ blockedTimes })
          };
        }
        break;

      case 'create':
        if (event.httpMethod === 'POST') {
          const { bookingId } = JSON.parse(event.body || '{}');
          
          // Get booking details from database
          const result = await db.execute({
            sql: `
              SELECT b.*, t.start_time, t.end_time
              FROM bookings b
              JOIN timeslots t ON b.time_slot = t.id
              WHERE b.id = ?
            `,
            args: [bookingId]
          });

          const booking = result.rows[0];
          if (!booking) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Booking not found' })
            };
          }

          // Create calendar event
          const event = {
            summary: `Photo Booth Booking - ${booking.first_name} ${booking.last_name}`,
            description: `Photo booth rental booking\nEmail: ${booking.email}\nPhone: ${booking.phone}`,
            start: {
              dateTime: `${booking.date}T${booking.start_time}:00`,
              timeZone: 'America/New_York',
            },
            end: {
              dateTime: `${booking.date}T${booking.end_time}:00`,
              timeZone: 'America/New_York',
            },
            attendees: [{ email: booking.email }],
            reminders: {
              useDefault: true,
            },
          };

          const response = await calendar.events.insert({
            auth,
            calendarId: 'info@openairphotobooth.rentals',
            requestBody: event,
          });

          // Update booking with calendar event ID
          await db.execute({
            sql: 'UPDATE bookings SET calendar_event_id = ? WHERE id = ?',
            args: [response.data.id, bookingId]
          });

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Calendar event created successfully' })
          };
        }
        break;

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not found' })
        };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Calendar API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};