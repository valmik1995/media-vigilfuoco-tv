import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStorie } from '../api/storiaService';
import { Storia } from '../types/storia';

const StoriaPage: React.FC = () => {
  // Sostituiamo useEffect e useState con useQuery
  const { data: storie, isLoading, isError } = useQuery<Storia[]>({
    queryKey: ['storie'],
    queryFn: getStorie,
  });

  if (isLoading) return <div className="p-10 text-center text-xl">Caricamento storie...</div>;
  
  if (isError) return <div className="p-10 text-center text-red-600">Errore nel caricamento dei dati.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">La Nostra Storia</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* React Query garantisce che storie sia l'array ritornato dal service */}
        {storie?.map((s) => (
          <div key={s.id} className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition bg-white">
            {s.immagine && (
              <Link to={`/storia/${s.slug}`}>
                <img 
                  src={s.immagine} 
                  alt={s.titolo} 
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
              </Link>
            )}
            <div className="p-4">
              <span className="text-sm text-red-600 font-semibold">{s.data}</span>
              
              <Link to={`/storia/${s.slug}`} className="block mt-1 group">
                <h2 className="text-xl font-bold group-hover:text-red-700 transition-colors">
                  {s.titolo}
                </h2>
              </Link>

              <p className="text-gray-600 mt-2">{s.comune_nome || 'Comune non specificato'}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {s.etichette_nomi?.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {storie?.length === 0 && (
        <p className="text-center py-10 text-gray-500">Nessuna storia trovata nel database.</p>
      )}
    </div>
  );
};

export default StoriaPage;