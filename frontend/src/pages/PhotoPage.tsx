// src/pages/PhotoPage.tsx
import React, { useEffect, useState } from 'react';
import { photoService, Photo } from '../api/photoService';
import PhotoUploader from '../components/photos/PhotoUploader';
import PhotoGallery from '../components/photos/PhotoGallery';

const PhotoPage: React.FC = () => {
  // 1. Definiamo il tipo <Photo[]> per evitare l'errore 'never[]'
  const [photos, setPhotos] = useState<Photo[]>([]);

  const loadPhotos = async () => {
    try {
      const data = await photoService.getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Errore nel caricamento foto:", error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
         <span className="text-2xl">📸</span>
         <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Gestione Fotografie</h1>
      </div>
      
      {/* 2. Passiamo la funzione di refresh all'uploader */}
      <PhotoUploader onUploadSuccess={loadPhotos} />
      
      <div className="pt-6 border-t border-slate-200">
        {/* 3. PASSA LE PROPS QUI PER RISOLVERE L'ERRORE TS(2739) */}
        <PhotoGallery photos={photos} onDelete={loadPhotos} />
      </div>
    </div>
  );
};

export default PhotoPage;