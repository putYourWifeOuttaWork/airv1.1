import { WizardData } from '../components/BookingWizard';

class HubSpotService {
  private static instance: HubSpotService;

  private constructor() {}

  public static getInstance(): HubSpotService {
    if (!HubSpotService.instance) {
      HubSpotService.instance = new HubSpotService();
    }
    return HubSpotService.instance;
  }

  async createContact(contactData: Partial<WizardData>) {
    if (!contactData.email || !contactData.firstName || !contactData.lastName || !contactData.phone) {
      throw new Error('Missing required contact information');
    }

    try {
      const response = await fetch('/.netlify/functions/create-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contactData })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create contact');
      }

      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create contact: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while creating the contact');
    }
  }

  trackPageView() {
    if (typeof window !== 'undefined' && window._hsq) {
      window._hsq.push(['trackPageView']);
    }
  }
}

export const hubspotService = HubSpotService.getInstance();