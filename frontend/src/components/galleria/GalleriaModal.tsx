import React, { useEffect } from 'react';
import { Galleria } from '../types'; // Assicurati che il percorso sia corretto

interface GalleriaModalProps {
  photo: Galleria | null;
  onClose: () => void;
}

const GalleriaModal: React.FC<GalleriaModalProps> = ({ photo, onClose }) => {
  // Gestione tasto ESC per chiudere
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (photo) {
      window.addEventListener('keydown', handleEsc);
      // Blocca lo scroll del body quando la modal è aperta
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Bottone di chiusura */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Contenitore Immagine e Info */}
      <div 
        className="relative max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Evita chiusura cliccando sulla foto
      >
        <img 
          src={photo.watermarked_url} 
          alt={photo.title}
          className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
        />

        <div className="mt-6 text-center text-white bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/5 w-full">
          <h2 className="text-2xl font-bold mb-2">{photo.title}</h2>
          <p className="text-gray-300 text-base mb-4">{photo.description}</p>
          
          {/* Badge dei Tag */}
          <div className="flex flex-wrap justify-center gap-2">
            {photo.tags.map(tag => (
              <span 
                key={tag.id} 
                className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full text-xs font-semibold"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleriaModal;