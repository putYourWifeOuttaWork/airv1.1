import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import { format, addDays, startOfToday } from 'date-fns';
import { useCalendar } from '../../hooks/useCalendar';
import ContactModal from './ContactModal';
import type { ContactFormData } from './ContactModal';
import type { TimeSlot } from '../../utils/calendar';
import { toast } from 'sonner';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface Step1Props {
  onNext: (data: { date: Date; location: string; locationDetails: any; timeSlot: string }) => void;
  initialData?: {
    date?: Date;
    location?: string;
    locationDetails?: any;
    timeSlot?: string;
  };
}

const Step1: React.FC<Step1Props> = ({ onNext, initialData }) => {
  const wizardRef = useRef<HTMLDivElement>(null);
  const timeSlotsRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialData?.date || null);
  const [location, setLocation] = useState<any>(
    initialData?.locationDetails ? {
      label: initialData.location,
      value: initialData.locationDetails
    } : null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(initialData?.timeSlot || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { timeSlots, isLoading } = useCalendar(
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  );

  const scrollToElement = (ref: React.RefObject<HTMLDivElement>, center: boolean = false) => {
    if (ref.current) {
      const yOffset = center ? -window.innerHeight / 2 + ref.current.offsetHeight / 2 : -100;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (selectedDate) {
      setTimeout(() => scrollToElement(timeSlotsRef), 100);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTimeSlot) {
      setTimeout(() => scrollToElement(continueButtonRef, true), 100);
    }
  }, [selectedTimeSlot]);

  const validateLocation = async (place: any) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ placeId: place.value.place_id });
      
      if (result.results[0]) {
        const addressComponents = result.results[0].address_components;
        const state = addressComponents.find(component => 
          component.types.includes('administrative_area_level_1')
        );
        
        if (state && state.short_name === 'FL') {
          return true;
        } else {
          toast.error('Please select a location in Florida');
          setLocation(null);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error validating location:', error);
      return false;
    }
  };

  const handleLocationSelect = async (place: any) => {
    const isValid = await validateLocation(place);
    if (isValid) {
      setLocation(place);
    }
  };

  const handleContactSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    setIsModalOpen(false);
    toast.success('Thanks! We\'ll be in touch shortly.');
  };

  const handleNext = () => {
    if (selectedDate && location && selectedTimeSlot) {
      if (wizardRef.current) {
        const yOffset = -100;
        const y = wizardRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      
      setTimeout(() => {
        onNext({
          date: selectedDate,
          location: location.label,
          locationDetails: location.value,
          timeSlot: selectedTimeSlot,
        });
      }, 300);
    }
  };

  return (
    <div ref={wizardRef} className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Location</h3>
            <p className="text-sm text-gray-500 mb-2">Please select a location in Florida</p>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              selectProps={{
                value: location,
                onChange: handleLocationSelect,
                placeholder: 'Enter location in Florida',
                styles: {
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '0.5rem',
                    borderColor: '#D1D5DB',
                    '&:hover': {
                      borderColor: '#93C5FD'
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                    color: '#1F2937'
                  })
                }
              }}
              autocompletionRequest={{
                componentRestrictions: { country: 'us' },
                types: ['address']
              }}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Select Date</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={addDays(startOfToday(), 7)}
              className="w-full rounded-lg shadow-md"
              nextLabel={<ChevronRight className="w-5 h-5" />}
              prevLabel={<ChevronLeft className="w-5 h-5" />}
              next2Label={null}
              prev2Label={null}
            />
          </div>
        </div>

        <div ref={timeSlotsRef}>
          <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
          {isLoading ? (
            <p>Loading available times...</p>
          ) : timeSlots && timeSlots.length > 0 ? (
            <div className="time-slots-container">
              {timeSlots.map((slot: TimeSlot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot.startTime)}
                  disabled={!slot.available}
                  className={`w-full p-3 mb-2 rounded-lg border transition-all ${
                    selectedTimeSlot === slot.startTime
                      ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-md'
                      : slot.available
                      ? 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/50'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No available slots for this date</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sky-600 hover:text-sky-700"
              >
                Can't find a slot? Have Us Call You!
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedDate && location && selectedTimeSlot && (
        <div ref={continueButtonRef} className="mt-8 text-center">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-8 py-3 rounded-full hover:from-sky-500 hover:to-blue-600 transition shadow-lg"
          >
            Continue
          </button>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
};

export default Step1;