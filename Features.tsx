import React from 'react';

const Features = () => {
  const features = [
    {
      multiplier: '1X',
      title: 'Event Engagement',
      description: 'Participants enjoy fun, memorable experiences with your brand.',
      color: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      buttonClass: 'border-indigo-400 text-indigo-500 hover:bg-indigo-50',
    },
    {
      multiplier: '2X',
      title: 'Lead Generation',
      description: 'Turn on Data Capture to grow your list of contacts with every photo sent.',
      color: 'bg-gradient-to-br from-teal-400 to-teal-600',
      buttonClass: 'border-teal-400 text-teal-500 hover:bg-teal-50',
    },
    {
      multiplier: '3X',
      title: 'Photo Sharing',
      description: 'Photos get shared via messages, email and to social media with your branding.',
      color: 'bg-gradient-to-br from-coral-400 to-coral-600',
      buttonClass: 'border-coral-400 text-coral-500 hover:bg-coral-50',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-sky-500 font-medium mb-4">WHY IT WORKS</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Every photo generates 3x more value<br />
          than traditional marketing
        </h3>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Photo marketing goes beyond putting your logo on a photo. Our platform enables businesses to create real-life experiences that get participants engaged and excited to share your brand.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="rounded-2xl p-8 bg-white shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg`}>
              <span className="text-white text-xl font-bold">{feature.multiplier}</span>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h4>
            <p className="text-gray-600 mb-6">{feature.description}</p>
            <button 
              className={`w-full py-3 px-6 rounded-full border-2 font-medium transition-colors duration-200 ${feature.buttonClass}`}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;