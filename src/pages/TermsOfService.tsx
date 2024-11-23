import React from 'react';

function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 italic mb-8">
          Last Updated: November 21, 2024
        </p>

        <h3 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h3>
        <p className="text-gray-600 mb-8">
          By accessing or using{' '}
          <strong>
            OpenAir PhotoBooth Rentals ("Forrest & Grimes", "Openair", "we",
            "our", "us")
          </strong>
          's photobooth rental services ("Services"), you agree to be bound by
          these Terms of Service ("Terms"). If you disagree with any part of
          these terms, you may not access our Services.
        </p>

        <h3 className="text-2xl font-semibold mb-4">2. Service Description</h3>

        <h4 className="text-xl font-semibold mb-3">
          2.1 Photobooth Rental Services
        </h4>
        <ul className="list-disc list-inside mb-6 text-gray-600">
          <li>Online booking system</li>
          <li>Digital photo delivery</li>
          <li>Event photography services</li>
          <li>Equipment rental</li>
          <li>Support services</li>
        </ul>

        <h4 className="text-xl font-semibold mb-3">2.2 Digital Platform</h4>
        <ul className="list-disc list-inside mb-8 text-gray-600">
          <li>Booking management</li>
          <li>Payment processing</li>
          <li>Photo storage and sharing</li>
          <li>Account management</li>
          <li>Customer support</li>
        </ul>

        {/* Continue with all other sections following the same pattern */}

        <h3 className="text-2xl font-semibold mb-4">11. Contact Information</h3>
        <p className="text-gray-600 mb-4">For questions about these Terms:</p>
        <ul className="list-disc list-inside mb-8 text-gray-600">
          <li>Company: OpenAir Photobooth Rentals</li>
          <li>Address: 12 Sunrise St. Cocoa FL, 32922</li>
          <li>Email: info@openairphotobooth.rentals</li>
          <li>Support Hours: 24/7/365</li>
        </ul>

        <p className="text-gray-600 font-bold">
          Last Updated: November 21, 2024
        </p>
        <p className="text-gray-600 italic">
          These terms are subject to change. Please review periodically.
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
