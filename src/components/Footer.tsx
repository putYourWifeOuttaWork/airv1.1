import React from 'react';
import { Camera } from 'lucide-react';

interface FooterProps {
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacy, onShowTerms }) => {
  return (
    <footer className="bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Camera className="w-6 h-6 text-sky-500" />
              <span className="font-semibold text-xl">OpenAir Photobooths</span>
            </div>
            <p className="text-gray-600 mb-4">
              Premium photo booth experiences for your special events. Creating memorable moments that last a lifetime.
            </p>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Where We Operate</h3>
            <p className="text-gray-600">
              OpenAir provides our premium photo booth rental services to events across Orlando and Brevard County. 
              We will travel anywhere in the Florida Peninsula, but charge extra for jobs outside of 1-hour travel time.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={onShowPrivacy}
                  className="text-gray-600 hover:text-sky-500 transition"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onShowTerms}
                  className="text-gray-600 hover:text-sky-500 transition"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="border-t pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} OpenAir Photobooths. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Results Disclaimer: While our photo booth services have helped many businesses enhance their events and 
              marketing efforts, individual results may vary. We do not guarantee specific financial outcomes or 
              marketing results. Success depends on various factors including, but not limited to, event type, 
              audience engagement, and overall marketing strategy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;