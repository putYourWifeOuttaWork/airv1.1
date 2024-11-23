import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onBookClick?: () => void;
  onAboutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBookClick, onAboutClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookClick = () => {
    if (location.pathname === '/') {
      // If we're on the home page, just scroll to booking
      onBookClick?.();
    } else {
      // If we're on another page, navigate to home and then scroll to booking
      navigate('/', { state: { scrollToBooking: true } });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 header-blur z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className={`flex items-center space-x-2 md:space-x-8 transition-opacity duration-300 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <a 
            href="/"
            className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition"
          >
            <Camera className="w-4 h-4 md:w-6 md:h-6" />
            <span className="font-semibold text-sm md:text-lg">OpenAir Photobooths</span>
          </a>
          
          <nav className="hidden md:flex space-x-6">
            <a 
              href="/"
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Home
            </a>
            <button 
              onClick={onAboutClick}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              About Us
            </button>
          </nav>
        </div>
        
        <button
          onClick={handleBookClick}
          className={`bg-gradient-to-r from-sky-500 to-blue-500 text-white px-3 py-1.5 md:px-6 md:py-2 rounded-full
            text-sm md:text-base hover:from-sky-600 hover:to-blue-600 transition shadow-lg hover:shadow-xl ml-auto ${
              isScrolled ? 'translate-x-0' : ''
            }`}
        >
          Book The Booth
        </button>
      </div>
    </header>
  );
};

export default Header;