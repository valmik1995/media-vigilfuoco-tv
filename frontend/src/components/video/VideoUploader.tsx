import React, { useState, useRef } from 'react';
import { videoService } from '../../api/videoService';

interface Props {
  onUploadSuccess: (id: string) => void;
}

const VideoUploader: React.FC<Props> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState({
    formato: '1280',
    posizione: 'ORIZ',
    codino: 'CODIN',
    logo: 'LOGO'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      alert("🚒 Alt! Inserisci un titolo e seleziona un video.");
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('formato', options.formato);
    formData.append('posizione', options.posizione);
    formData.append('codino', options.codino);
    formData.append('logo', options.logo);

    try {
      setLoading(true);
      const data = await videoService.uploadVideo(formData);
      onUploadSuccess(data.id);
      
      // Reset del form dopo il successo
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error("Errore upload:", error);
      alert("Errore durante il caricamento del video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <span className="text-xl">🎬</span>
        <h2 className="text-lg font-bold uppercase tracking-tight">Nuovo Progetto Video</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titolo */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Titolo Intervento</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Incendio Boschivo Imperia"
          />
        </div>

        {/* Configurazione Tecnica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Risoluzione</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              value={options.formato}
              onChange={(e) => setOptions({...options, formato: e.target.value})}
            >
              <option value="1920">Full HD (1080p)</option>
              <option value="1280">HD (720p)</option>
              <option value="640">SD (480p)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Orientamento</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              value={options.posizione}
              onChange={(e) => setOptions({...options, posizione: e.target.value})}
            >
              <option value="ORIZ">Orizzontale (16:9)</option>
              <option value="VERT">Verticale (9:16)</option>
            </select>
          </div>
        </div>

        {/* Opzioni Watermark */}
        <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-red-600"
              checked={options.logo === 'LOGO'} 
              onChange={(e) => setOptions({...options, logo: e.target.checked ? 'LOGO' : 'SENZ'})} 
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Applica Logo VVF</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-red-600"
              checked={options.codino === 'CODIN'} 
              onChange={(e) => setOptions({...options, codino: e.target.checked ? 'CODIN' : 'SENZA'})} 
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Aggiungi Codino</span>
          </label>
        </div>

        {/* Selezione File */}
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 bg-slate-50'
          }`}
        >
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            id="video-upload"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">{file ? '✅' : '📤'}</div>
            <div className="text-sm font-medium text-slate-700">
              {file ? file.name : "Trascina qui il video o clicca per sfogliare"}
            </div>
            <div className="text-xs text-slate-400 mt-1">MP4, MOV o AVI (max 500MB)</div>
          </label>
        </div>

        {/* Pulsante Invio */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-bold uppercase tracking-widest transition-all shadow-md ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Caricamento...
            </span>
          ) : 'Invia al Processing'}
        </button>
      </form>
    </div>
  );
};

export default VideoUploader;