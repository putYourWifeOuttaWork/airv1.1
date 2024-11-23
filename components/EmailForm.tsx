import React from 'react';
import { Mail } from 'lucide-react';

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ email, setEmail, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-6 py-4 rounded-full border-0 bg-white/90 backdrop-blur-sm 
            focus:outline-none focus:ring-2 focus:ring-purple-300 pl-12 text-gray-800
            placeholder:text-gray-500 shadow-xl"
          required
        />
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {email && (
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
              bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
              px-6 py-2 rounded-full hover:from-indigo-600 hover:to-purple-600 
              transition shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        )}
      </div>
    </form>
  );
}

export default EmailForm;