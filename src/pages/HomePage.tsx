import React from 'react';
import BookingWizard from '../components/BookingWizard';
import Reviews from '../components/Reviews';

function HomePage() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-sky-400 via-sky-200 to-blue-100">
      {/* Hero Section */}
      <section className="wave-section relative min-h-[90vh] flex items-center justify-center px-4 py-16">
        <div className="section-content max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight leading-tight">
            Capture the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Magic
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Airtight photo booth experiences for your special events
          </p>
          <button
            onClick={scrollToBooking}
            className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-8 py-4 rounded-full
              hover:from-sky-500 hover:to-blue-600 transition shadow-lg text-lg font-medium"
          >
            Tell Us About Your Event
          </button>
        </div>

        <div className="custom-shape-divider-bottom">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="bg-white relative py-24">
        <div className="max-w-7xl mx-auto px-4">
          <BookingWizard />
        </div>
        <div className="custom-shape-divider-bottom">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="about-section"
        className="bg-gradient-radial from-sky-400 via-sky-200 to-blue-100 relative"
      >
        <div className="custom-shape-divider-top">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
        <Reviews onBookClick={scrollToBooking} />
      </section>
    </div>
  );
}

export default HomePage;
