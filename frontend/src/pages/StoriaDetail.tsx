import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStoriaBySlug } from '../api/storiaService';

const StoriaDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  // React Query gestisce tutto: cache, loading e dati
  const { data: storia, isLoading, isError, error } = useQuery({
    queryKey: ['storia', slug],
    queryFn: () => getStoriaBySlug(slug!),
    enabled: !!slug, // Esegue la query solo se lo slug esiste
  });

  if (isLoading) return <div className="p-10 text-center">Caricamento in corso...</div>;
  
  if (isError) return (
    <div className="p-10 text-center text-red-600">
      Errore nel caricamento: {(error as any).message}
    </div>
  );

  if (!storia) return <div className="p-10 text-center">Storia non trovata.</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{storia.titolo}</h1>
      
      {storia.immagine && (
        <img 
          src={storia.immagine} 
          alt={storia.titolo} 
          className="w-full h-auto my-6 rounded-xl shadow-lg" 
        />
      )}

      <div className="flex items-center gap-4 mb-6 text-gray-600 border-b pb-4">
        <span className="font-semibold">{storia.data}</span>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
          {storia.comune_nome}
        </span>
      </div>

      {/* Rendering del contenuto HTML proveniente da Drupal */}
      <div 
        className="prose lg:prose-xl max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: storia.body }} 
      />

      {storia.video && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Video Correlato</h3>
          <video controls className="w-full rounded-lg shadow">
            <source src={storia.video} type="video/mp4" />
            Il tuo browser non supporta il formato video.
          </video>
        </div>
      )}
    </div>
  );
};

export default StoriaDetail;