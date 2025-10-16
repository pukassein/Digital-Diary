import React from 'react';

interface RoleSelectionModalProps {
  onSelectRole: (role: 'reader' | 'author') => void;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelectRole, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-diary-paper rounded-lg shadow-2xl p-8 sm:p-12 text-center text-diary-text w-11/12 max-w-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-diary-accent hover:text-diary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-3xl font-serif text-diary-dark mb-8">How would you like to open this diary?</h2>
        <div className="w-full flex flex-col md:flex-row gap-6">
          
          {/* Reader Option */}
          <div 
            onClick={() => onSelectRole('reader')}
            className="flex-1 p-6 bg-diary-bg rounded-lg border-2 border-dashed border-diary-accent/50 hover:border-diary-accent hover:bg-diary-paper transition-all duration-300 cursor-pointer flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-diary-accent mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.433-7.447A1 1 0 0 1 7.48 4.002h9.04a1 1 0 0 1 .994.883l4.433 7.447a1.012 1.012 0 0 1 0 .639l-4.433 7.447A1 1 0 0 1 16.52 20h-9.04a1 1 0 0 1-.994-.883l-4.433-7.447Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <h3 className="text-2xl font-serif text-diary-dark mb-2">As a Reader</h3>
            <p className="font-sans text-sm">Browse the entries and enjoy the stories without making any changes.</p>
          </div>

          {/* Author Option */}
          <div 
            onClick={() => onSelectRole('author')}
            className="flex-1 p-6 bg-diary-bg rounded-lg border-2 border-dashed border-diary-accent/50 hover:border-diary-accent hover:bg-diary-paper transition-all duration-300 cursor-pointer flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-diary-accent mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <h3 className="text-2xl font-serif text-diary-dark mb-2">As the Author</h3>
            <p className="font-sans text-sm">Create new entries, write your thoughts, and manage your diary.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
