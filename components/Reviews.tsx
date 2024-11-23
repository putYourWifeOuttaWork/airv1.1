import React from 'react';

interface ReviewsProps {
  onBookClick?: () => void;
}

const Reviews: React.FC<ReviewsProps> = ({ onBookClick }) => {
  const reviews = [
    {
      venue: 'MainStreet Craftfairs Cocoa',
      text: 'Definitely a 5 STAR vendor. The Picture quality is amazing and their digital delivery is instant! Our young guests LOVE that! I will use again!! Thank you OpenAir Photobooths for making our events always a success!!!',
    },
    {
      venue: 'Winebar Downtown - Orlando',
      text: 'We were able to customize our package to fit our needs. Andy has been super helpful and responsive from the beginning. Even when we were up in the air about moving our wedding date, he was there to still work with us on the new date, even though it wasn\'t set in stone. Our guests LOVED the services and we love the pictures. Everyone had a great time. The attendant was so sweet and friendly!',
    },
    {
      venue: 'Wedding at the Oakmont',
      text: 'We had the opportunity of booking Photobooths for our wedding this past September. Our photo booth attendant, Tiffani, arrived early to set up the photo booth in the designated area. She sanitized all the surfaces and put out hand sanitizer for our guests to use before and after using the photo booth.',
    },
  ];

  return (
    <section className="curved-section relative py-32 px-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          What People Say About Us
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="font-semibold text-xl mb-4 text-gray-800">{review.venue}</h3>
              <p className="text-gray-600 italic">{review.text}</p>
            </div>
          ))}
        </div>

        {onBookClick && (
          <div className="text-center mt-16">
            <button
              id="reviews-book-now-button"
              onClick={onBookClick}
              className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-8 py-4 rounded-full
                hover:from-sky-500 hover:to-blue-600 transition shadow-lg text-lg font-medium"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;