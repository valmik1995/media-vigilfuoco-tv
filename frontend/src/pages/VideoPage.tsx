import React, { useState, useEffect } from 'react';
import { videoService, VideoData } from '../api/videoService';
import VideoUploader from '../components/video/VideoUploader';
import axios from 'axios'; // Usiamo axios per l'archivio per sicurezza

const VideoPage: React.FC = () => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoData | null>(null);
  const [archive, setArchive] = useState<VideoData[]>([]); // Archivio video

  // FUNZIONE PER CARICARE L'ARCHIVIO (Database)
    const fetchArchive = async () => {
      try {
        const response = await axios.get('https://media-vigilfuoco.ddev.site:8443/api/video/');
        
        // NOTA: Se hai attivato la paginazione globale in Django, 
        // i dati sono dentro response.data.results
        if (response.data.results) {
          setArchive(response.data.results);
        } else {
          // Fallback nel caso in cui la paginazione non sia attiva su questo endpoint
          setArchive(response.data);
        }
      } catch (error) {
        console.error("Errore caricamento archivio:", error);
      }
    };
    const handleDeleteAll = async () => {
      if (window.confirm("Sei sicuro di voler eliminare tutti i video dall'archivio? Questa azione è irreversibile.")) {
        try {
          // Sostituisci con il tuo endpoint reale per l'eliminazione massiva
          await axios.delete('https://media-vigilfuoco.ddev.site:8443/api/video/delete_all/');
          fetchArchive(); // Ricarica la lista dopo l'eliminazione
          alert("Archivio svuotato con successo.");
        } catch (error) {
          console.error("Errore durante lo svuotamento:", error);
          alert("Errore durante l'eliminazione dei video.");
        }
      }
    };
  // Carica archivio all'apertura della pagina
  useEffect(() => {
    fetchArchive();
  }, []);

  // LOGICA DEL POLLING (Aggiornata)
  useEffect(() => {
    let interval: number;

    if (currentVideoId && videoDetails?.status !== 'SUCCESS' && videoDetails?.status !== 'ERROR') {
      interval = window.setInterval(async () => {
        try {
          const data = await videoService.getVideoStatus(currentVideoId);
          setVideoDetails(data);
          
          if (data.status === 'SUCCESS' || data.status === 'ERROR') {
            fetchArchive(); // Quando finisce, aggiorna la tabella in basso
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Errore nel polling:", error);
          clearInterval(interval);
        }
      }, 3000); 
    }

    return () => clearInterval(interval);
  }, [currentVideoId, videoDetails?.status]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-red-700">🚒 Gestione Video Watermark</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Sezione Upload */}
        <VideoUploader onUploadSuccess={(id) => setCurrentVideoId(id)} />

        {/* Sezione Anteprima e Stato con BARRA */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Stato Elaborazione</h2>
          {videoDetails ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm">Stato: <span className="font-bold uppercase">{videoDetails.status}</span></p>
                {/* Mostra la percentuale se disponibile */}
                <span className="text-sm font-bold text-red-700">{videoDetails.progress || 0}%</span>
              </div>

              {/* BARRA DI PROGRESSO */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] text-white font-bold shadow-sm"
                  style={{ width: `${videoDetails.progress || 0}%` }}
                >
                  {videoDetails.progress && videoDetails.progress > 10 ? `${videoDetails.progress}%` : ''}
                </div>
              </div>

              {videoDetails.status === 'SUCCESS' && (
                <div className="mt-4 p-4 bg-white rounded shadow border border-green-100">
                  <p className="text-green-600 font-bold mb-2 text-sm">✓ Elaborazione completata!</p>
                  {/* Pubblicazione Video */}
                  <video controls className="w-full rounded shadow">
                    <source 
                      src={videoDetails.video_watermarks?.startsWith('http') 
                        ? videoDetails.video_watermarks 
                        : `https://media-vigilfuoco.ddev.site:8443${videoDetails.video_watermarks}`
                      } 
                      type="video/mp4" 
                    />
                  </video>
                  {/* Scarica Video */}
                <a 
                  href={videoDetails.video_watermarks?.startsWith('http') 
                    ? videoDetails.video_watermarks 
                    : `https://media-vigilfuoco.ddev.site:8443${videoDetails.video_watermarks}`
                  } 
                  download 
                  className="..."
                >
                  Scarica Video
                </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-10">Nessun video in elaborazione</p>
          )}
        </div>
      </div>

      {/* NUOVA SEZIONE: ARCHIVIO DATABASE */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header dell'archivio con Flexbox */}
        <div className="bg-red-700 p-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">📁</span> Archivio Database
          </h2>
          
          <button 
            onClick={handleDeleteAll} // Questa funzione la definiamo tra un attimo
            className="bg-white text-red-700 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold transition-colors flex items-center shadow-sm"
          >
            <span className="mr-1">🗑️</span> SVUOTA ARCHIVIO
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Progetto</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Link</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {archive.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{v.title || `Video ${v.id.substring(0,5)}`}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      v.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    {v.video_watermarks && (
                      <a href={`https://media-vigilfuoco.ddev.site:8443${v.video_watermarks}`} target="_blank" className="text-red-600">
                        Vedi Video
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;