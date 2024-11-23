import React, { useRef } from 'react';
import type { WizardData } from './index';
import InvoiceDraft from '../InvoiceDraft';

interface Step3Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ data, onNext, onBack }) => {
  const invoiceDraftRef = useRef<HTMLDivElement>(null);
  const [equipment, setEquipment] = React.useState({
    canonBooth: true,
    customFrame: data.equipment?.customFrame || false,
    extraLogos: data.equipment?.extraLogos || 0,
    customBackdrop: data.equipment?.customBackdrop || false,
    partySwag: data.equipment?.partySwag || false,
    printer: data.equipment?.printer || false,
    extraRolls: data.equipment?.extraRolls || 0,
    gifSetting: data.equipment?.gifSetting || false,
    photographer: data.equipment?.photographer || false,
    photographerHours: data.equipment?.photographerHours || 4,
    outdoorCovered: data.equipment?.outdoorCovered || false,
    extraTime: data.equipment?.extraTime || false,
    extraTimeHours: data.equipment?.extraTimeHours || 4,
    isVeteran: data.equipment?.isVeteran || false,
    isNonProfit: data.equipment?.isNonProfit || false,
  });

  // Rest of the component remains exactly the same...
  const calculateTotal = () => {
    let total = 500; // Base price
    if (equipment.customFrame) total += 100;
    if (equipment.extraLogos) total += equipment.extraLogos * 25;
    if (equipment.customBackdrop) total += 200;
    if (equipment.partySwag) total += 150;
    if (equipment.printer) {
      total += 400;
      if (equipment.extraRolls) total += equipment.extraRolls * 200;
    }
    if (equipment.photographer) {
      total += 300;
      if (equipment.photographerHours > 4) {
        total += (equipment.photographerHours - 4) * 120;
      }
    }
    if (equipment.outdoorCovered) total += 300;
    if (equipment.extraTime) {
      const extraHours = equipment.extraTimeHours - 4;
      if (extraHours > 0) {
        const firstThreeHours = Math.min(extraHours, 3) * 120;
        const remainingHours = Math.max(extraHours - 3, 0) * 200;
        total += firstThreeHours + remainingHours;
      }
    }

    // Apply discounts
    if (equipment.isVeteran && equipment.isNonProfit) {
      total *= 0.65; // 35% off
    } else if (equipment.isVeteran || equipment.isNonProfit) {
      total *= 0.75; // 25% off
    }

    return total;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setEquipment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const scrollToInvoice = () => {
    if (invoiceDraftRef.current) {
      const yOffset = -100;
      const y = invoiceDraftRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    // Scroll to top of wizard before proceeding
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
    
    // Small delay to allow smooth scrolling before transition
    setTimeout(() => {
      onNext({
        equipment,
        totalCost: calculateTotal()
      });
    }, 300);
  };

  const handleBack = () => {
    // Scroll to top of wizard before going back
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
    
    // Small delay to allow smooth scrolling before transition
    setTimeout(() => {
      onBack();
    }, 300);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Customize Your Options</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="customFrame"
                  checked={equipment.customFrame}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-gray-700">Custom Frame with Logo</label>
              </div>

              {equipment.customFrame && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Number of Extra Logos</label>
                  <input
                    type="number"
                    name="extraLogos"
                    min="0"
                    max="25"
                    value={equipment.extraLogos}
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
                checked={equipment.customBackdrop}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Custom Backdrop</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="partySwag"
                checked={equipment.partySwag}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Custom Party Fun Swag</label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="printer"
                  checked={equipment.printer}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-gray-700">Printer (100 Shots)</label>
              </div>

              {equipment.printer && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Extra Rolls</label>
                  <input
                    type="number"
                    name="extraRolls"
                    min="0"
                    max="5"
                    value={equipment.extraRolls}
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
                checked={equipment.gifSetting}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">GIF Setting</label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="photographer"
                  checked={equipment.photographer}
                  onChange={handleChange}
                  className="rounded text-sky-500"
                />
                <label className="ml-2 text-gray-700">Additional Pro-Photographer</label>
              </div>

              {equipment.photographer && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700">Total Hours</label>
                  <input
                    type="number"
                    name="photographerHours"
                    min="4"
                    value={equipment.photographerHours}
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
                checked={equipment.outdoorCovered}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Outdoor Covered Area</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="extraTime"
                checked={equipment.extraTime}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Extra Time</label>
            </div>

            {equipment.extraTime && (
              <div className="ml-6">
                <label className="block text-sm text-gray-700">Total Hours</label>
                <input
                  type="number"
                  name="extraTimeHours"
                  min="4"
                  max="10"
                  value={equipment.extraTimeHours}
                  onChange={handleChange}
                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVeteran"
                checked={equipment.isVeteran}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Military/Veteran Discount</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isNonProfit"
                checked={equipment.isNonProfit}
                onChange={handleChange}
                className="rounded text-sky-500"
              />
              <label className="ml-2 text-gray-700">Non-Profit Organization</label>
            </div>

            {/* Mobile-only continue button */}
            <div className="block md:hidden">
              <button
                onClick={scrollToInvoice}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg
                  hover:from-sky-500 hover:to-blue-600 transition shadow-lg"
              >
                Review Quote
              </button>
            </div>

            {/* Mobile-only back button */}
            <div className="block md:hidden mt-4">
              <button
                onClick={handleBack}
                className="w-full border border-gray-300 px-6 py-3 rounded-lg
                  hover:bg-gray-50 transition text-gray-600"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div ref={invoiceDraftRef} className="bg-white p-6 rounded-lg shadow-lg">
          <InvoiceDraft bookingData={{ ...data, equipment, totalCost: calculateTotal() }} />
          
          <div className="mt-6">
            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4">
              <button
                onClick={handleBack}
                className="w-1/2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg
                  hover:from-sky-500 hover:to-blue-600 transition shadow-lg"
              >
                Continue
              </button>
            </div>

            {/* Mobile navigation at bottom of invoice */}
            <div className="flex md:hidden space-x-4">
              <button
                onClick={handleBack}
                className="w-1/2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg
                  hover:from-sky-500 hover:to-blue-600 transition shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;