import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DiaryEntry } from '../types';
import PrintableEntry from './PrintableEntry';

declare const jspdf: any;
declare const html2canvas: any;

interface ExportModalProps {
  entries: DiaryEntry[];
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ entries, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('medium');
  
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentEntry && printableRef.current) {
      // This effect ensures the component is rendered before we try to capture it.
      // The actual capture is triggered inside handleGeneratePdf.
    }
  }, [currentEntry]);

  const handleGeneratePdf = async () => {
    setError('');
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after the end date.');
      return;
    }

    const filteredEntries = entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Adjust for timezone differences by comparing dates at UTC
        entryDate.setUTCHours(0,0,0,0);
        start.setUTCHours(0,0,0,0);
        end.setUTCHours(0,0,0,0);
        return entryDate >= start && entryDate <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredEntries.length === 0) {
      setError('No entries found in the selected date range.');
      return;
    }

    setIsLoading(true);

    let canvasScale = 1.5;
    let imageType = 'image/jpeg';
    let imageQuality = 0.8;

    if (quality === 'high') {
      canvasScale = 2;
      imageType = 'image/png';
      imageQuality = 1;
    } else if (quality === 'low') {
      canvasScale = 1;
      imageType = 'image/jpeg';
      imageQuality = 0.7;
    }

    const { jsPDF } = jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;

    for (let i = 0; i < filteredEntries.length; i++) {
        const entry = filteredEntries[i];
        
        await new Promise<void>(resolve => {
            setCurrentEntry(entry);
            setTimeout(resolve, 50);
        });

        if (printableRef.current) {
            const canvas = await html2canvas(printableRef.current, { scale: canvasScale });
            const imgData = canvas.toDataURL(imageType, imageQuality);
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasHeight / canvasWidth;
            const imgHeight = pdfWidth * ratio;

            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, imageType.split('/')[1].toUpperCase(), 0, 0, pdfWidth, imgHeight > pdfHeight ? pdfHeight : imgHeight);
        }
    }
    
    setCurrentEntry(null);
    pdf.save(`diary-export-${startDate}-to-${endDate}.pdf`);
    setIsLoading(false);
    onClose();
  };

  const QualityButton: React.FC<{
    value: 'low' | 'medium' | 'high';
    label: string;
    position: 'left' | 'middle' | 'right';
  }> = ({ value, label, position }) => (
    <button
      type="button"
      onClick={() => setQuality(value)}
      className={`relative inline-flex items-center justify-center w-1/3 px-3 py-2 text-sm font-semibold transition-colors focus:z-10
        ${position === 'left' ? 'rounded-l-md' : ''}
        ${position === 'right' ? 'rounded-r-md' : ''}
        ${position === 'middle' ? '-ml-px' : ''}
        ${quality === value
          ? 'bg-diary-accent text-diary-dark'
          : 'bg-diary-bg text-diary-text hover:bg-diary-accent/20'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <>
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-diary-paper rounded-lg shadow-2xl p-8 sm:p-10 text-diary-text w-11/12 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-diary-accent hover:text-diary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-3xl font-serif text-diary-dark mb-6 text-center">Export Entries to PDF</h2>
        <div className="space-y-6">
          <div>
            <p className="mb-4">Select a date range to include in your PDF export. Entries will be sorted chronologically.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="start-date" className="block text-lg font-sans text-diary-text mb-1">Start Date:</label>
                  <input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 bg-diary-bg border-2 border-diary-accent rounded-md focus:ring-2 focus:ring-diary-accent focus:outline-none text-diary-dark font-sans"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="end-date" className="block text-lg font-sans text-diary-text mb-1">End Date:</label>
                  <input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 bg-diary-bg border-2 border-diary-accent rounded-md focus:ring-2 focus:ring-diary-accent focus:outline-none text-diary-dark font-sans"
                  />
                </div>
            </div>
          </div>
          <div>
            <label className="block text-lg font-sans text-diary-text mb-2">Export Quality:</label>
            <div className="flex rounded-md shadow-sm border border-diary-accent/50 w-full font-sans">
              <QualityButton value="low" label="Low" position="left" />
              <QualityButton value="medium" label="Medium" position="middle" />
              <QualityButton value="high" label="High" position="right" />
            </div>
            <p className="text-xs text-diary-text/70 mt-1">Lower quality results in a smaller PDF file size.</p>
          </div>
          {error && <p className="text-red-600 text-sm font-sans">{error}</p>}
        </div>
        <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 font-bold font-sans rounded-md hover:bg-gray-400 transition-colors" disabled={isLoading}>
                Cancel
            </button>
            <button
                onClick={handleGeneratePdf}
                disabled={isLoading}
                className="px-4 py-2 bg-diary-accent text-diary-dark font-bold font-sans rounded-md shadow hover:bg-opacity-80 transition-all duration-200 flex items-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : 'Generate PDF'}
            </button>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {currentEntry && <div ref={printableRef}><PrintableEntry entry={currentEntry} /></div>}
    </div>
    </>
  );
};

export default ExportModal;