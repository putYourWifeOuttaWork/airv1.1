import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 italic mb-8">
          Last Updated: November 21, 2024
        </p>

        <h3 className="text-2xl font-semibold mb-4">1. Introduction</h3>
        <p className="text-gray-600 mb-8">
          At OpenAir Photobooth Rentals ("OpenAir", "we," "us," or "our"), we
          respect your privacy and are committed to protecting your personal
          data. This privacy policy explains how we collect, use, and protect
          your information when you use our photobooth rental services and
          website ("Services").
        </p>

        <h3 className="text-2xl font-semibold mb-4">
          2. Information We Collect
        </h3>

        <h4 className="text-xl font-semibold mb-3">2.1 Personal Information</h4>
        <p className="text-gray-600 mb-6">
          We collect information that you provide directly to us:
        </p>
        <ul className="list-disc list-inside mb-8 text-gray-600">
          <li>Name and contact details</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing and payment information</li>
          <li>Event details and preferences</li>
          <li>Photos and content created using our services</li>
          <li>Marketing preferences</li>
          <li>Communication preferences</li>
          <li>Account login credentials</li>
        </ul>

        {/* Continue with the rest of the sections following the same pattern */}
        <h4 className="text-xl font-semibold mb-3">
          2.2 Automatically Collected Information
        </h4>
        <p className="text-gray-600 mb-4">
          We automatically collect certain information when you use our
          Services:
        </p>
        <ul className="list-disc list-inside mb-8 text-gray-600">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Device information</li>
          <li>Usage data and patterns</li>
          <li>Cookies and similar tracking technologies</li>
          <li>Time zone and location information</li>
        </ul>

        {/* Add all other sections following the same pattern */}

        <h3 className="text-2xl font-semibold mb-4">12. Contact Us</h3>
        <p className="text-gray-600 mb-4">For privacy questions or concerns:</p>
        <ul className="list-disc list-inside mb-8 text-gray-600">
          <li>Email: info@openAirPhotobooth.rentals</li>
          <li>Phone: 201-264-9169</li>
          <li>Address: 12 Sunrise St. Cocoa FL, 32922</li>
        </ul>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
