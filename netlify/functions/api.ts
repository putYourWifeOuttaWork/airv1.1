import { Handler } from '@netlify/functions';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

export const handler: Handler = async (event) => {
  // CORS headers for security
  const headers = {
    'Access-Control-Allow-Origin': 'https://airbooth.rent',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Route handling based on path
    const path = event.path.replace('/.netlify/functions/api/', '');

    switch (path) {
      case 'timeslots':
        if (event.httpMethod === 'GET') {
          const { date } = event.queryStringParameters || {};
          if (!date) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Date parameter is required' })
            };
          }

          const result = await db.execute({
            sql: `
              SELECT 
                id,
                date,
                start_time as startTime,
                end_time as endTime,
                available
              FROM timeslots 
              WHERE date = ?
              ORDER BY start_time
            `,
            args: [date]
          });

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.rows)
          };
        }
        break;

      case 'bookings':
        if (event.httpMethod === 'POST') {
          const booking = JSON.parse(event.body || '{}');
          
          // Validate booking data
          if (!booking.date || !booking.timeSlot || !booking.email) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Missing required booking information' })
            };
          }

          // Start a transaction
          await db.execute('BEGIN TRANSACTION');

          try {
            // Check if time slot is still available
            const slotResult = await db.execute({
              sql: 'SELECT available FROM timeslots WHERE id = ? AND date = ?',
              args: [booking.timeSlot, booking.date]
            });

            if (!slotResult.rows[0] || !slotResult.rows[0].available) {
              throw new Error('Time slot is no longer available');
            }

            // Mark time slot as unavailable
            await db.execute({
              sql: 'UPDATE timeslots SET available = false WHERE id = ?',
              args: [booking.timeSlot]
            });

            // Insert booking
            await db.execute({
              sql: `
                INSERT INTO bookings (
                  date, time_slot, email, first_name, last_name, phone, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
              args: [
                booking.date,
                booking.timeSlot,
                booking.email,
                booking.firstName || '',
                booking.lastName || '',
                booking.phone || '',
                'pending'
              ]
            });

            await db.execute('COMMIT');

            return {
              statusCode: 201,
              headers,
              body: JSON.stringify({ message: 'Booking created successfully' })
            };
          } catch (error) {
            await db.execute('ROLLBACK');
            throw error;
          }
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
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    };
  }
};