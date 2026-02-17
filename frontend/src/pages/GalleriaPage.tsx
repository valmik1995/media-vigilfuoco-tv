import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { galleriaService } from '../api/galleriaService';
import { GalleriaCard } from '../components/galleria/GalleriaCard';

const GalleriePage: React.FC = () => {
  // --- STATI UI ---
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState(''); // Testo nell'input
  const [searchQuery, setSearchQuery] = useState(''); // Testo che attiva la ricerca
  

  // Nel tuo componente React
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  // 1. Recupero Categorie per la Sidebar
  const { data: categorie = [] } = useQuery({
    queryKey: ['categorie'],
    queryFn: () => galleriaService.getCategorie(),
    staleTime: 1000 * 60 * 30, // Le categorie cambiano raramente (30 min cache)
  });

  // 2. Recupero Gallerie con Paginazione e Filtro Categoria
  const { 
    data: gallerieRes, 
    isLoading, 
    isPlaceholderData 
  } = useQuery({
    // ✨ Aggiungiamo 'searchQuery' alla queryKey
    queryKey: ['gallerie', selectedCategory, page, searchQuery, selectedTag], 
    // ✨ Passiamo 'searchQuery' alla funzione del service
    queryFn: () => galleriaService.getGallerie(page, selectedCategory, searchQuery, selectedTag),
    placeholderData: (previousData) => previousData,
  });

  const handleTagClick = (tagName: string) => {
  // Se clicchi su un tag già selezionato, lo togli (toggle)
  // Altrimenti selezioni quello nuovo
  setSelectedTag(prev => prev === tagName ? null : tagName);
  setPage(1); // Fondamentale: resetta sempre la pagina!
};

  // --- LOGICA DI SUPPORTO ---
  const gallerie = gallerieRes?.results || [];
  const hasNext = !!gallerieRes?.next;
  const hasPrev = !!gallerieRes?.previous;
  const totalCount = gallerieRes?.count || 0;

  // Funzione per cambiare categoria e resettare la pagina
  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setSelectedTag(null); // Resetta anche il tag quando cambi settore
    setPage(1);           // Torna sempre alla pagina 1
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* --- SIDEBAR CATEGORIE --- */}
      <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Specialità VVF
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-slate-50/50">
          {/* Bottone Reset / Tutte le Unità */}
          <button 
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all mb-2 ${
              !selectedCategory 
                ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tutte le Unità
          </button>

          <div className="my-4 border-t border-slate-200 opacity-50"></div>

          {/* Lista Dinamica Categorie dal DB */}
          {categorie.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                selectedCategory === cat.name 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
              }`}
            >
              <span className="flex justify-between items-center">
                {cat.name}
                {selectedCategory === cat.name && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer Sidebar: Info record */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="bg-slate-100 rounded-lg p-3">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              Totale nel settore: {totalCount}
            </p>
          </div>
        </div>
      </aside>

      {/* --- CONTENUTO PRINCIPALE --- */}
      <main className="flex-1 overflow-y-auto bg-slate-50/30">
        <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="max-w-md mx-auto mb-8 px-4">
          <div className="relative group">
            {/* Icona di ricerca posizionata assolutamente */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cerca tra le foto..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all shadow-sm"
            />

            {/* Pulsante per pulire la ricerca (opzionale ma utile) */}
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>          
          {/* Header con Stato Filtri */}
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                Archivio Gallerie
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${selectedCategory || selectedTag ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  {selectedCategory || 'Tutti i settori'} 
                  {selectedTag && <span className="text-red-600 ml-1"># {selectedTag}</span>}
                </p>
              </div>
            </div>

            {/* Tasto Reset Generale */}
            {(selectedTag || selectedCategory) && (
              <button
                onClick={() => handleCategorySelect(null)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
              >
                Resetta Tutto ✕
              </button>
            )}
          </div>

          {/* Griglia Gallerie / Skeleton Loader */}
          {isLoading && !isPlaceholderData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 h-64 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallerie.map((item) => (
                  <GalleriaCard 
                    key={item.id} 
                    galleria={item} 
                    onTagClick={(tagName) => setSelectedTag(tagName)} 
                  />
                ))}
              </div>

              {/* --- BARRA DI PAGINAZIONE --- */}
              <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pagina {page}
                  </span>
                  <span className="text-[9px] text-slate-300 font-bold uppercase">
                    Visualizzati {gallerie.length} di {totalCount} record
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={!hasPrev}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                      !hasPrev 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'
                    }`}
                  >
                    ← Precedente
                  </button>
                  
                  <button
                    onClick={() => {
                      if (!isPlaceholderData && hasNext) {
                        setPage(old => old + 1);
                      }
                    }}
                    disabled={!hasNext}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                      !hasNext 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95'
                    }`}
                  >
                    Successiva →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Stato Vuoto */}
          {gallerie.length === 0 && !isLoading && (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4 opacity-20">📂</div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                Nessun record trovato nel settore {selectedCategory}.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GalleriePage;