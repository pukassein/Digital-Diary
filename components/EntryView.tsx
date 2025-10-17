import React, { useState, useEffect, useRef } from 'react';
import { DiaryEntry } from '../types';

interface EntryViewProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry, imageFile: File | null) => void;
  onBack: () => void;
  onDelete: (id: string) => void;
  userRole: 'reader' | 'author' | null;
  onImageClick: (url: string) => void;
}

const EntryView: React.FC<EntryViewProps> = ({ entry, onSave, onBack, onDelete, userRole, onImageClick }) => {
  // FIX: Provide a fallback to an empty string to handle null values from the database.
  const [content, setContent] = useState(entry.content || '');
  // FIX: Provide a fallback to an empty string to handle null values from the database.
  const [ideas, setIdeas] = useState(entry.ideas || '');
  const [imagePreview, setImagePreview] = useState<string | null>(entry.image_url);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // FIX: Provide a fallback to an empty string to handle null values from the database.
    setContent(entry.content || '');
    // FIX: Provide a fallback to an empty string to handle null values from the database.
    setIdeas(entry.ideas || '');
    setImagePreview(entry.image_url);
    setImageFile(null);
  }, [entry]);

  const isReadOnly = userRole !== 'author';

  const handleSave = () => {
    const updatedEntry: DiaryEntry = { ...entry, content, ideas };
    onSave(updatedEntry, imageFile);
  };

  const handleDelete = () => {
    onDelete(entry.id);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
    <div className="w-full h-full flex flex-col bg-diary-paper p-6 sm:p-8 overflow-y-auto textarea-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-diary-accent">
            <button onClick={onBack} className="text-diary-accent font-bold hover:underline flex items-center gap-1 text-sm md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to List
            </button>
            <h2 className="text-2xl font-serif text-diary-dark flex-1 text-center">{formatDate(entry.date)}</h2>
            {!isReadOnly && (
                <div className="flex gap-2">
                    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/5 flex flex-col">
                <label htmlFor="diary-content" className="font-serif text-diary-dark text-lg mb-2">My Thoughts Today...</label>
                <textarea
                    id="diary-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    readOnly={isReadOnly}
                    placeholder={isReadOnly ? "No content written for this day." : "Start writing here..."}
                    className="w-full p-4 font-sans text-diary-text bg-diary-bg/50 border border-diary-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-diary-accent/50 leading-6"
                    rows={10}
                />
            </div>

            {/* Ideas and Image Area */}
            <div className="lg:w-2/5 flex flex-col gap-4">
                {/* Image Section */}
                <div className="flex flex-col">
                    <label className="font-serif text-diary-dark text-lg mb-2">Today's Memory</label>
                    <div
                        className={`w-full h-48 bg-diary-bg rounded-md flex items-center justify-center border-2 border-dashed border-diary-accent/30 relative ${imagePreview ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                            if (imagePreview) {
                                onImageClick(imagePreview);
                            }
                        }}
                        >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Diary entry" className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <div className="text-center text-diary-text p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-diary-accent opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm16.5-18h-16.5" />
                                </svg>
                                <p className="mt-2 text-sm">No image added.</p>
                            </div>
                        )}
                        {!isReadOnly && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="absolute bottom-2 right-2 p-2 bg-diary-dark/70 text-diary-bg rounded-full hover:bg-diary-dark transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Ideas Section */}
                <div className="flex flex-col">
                    <label htmlFor="diary-ideas" className="font-serif text-diary-dark text-lg mb-2">My Creative Ideas</label>
                    <textarea
                        id="diary-ideas"
                        value={ideas}
                        onChange={(e) => setIdeas(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder={isReadOnly ? "No ideas here." : "Jot down any creative ideas, sketches, or plans here..."}
                        className="w-full p-4 font-sans text-sm text-diary-text bg-diary-bg/50 border border-diary-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-diary-accent/50 leading-6"
                        rows={5}
                    />
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        {!isReadOnly && (
            <div className="mt-6 pt-4 border-t-2 border-diary-accent/50 flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-diary-dark text-diary-bg font-bold font-sans rounded-md shadow hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                    </svg>
                    Save Entry
                </button>
            </div>
        )}
    </div>
  );
};

export default EntryView;