import React, { useState, useEffect } from 'react';
import type { BookingData, Equipment } from '../App';
import { ChevronRight } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { isDateValid } from '../utils/calendar';
import { useCalendar } from '../hooks/useCalendar';
import { toast } from 'sonner';

interface BookingFormProps {
  onUpdateBooking: (data: BookingData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onUpdateBooking }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingData & { location: string }>({
    date: '',
    time: '',
    location: '',
    equipment: {
      canonBooth: true,
      customFrame: false,
      extraLogos: 0,
      customBackdrop: false,
      partySwag: false,
      printer: false,
      extraRolls: 0,
      gifSetting: false,
      photographer: false,
      photographerHours: 4,
      outdoorCovered: false,
      handSignal: false
    },
    totalCost: 500
  });

  const { timeSlots, isLoading, error, reserve, isDateAvailable } = useCalendar(formData.date);
  const minDate = format(addDays(startOfToday(), 7), 'yyyy-MM-dd');

  const calculateTotal = (equipment: Equipment): number => {
    let total = 500;
    if (equipment.customFrame) total += 100;
    total += equipment.extraLogos * 25;
    if (equipment.customBackdrop) total += 200;
    if (equipment.partySwag) total += 150;
    if (equipment.printer) total += 400;
    total += equipment.extraRolls * 200;
    if (equipment.photographer) {
      total += 300;
      if (equipment.photographerHours > 4) {
        total += (equipment.photographerHours - 4) * 120;
      }
    }
    if (equipment.outdoorCovered) total += 300;
    if (equipment.handSignal) total -= 200;
    return total;
  };

  const handleDateChange = async (date: string) => {
    if (!isDateValid(date)) {
      toast.error('Please select a date at least 7 days in the future');
      return;
    }

    setFormData(prev => ({
      ...prev,
      date,
      time: ''
    }));
  };

  const handleTimeSelect = async (slotId: string) => {
    try {
      await reserve({ date: formData.date, slotId });
      const selectedSlot = timeSlots?.find(slot => slot.id === slotId);
      if (selectedSlot) {
        setFormData(prev => ({
          ...prev,
          time: selectedSlot.startTime
        }));
        if (step === 2) setStep(3);
      }
    } catch (error) {
      console.error('Failed to reserve time slot:', error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: newLocation
    }));
    if (newLocation && step === 1) setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'date') {
      handleDateChange(value);
      return;
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        equipment: {
          ...prev.equipment,
          [name]: type === 'checkbox' ? checked : 
                  type === 'number' ? Number(value) : value
        }
      };

      if (name === 'time' || name === 'location') {
        newData[name as keyof typeof newData] = value;
      }

      const totalCost = calculateTotal(newData.equipment);
      return { ...newData, totalCost };
    });
  };

  useEffect(() => {
    onUpdateBooking(formData);
  }, [formData, onUpdateBooking]);

  return (
    <form className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Step 1: Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Enter event location"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors"
            required
          />
        </div>

        {/* Step 2: Date */}
        {step >= 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              min={minDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors"
            />
            {isDateAvailable === false && (
              <p className="mt-2 text-sm text-red-500">This date is not available</p>
            )}
          </div>
        )}

        {/* Step 3: Time Slot */}
        {step >= 2 && formData.date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading available time slots...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Failed to load time slots</p>
            ) : timeSlots?.length === 0 ? (
              <p className="text-sm text-red-500">No available time slots for this date</p>
            ) : (
              <div className="space-y-2">
                {timeSlots?.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleTimeSelect(slot.id)}
                    disabled={!slot.available}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formData.time === slot.startTime
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : slot.available
                        ? 'border-gray-300 hover:border-sky-300 hover:bg-sky-50'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    } transition-colors`}
                  >
                    {`${slot.startTime} - ${slot.endTime}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Equipment Selection */}
        {step >= 3 && (
          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-medium text-gray-900">Equipment Selection</h3>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="customFrame"
                  checked={formData.equipment.customFrame}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-sm text-gray-700">Custom Frame with Logo ($100)</label>
              </div>

              {formData.equipment.customFrame && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Number of Extra Logos ($25 each)</label>
                  <input
                    type="number"
                    name="extraLogos"
                    min="0"
                    max="25"
                    value={formData.equipment.extraLogos}
                    onChange={handleChange}
                    className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="customBackdrop"
                checked={formData.equipment.customBackdrop}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-sm text-gray-700">Custom Backdrop ($200)</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="partySwag"
                checked={formData.equipment.partySwag}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-sm text-gray-700">Custom Party Fun Swag ($150)</label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="printer"
                  checked={formData.equipment.printer}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-sm text-gray-700">Printer - 100 Shots ($400)</label>
              </div>

              {formData.equipment.printer && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Extra Rolls ($200 each)</label>
                  <input
                    type="number"
                    name="extraRolls"
                    min="0"
                    max="5"
                    value={formData.equipment.extraRolls}
                    onChange={handleChange}
                    className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="gifSetting"
                checked={formData.equipment.gifSetting}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-sm text-gray-700">GIF Setting (Free)</label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="photographer"
                  checked={formData.equipment.photographer}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-sm text-gray-700">Additional Pro-Photographer ($300 for 4 hours)</label>
              </div>

              {formData.equipment.photographer && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Total Hours ($120/hour after 4 hours)</label>
                  <input
                    type="number"
                    name="photographerHours"
                    min="4"
                    value={formData.equipment.photographerHours}
                    onChange={handleChange}
                    className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="outdoorCovered"
                checked={formData.equipment.outdoorCovered}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-sm text-gray-700">Outdoor Covered Area ($300)</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="handSignal"
                checked={formData.equipment.handSignal}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-sm text-gray-700">Hand-Signal Trigger (-$200 savings)</label>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default BookingForm;