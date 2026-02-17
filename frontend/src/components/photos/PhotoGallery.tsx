import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Photo {
  id: number;
  file: string;
  watermarked_url: string;
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get<Photo[]>('https://media-vigilfuoco.ddev.site:8443/api/photos/');
      const fixed = res.data.map(p => ({
        ...p,
        file: p.file.startsWith('http') ? p.file.replace('http://', 'https://') : `https://media-vigilfuoco.ddev.site:8443${p.file}`,
        watermarked_url: p.watermarked_url.startsWith('http') ? p.watermarked_url.replace('http://', 'https://') : `https://media-vigilfuoco.ddev.site:8443${p.watermarked_url}`
      }));
      setPhotos(fixed);
    } catch (e) {
      console.error("Errore caricamento gallery", e);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Eliminare questa foto dal database?")) return;
    try {
      await axios.delete(`https://media-vigilfuoco.ddev.site:8443/api/photos/${id}/`);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert("Errore cancellazione"); }
  };

  // --- NUOVA FUNZIONE: CANCELLA TUTTO ---
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ ATTENZIONE: Sei sicuro di voler svuotare l'intero archivio? Questa azione cancellerà permanentemente tutte le foto.")) return;
    
    try {
      await axios.delete('https://media-vigilfuoco.ddev.site:8443/api/photos/delete-all/');
      setPhotos([]); // Svuota lo stato locale
      alert("Archivio svuotato con successo.");
    } catch (e) {
      console.error("Errore svuotamento archivio", e);
      alert("Errore durante lo svuotamento dell'archivio.");
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-500">Caricamento archivio...</div>;

  return (
    <div className="space-y-6">
      {/* Header Galleria con Bottone Delete All */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            <span>🚒</span> Archivio Foto Vigili del Fuoco
          </h2>
          <p className="text-slate-500 text-sm">Gestisci le foto caricate e i relativi watermark</p>
        </div>
        
        <button 
          onClick={handleDeleteAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold text-sm transition-colors shadow-sm"
        >
          <span>🗑️</span> Svuota Archivio
        </button>
      </div>
      
      {/* Griglia Foto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative group">
              <img 
                src={photo.watermarked_url} 
                alt="WM" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">WATERMARK ATTIVO</span>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              <button 
                onClick={() => downloadFile(photo.watermarked_url, `VVF_WM_${photo.id}.jpg`)} 
                className="w-full py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded transition-colors"
              >
                📥 Scarica WM
              </button>
              <button 
                onClick={() => downloadFile(photo.file, `Originale_${photo.id}.jpg`)} 
                className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded transition-colors"
              >
                🖼️ Scarica Originale
              </button>
              <button 
                onClick={() => handleDelete(photo.id)} 
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
              >
                🗑️ Cancella
              </button>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Nessuna foto presente nel database.</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;