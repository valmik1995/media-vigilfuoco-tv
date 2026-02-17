import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { photoService } from '../../api/photoService'; // Importiamo il service

// 1. Definiamo cosa il componente riceve dall'esterno
interface PhotoUploaderProps {
  onUploadSuccess?: () => void | Promise<void>;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    
    // Creiamo il FormData per l'invio multiplo
    const formData = new FormData();
    files.forEach(f => {
      // Nota: assicurati che il backend Django accetti 'file' come chiave
      formData.append('file', f); 
    });

    try {
      // 2. USIAMO IL SERVICE (che gestirà l'URL e il progresso internamente o via callback)
      await photoService.uploadPhoto(formData, (progress) => {
        setUploadProgress(progress);
      });

      setFiles([]);
      
      // Se abbiamo passato una funzione di refresh (per la galleria), la chiamiamo
      if (onUploadSuccess) {
        await onUploadSuccess();
      }

      // Reindirizzamento come da tua logica
      navigate('/archivio'); 
      
    } catch (err) {
      console.error(err);
      alert("Errore durante l'upload");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ... Il tuo JSX rimane uguale fino al pulsante ... */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Carica Nuovi Media</h2>
        <p className="text-slate-500 text-sm">Trascina le foto qui o clicca per selezionarle</p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-200 flex flex-col items-center justify-center
          ${isDragging 
            ? "border-red-500 bg-red-50 ring-4 ring-red-50" 
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"}`}
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-500"}`}>
          <span className="text-4xl">{isDragging ? "📥" : "📸"}</span>
        </div>
        
        <p className="font-semibold text-slate-700">
          {isDragging ? "Rilascia per caricare" : "Trascina qui le tue immagini"}
        </p>
        <p className="text-xs text-slate-400 mt-2">PNG, JPG, HEIC fino a 10MB l'una</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700">{files.length} file in attesa</span>
            <button onClick={() => setFiles([])} className="text-xs text-red-600 hover:underline">Rimuovi tutti</button>
          </div>
          <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {files.map((file, i) => (
              <li key={i} className="p-3 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-xs">🖼️</div>
                  <span className="text-sm text-slate-600 truncate max-w-[200px]">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">✕</button>
              </li>
            ))}
          </ul>
          
          <div className="p-4 bg-slate-50 border-t">
            {loading && (
              <div className="w-full bg-slate-200 h-2 rounded-full mb-4 overflow-hidden">
                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all
                ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 active:scale-[0.98]"}`}
            >
              {loading ? `Caricamento (${uploadProgress}%)` : `Inizia Upload`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;