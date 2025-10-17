import React, { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import DiaryCover from './components/DiaryCover';
import EntryList from './components/EntryList';
import EntryView from './components/EntryView';
import RoleSelectionModal from './components/RoleSelectionModal';
import DatePickerModal from './components/DatePickerModal';
import ImageModal from './components/ImageModal';
import ExportModal from './components/ExportModal';
import { supabase } from './supabaseClient';


const App: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'reader' | 'author' | null>(null);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        const configHint = " Please check your Supabase project's configuration in the 'supabaseClient.ts' file.";
        alert(`Could not fetch diary entries: ${error.message}.${configHint}`);
      } else {
        setEntries(data || []);
      }
      setIsLoading(false);
    };

    fetchEntries();
  }, []);

  const handleOpenRequest = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleSelected = (role: 'reader' | 'author') => {
    setUserRole(role);
    setIsRoleModalVisible(false);
    setIsDiaryOpen(true);
  };

  const closeDiary = () => {
    setIsDiaryOpen(false);
    setUserRole(null);
    setSelectedEntryId(null);
    setIsRoleModalVisible(false);
  };

  const viewEntry = (id: string) => {
    setSelectedEntryId(id);
  };
  
  const closeEntry = () => {
    setSelectedEntryId(null);
  }

  const openDatePicker = () => {
    if (userRole !== 'author') return;
    setIsDatePickerVisible(true);
  }
  
  const openExportModal = () => {
    setIsExportModalVisible(true);
  }

  const addEntryForToday = async () => {
    if (userRole !== 'author') return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayDateString = `${year}-${month}-${day}`;

    await addEntryForDate(todayDateString);
  };

  const addEntryForDate = async (dateString: string) => {
    if (userRole !== 'author') return;

    const existingEntry = entries.find(e => e.date === dateString);
    if (existingEntry) {
      alert('An entry for this date already exists.');
      viewEntry(existingEntry.id);
      setIsDatePickerVisible(false);
      return;
    }

    const newEntryData = {
      date: dateString,
      content: '',
      ideas: '',
      image_url: null,
    };

    const { data: newEntry, error } = await supabase
      .from('entries')
      .insert(newEntryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create new entry. ' + error.message);
    } else if (newEntry) {
      setEntries([newEntry, ...entries]);
      viewEntry(newEntry.id);
    }
    setIsDatePickerVisible(false);
  };

  const saveEntry = async (updatedEntry: DiaryEntry, imageFile: File | null) => {
    if (userRole !== 'author') return;
    
    const fileToBase64 = (file: File): Promise<string> => 
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    let finalImageUrl = updatedEntry.image_url;

    if (imageFile) {
      finalImageUrl = await fileToBase64(imageFile);
    }
    
    const entryToSave = { 
        content: updatedEntry.content,
        ideas: updatedEntry.ideas,
        image_url: finalImageUrl 
    };

    const { data: savedEntry, error } = await supabase
      .from('entries')
      .update(entryToSave)
      .eq('id', updatedEntry.id)
      .select()
      .single();

    if (error) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry.');
    } else if (savedEntry) {
        const newEntries = entries.map(e => e.id === savedEntry.id ? savedEntry : e);
        setEntries(newEntries);
        closeEntry();
    }
  };


  const deleteEntry = async (id: string) => {
    if (userRole !== 'author') return;
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry.');
        } else {
            setEntries(entries.filter(entry => entry.id !== id));
            closeEntry();
        }
    }
  };

  const handleImageClick = (url: string) => {
    if (userRole === 'reader') {
        setImageModalUrl(url);
    }
  };

  const closeImageModal = () => {
    setImageModalUrl(null);
  };

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-diary-bg">
        <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-diary-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-xl font-serif text-diary-dark">Loading your diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 md:p-8 flex md:items-center md:justify-center bg-diary-bg">
      {imageModalUrl && (
          <ImageModal imageUrl={imageModalUrl} onClose={closeImageModal} />
      )}
      {isDatePickerVisible && (
        <DatePickerModal
          onClose={() => setIsDatePickerVisible(false)}
          onCreate={addEntryForDate}
          existingDates={entries.map(e => e.date)}
        />
      )}
      {isExportModalVisible && (
        <ExportModal
            entries={entries}
            onClose={() => setIsExportModalVisible(false)}
        />
      )}
      {isRoleModalVisible && (
        <RoleSelectionModal 
          onSelectRole={handleRoleSelected} 
          onClose={() => setIsRoleModalVisible(false)} 
        />
      )}
      <div className="w-full max-w-6xl md:h-[90vh] max-h-[1000px] bg-white shadow-2xl rounded-lg flex md:overflow-hidden border-4 border-diary-dark book-shadow">
        {!isDiaryOpen ? (
          <DiaryCover onOpen={handleOpenRequest} />
        ) : (
          <div className="flex flex-1 flex-col md:flex-row">
            {/* Left Page: EntryList. Always visible after open. */}
            <div className={`w-full md:w-1/2 lg:w-5/12 border-r-2 border-diary-accent/30 border-dashed ${selectedEntryId && 'hidden md:flex'} flex flex-col`}>
              <EntryList entries={entries} onSelectEntry={viewEntry} onCreateToday={addEntryForToday} onCreateForPastDate={openDatePicker} onExport={openExportModal} userRole={userRole} onCloseDiary={closeDiary} />
            </div>

             {/* Right Page: EntryView or Placeholder */}
            <div className={`w-full md:w-1/2 lg:w-7/12 ${!selectedEntryId && 'hidden md:flex'} flex flex-col`}>
              {selectedEntry ? (
                <EntryView entry={selectedEntry} onSave={saveEntry} onBack={closeEntry} onDelete={deleteEntry} userRole={userRole} onImageClick={handleImageClick} />
              ) : (
                 <div className="w-full h-full flex-col items-center justify-center bg-diary-paper p-8 text-center text-diary-text hidden md:flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-diary-accent opacity-40 mb-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>

                    <h2 className="text-2xl font-serif text-diary-dark mb-4">Your Diary Awaits</h2>
                    <p className="font-sans mb-6 max-w-sm">Select an entry from the left to read your story, or create a new page to write what's on your mind today.</p>
                     {userRole === 'author' && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={openDatePicker}
                                className="px-4 py-2 bg-diary-bg text-diary-dark font-bold font-sans rounded-md shadow-sm border border-diary-accent hover:bg-diary-accent/20 transition-all duration-200 flex items-center gap-2"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" />
                                </svg>
                                Add Past Entry
                            </button>
                             <button
                                onClick={addEntryForToday}
                                className="px-4 py-2 bg-diary-accent text-diary-dark font-bold font-sans rounded-md shadow hover:bg-opacity-80 transition-all duration-200 flex items-center gap-2"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                New Entry for Today
                            </button>
                        </div>
                     )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
       <style>{`
        .book-shadow {
            box-shadow: 10px 10px 30px rgba(0,0,0,0.2), 
                        inset 0 0 10px rgba(0,0,0,0.1);
        }
        .textarea-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .textarea-scrollbar::-webkit-scrollbar-track {
            background: #F7F1E5;
            border-radius: 10px;
        }
        .textarea-scrollbar::-webkit-scrollbar-thumb {
            background: #C8A07D;
            border-radius: 10px;
        }
        .textarea-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #b78d6b;
        }
    `}</style>
    </div>
  );
};

export default App;