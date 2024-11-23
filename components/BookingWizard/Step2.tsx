import React, { useState } from 'react';
import type { WizardData } from './index';
import { hubspotService } from '../../services/hubspot';
import { toast } from 'sonner';

interface Step2Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ data, onNext, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    phone: data.phone || '',
    email: data.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Create HubSpot contact with all required fields
      await hubspotService.createContact({
        ...formData,
        location: data.location,
        date: data.date,
        timeSlot: data.timeSlot
      });

      // Proceed to next step
      onNext(formData);
      toast.success('Information saved successfully!');
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-8">
        Great! Now, where should we send your quote?
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              disabled={isSubmitting}
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 disabled:opacity-50"
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              disabled={isSubmitting}
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 disabled:opacity-50"
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            disabled={isSubmitting}
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 disabled:opacity-50"
            pattern="[\d\s-+()]{10,}"
            title="Please enter a valid phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 disabled:opacity-50"
          />
        </div>

        <div className="flex justify-between pt-6 pb-10">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-32 h-10 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-32 h-10 flex items-center justify-center bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-md hover:from-sky-500 hover:to-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;