import React, { useState } from 'react';

interface DatePickerModalProps {
  onClose: () => void;
  onCreate: (date: string) => void;
  existingDates: string[];
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ onClose, onCreate, existingDates }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (existingDates.includes(selectedDate)) {
      alert('An entry for this date already exists. Please choose another date.');
      return;
    }
    onCreate(selectedDate);
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-diary-paper rounded-lg shadow-2xl p-8 sm:p-10 text-diary-text w-11/12 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-diary-accent hover:text-diary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-3xl font-serif text-diary-dark mb-6 text-center">Create a New Entry</h2>
        <div className="space-y-4">
          <label htmlFor="entry-date" className="block text-lg font-sans text-diary-text">Select a date for your entry:</label>
          <input
            type="date"
            id="entry-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 bg-diary-bg border-2 border-diary-accent rounded-md focus:ring-2 focus:ring-diary-accent focus:outline-none text-diary-dark font-sans"
          />
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold font-sans rounded-md hover:bg-gray-400 transition-colors">
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-diary-accent text-diary-dark font-bold font-sans rounded-md shadow hover:bg-opacity-80 transition-all duration-200"
            >
                Create Entry
            </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
