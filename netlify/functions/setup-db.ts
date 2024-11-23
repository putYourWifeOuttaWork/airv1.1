import { Handler } from '@netlify/functions';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

const schema = `
-- Time slots table
CREATE TABLE IF NOT EXISTS timeslots (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (time_slot) REFERENCES timeslots(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_timeslots_date ON timeslots(date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);

-- Insert default time slots for testing
INSERT OR IGNORE INTO timeslots (date, start_time, end_time, available)
VALUES 
  ('2024-03-25', '10:00 AM', '2:00 PM', true),
  ('2024-03-25', '2:00 PM', '6:00 PM', true),
  ('2024-03-25', '6:00 PM', '10:00 PM', true),
  ('2024-03-26', '10:00 AM', '2:00 PM', true),
  ('2024-03-26', '2:00 PM', '6:00 PM', true),
  ('2024-03-26', '6:00 PM', '10:00 PM', true);
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await db.execute(statement + ';');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database initialized successfully' })
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to initialize database' })
    };
  }
};