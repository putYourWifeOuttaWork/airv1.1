import { Handler } from '@netlify/functions';

const HUBSPOT_ACCESS_TOKEN = process.env.VITE_HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';

const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phoneNumber;
};

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  if (!HUBSPOT_ACCESS_TOKEN) {
    console.error('HubSpot access token not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'HubSpot access token not configured' })
    };
  }

  try {
    const { contactData } = JSON.parse(event.body || '{}');

    if (!contactData?.email || !contactData?.firstName || !contactData?.lastName || !contactData?.phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    let eventDate = '';
    let eventTime = '';
    
    if (contactData.date && contactData.timeSlot) {
      const [time, period] = contactData.timeSlot.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      const dateTime = new Date(contactData.date);
      dateTime.setHours(hour, parseInt(minutes), 0, 0);

      eventDate = dateTime.toISOString().split('T')[0];
      eventTime = dateTime.toISOString();
    }

    const properties = {
      email: contactData.email.trim(),
      firstname: contactData.firstName.trim(),
      lastname: contactData.lastName.trim(),
      phone: formatPhoneNumber(contactData.phone.trim()),
      last_event_location: contactData.location?.trim() || '',
      last_event_date: eventDate,
      last_event_time: eventTime,
      hubspot_owner_id: '49154975'
    };

    const response = await fetch(HUBSPOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({ properties })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('HubSpot API error:', data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          message: data.message || 'Failed to create contact in HubSpot',
          error: data 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Internal server error',
        error: error instanceof Error ? error.stack : 'Unknown error'
      })
    };
  }
};