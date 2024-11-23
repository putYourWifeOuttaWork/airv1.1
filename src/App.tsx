import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LegalDrawer from './components/LegalDrawer';
import CookieConsent from './components/CookieConsent';
import { hubspotService } from './services/hubspot';

function App() {
  const location = useLocation();
  const [legalContent, setLegalContent] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms' | null;
  }>({
    isOpen: false,
    type: null,
  });

  // Initialize HubSpot tracking
  useEffect(() => {
    // Track page views in HubSpot
    hubspotService.trackPageView();
  }, [location.pathname]);

  const handleShowPrivacy = () => {
    setLegalContent({ isOpen: true, type: 'privacy' });
  };

  const handleShowTerms = () => {
    setLegalContent({ isOpen: true, type: 'terms' });
  };

  const handleCloseLegal = () => {
    setLegalContent({ isOpen: false, type: null });
  };

  const handleBookClick = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      if (location.pathname !== '/') {
        window.location.href = '/#booking-section';
      } else {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAboutClick = () => {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header onBookClick={handleBookClick} onAboutClick={handleAboutClick} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      <Footer onShowPrivacy={handleShowPrivacy} onShowTerms={handleShowTerms} />
      <CookieConsent onShowPrivacy={handleShowPrivacy} />

      <LegalDrawer
        isOpen={legalContent.isOpen}
        onClose={handleCloseLegal}
        title={legalContent.type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      >
        {legalContent.type === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />}
      </LegalDrawer>
    </div>
  );
}

export default App;