import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-white bg-diary-dark rounded-full p-1 hover:bg-opacity-80 transition-colors z-10"
          aria-label="Close image view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt="Expanded diary entry"
          className="object-contain max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImageModal;