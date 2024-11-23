import React from 'react';

interface CookieConsentProps {
  onShowPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onShowPrivacy }) => {
  return (
    <button
      type="button"
      onClick={onShowPrivacy}
      className="fixed bottom-2 left-2 z-50 bg-[#0b7ad2] border border-[#0b7ad2] 
        rounded text-white text-xs px-3 py-1.5 hover:bg-[#096abc] transition-colors
        shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0b7ad2] focus:ring-offset-1
        font-normal text-left"
      style={{ textShadow: 'none' }}
    >
      Cookie Settings
    </button>
  );
};

export default CookieConsent;