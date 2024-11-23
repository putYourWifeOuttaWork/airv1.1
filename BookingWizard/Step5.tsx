import React from 'react';
import type { WizardData } from './index';
import { ChevronDown } from 'lucide-react';

interface Step5Props {
  data: WizardData;
  onRestart: () => void;
}

const Step5: React.FC<Step5Props> = ({ data, onRestart }) => {
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('about-section');
    
    if (reviewsSection) {
      const sectionTop = reviewsSection.offsetTop;
      const sectionHeight = reviewsSection.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTo = sectionTop - (windowHeight - sectionHeight) / 2;
      
      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });

      // After scrolling to reviews, go back to step 1 without clearing data
      setTimeout(() => {
        onRestart();
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        {data.paymentStatus === 'completed' 
          ? "Thanks for your payment!" 
          : "Thanks for your interest!"}
      </h2>
      
      <p className="text-xl text-gray-600 mb-6">
        {data.paymentStatus === 'completed'
          ? "Your booking is confirmed! We'll send you a confirmation email shortly."
          : "We'll be in touch shortly."}
      </p>
      
      <p className="text-lg text-gray-500 mb-16 bg-gray-100 py-3 rounded-lg">
        Our team usually calls you directly within 1 business day.
      </p>

      <div className="flex flex-col items-center">
        <button
          onClick={scrollToReviews}
          className="text-lg text-gray-600 hover:text-gray-800 transition flex flex-col items-center"
        >
          <span className="mb-4">See what our customers say about us!</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default Step5;