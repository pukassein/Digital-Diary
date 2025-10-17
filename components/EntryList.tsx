import React from 'react';
import { DiaryEntry } from '../types';

interface EntryListProps {
  entries: DiaryEntry[];
  onSelectEntry: (id: string) => void;
  onCreateToday: () => void;
  onCreateForPastDate: () => void;
  onExport: () => void;
  userRole: 'reader' | 'author' | null;
  onCloseDiary: () => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onSelectEntry, onCreateToday, onCreateForPastDate, onExport, userRole, onCloseDiary }) => {
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
    <div className="w-full h-full flex flex-col bg-diary-paper p-6 sm:p-8">
      <div className="mb-6 pb-4 border-b-2 border-diary-accent">
        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <button onClick={onCloseDiary} className="text-diary-accent font-bold hover:underline flex items-center gap-2 text-sm self-start">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            <span className="hidden sm:inline">Close Diary</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={onExport} title="Export entries to PDF" className="p-1.5 sm:p-2 bg-diary-bg text-diary-dark rounded-md shadow-sm border border-diary-accent hover:bg-diary-accent/20 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </button>
            {userRole === 'author' && (
              <>
                <button
                    onClick={onCreateForPastDate}
                    title="Add past entry"
                    className="p-1.5 sm:px-3 sm:py-2 bg-diary-bg text-diary-dark font-bold font-sans rounded-md shadow-sm border border-diary-accent hover:bg-diary-accent/20 transition-all duration-200 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
                    </svg>
                    <span className="hidden sm:inline">Past</span>
                </button>
                <button
                    onClick={onCreateToday}
                    className="p-1.5 sm:px-4 sm:py-2 bg-diary-accent text-diary-dark font-bold font-sans rounded-md shadow hover:bg-opacity-80 transition-all duration-200 flex items-center gap-2"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="hidden sm:inline">New</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title Row */}
        <h2 className="text-3xl font-serif text-diary-dark flex items-center justify-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            My Entries
        </h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto textarea-scrollbar -mr-2 pr-2">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry.id)}
              className="p-4 bg-diary-bg rounded-lg cursor-pointer border border-transparent hover:border-diary-accent hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-xl font-serif text-diary-dark">{formatDate(entry.date)}</h3>
              <p className="text-sm font-sans text-diary-text truncate">
                {/* FIX: Handle potentially null content to avoid runtime errors. */}
                {(entry.content || '').substring(0, 100) || 'No content yet...'}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-diary-text font-sans flex flex-col items-center gap-4 h-full justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-diary-accent opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <p>Your diary is empty.</p>
            {userRole === 'author' && <p>Click "New Entry" to start writing a new page.</p>}
          </div>
        )}
      </div>
       <div className="mt-auto pt-6 border-t-2 border-dashed border-diary-accent/30 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-diary-accent opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
        <p className="font-serif text-sm mt-2 text-diary-text/70">Every page holds a story.</p>
      </div>
    </div>
  );
};

export default EntryList;