import React, { useState, useEffect } from 'react';
import type { WizardData } from './index';
import InvoiceDraft from '../InvoiceDraft';
import { toast } from 'sonner';

interface Step4Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step4: React.FC<Step4Props> = ({ data, onNext, onBack }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
  }, []);

  const handleSecureDate = async () => {
    setIsSubmitting(true);
    try {
      setShowPaymentForm(true);
      onNext({ paymentStatus: 'completed' });
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotYet = async () => {
    setIsSubmitting(true);
    try {
      onNext({ paymentStatus: 'pending' });
    } catch (error) {
      console.error('Error submitting information:', error);
      toast.error('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
    
    setTimeout(() => {
      onBack();
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Secure this date?</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleSecureDate}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg
                hover:from-sky-500 hover:to-blue-600 transition shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Yes!'}
            </button>
            
            <button
              onClick={handleNotYet}
              disabled={isSubmitting}
              className="w-full border-2 border-gray-300 px-6 py-3 rounded-lg
                hover:bg-gray-50 transition text-gray-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Not Yet'}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            We Will Never Share Your Information. OpenAir uses bank encrypted fields for your financial 
            data and high-fidelity encryption CRM and market software to contact you.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <InvoiceDraft bookingData={data} />
        </div>
      </div>

      <div className="mt-8 pb-10">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Step4;