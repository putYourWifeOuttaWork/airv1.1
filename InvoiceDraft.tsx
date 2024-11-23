import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import type { WizardData } from './BookingWizard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface InvoiceDraftProps {
  bookingData: WizardData;
}

const InvoiceDraft: React.FC<InvoiceDraftProps> = ({ bookingData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('OpenAir-PhotoBooth-Invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleSubmitOrder = () => {
    toast.success('Your order has been submitted for review. You will receive an invoice in your email.');
    window.location.reload();
  };

  const getSelectedItems = () => {
    const items: string[] = ['Canon-OpenAir Booth - $500'];
    const equipment = bookingData.equipment;

    if (!equipment) return items;

    if (equipment.customFrame) items.push('Custom Frame with Logo - $100');
    if (equipment.extraLogos > 0) items.push(`Extra Logos (${equipment.extraLogos}) - $${equipment.extraLogos * 25}`);
    if (equipment.customBackdrop) items.push('Custom Backdrop - $200');
    if (equipment.partySwag) items.push('Custom Party Fun Swag - $150');
    if (equipment.printer) {
      items.push('Printer (100 Shots) - $400');
      if (equipment.extraRolls > 0) {
        items.push(`Extra Rolls (${equipment.extraRolls}) - $${equipment.extraRolls * 200}`);
      }
    }
    if (equipment.gifSetting) items.push('GIF Setting - $0');
    if (equipment.photographer) {
      items.push(`Pro-Photographer (${equipment.photographerHours} hours) - $${
        300 + Math.max(0, equipment.photographerHours - 4) * 120
      }`);
    }
    if (equipment.outdoorCovered) items.push('Outdoor Covered Area - $300');

    return items;
  };

  return (
    <div className="space-y-4">
      <div ref={invoiceRef} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">OpenAir Photobooth Rental</h2>
        <h3 className="text-xl text-gray-600 mb-6">Draft - Invoice</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Order Summary:</h4>
            <p>Date: {bookingData.date ? format(bookingData.date, 'MMMM d, yyyy') : 'Not selected'}</p>
            <p>Time: {bookingData.timeSlot || 'Not selected'}</p>
            {bookingData.location && (
              <p>Location: {bookingData.location}</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Items:</h4>
            <ul className="list-disc list-inside">
              {getSelectedItems().map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>${(bookingData.totalCost || 0).toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Total (including tax):</span>
              <span>${((bookingData.totalCost || 0) * 1.07).toFixed(2)}</span>
            </p>
          </div>

          <div className="text-sm text-gray-600 mt-6">
            <p>By submitting, you agree that OpenAir will contact you and confirm your event. Payment is due 50% up front, and 50% end of Event. If you are using Custom items or digital creative, 25% is due at Creative and 25% due at end of event.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          <Download className="w-5 h-5" />
          <span>Download Invoice PDF</span>
        </button>
      </div>
    </div>
  );
}

export default InvoiceDraft;