import React from 'react';
import { DiaryEntry } from '../types';

interface PrintableEntryProps {
  entry: DiaryEntry;
}

const PrintableEntry: React.FC<PrintableEntryProps> = ({ entry }) => {
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(date);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${weekday}, ${day}/${month}/${year}`;
  };

  return (
    <div style={{ width: '210mm', minHeight: '297mm', padding: '15mm', backgroundColor: 'white', color: '#3D3125', display: 'flex', flexDirection: 'column' }}>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Quicksand:wght@300..700&display=swap');
            .printable-serif { font-family: 'Lora', serif; }
            .printable-sans { font-family: 'Quicksand', sans-serif; }
            .printable-content p { margin-bottom: 1em; }
        `}</style>
        <div style={{ borderBottom: '1px solid #C8A07D', paddingBottom: '10px', marginBottom: '20px' }}>
            <h1 className="printable-serif" style={{ fontSize: '24pt', textAlign: 'center', margin: 0 }}>{formatDate(entry.date)}</h1>
        </div>
        
        <div className="printable-content" style={{ flex: 1 }}>
            <h2 className="printable-serif" style={{ fontSize: '18pt', marginBottom: '10px' }}>My Thoughts Today...</h2>
            <p className="printable-sans" style={{ fontSize: '12pt', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {entry.content || "No thoughts recorded."}
            </p>

            {entry.image_url && (
                <div style={{ margin: '20px 0', textAlign: 'center' }}>
                    <h3 className="printable-serif" style={{ fontSize: '14pt', marginBottom: '10px' }}>Today's Memory</h3>
                    <img src={entry.image_url} alt={`Memory from ${entry.date}`} style={{ maxWidth: '100%', maxHeight: '100mm', border: '2px solid #F7F1E5', borderRadius: '4px' }} />
                </div>
            )}
            
            <h2 className="printable-serif" style={{ fontSize: '18pt', marginTop: '30px', marginBottom: '10px' }}>My Creative Ideas</h2>
            <p className="printable-sans" style={{ fontSize: '12pt', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {entry.ideas || "No ideas recorded."}
            </p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #C8A07D', textAlign: 'center' }}>
            <p className="printable-sans" style={{ fontSize: '9pt', color: '#5A4A3A' }}>From My Digital Diary</p>
        </div>
    </div>
  );
};

export default PrintableEntry;