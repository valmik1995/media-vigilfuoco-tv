import React, { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import vistiService from "@/api/vistiService";
import { VistoInTv, CardProps } from "@types";
import Card from "@/components/common/Card";
import Pagination from "@/components/common/Pagination";
import { Tv, AlertCircle, Loader2 } from "lucide-react";

const VistiPage: React.FC = () => {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  // 1. DICHIARA LO STATO DELLA PAGINA (Questo risolve l'errore)
  const [currentPage, setCurrentPage] = useState(1);
  // 1. Utilizzo di useQuery per recuperare i dati
  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["visti", currentPage, searchQuery], // Chiave univoca per la cache
    queryFn: () => vistiService.getAll(currentPage, searchQuery),
    placeholderData: keepPreviousData, // La funzione che chiama Axios
    staleTime: 1000 * 60 * 5, // I dati rimangono "freschi" per 5 minuti
  });

  /**
   * Helper per mappare i dati di Django verso CardProps
   */
  const mapToCardProps = (item: VistoInTv): CardProps => ({
    id: item.id,
    title: item.title,
    image: item.immagine_url,
    date: item.data,
    description: item.body,
    slug: item.slug,
    type: "visto_tv",
    basePath: "/visti-in-tv",
  });

  // 2. Stato di Caricamento
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-gray-500 animate-pulse">Caricamento video...</p>
      </div>
    );
  }

  // 3. Stato di Errore
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-600 gap-2">
        <AlertCircle size={40} />
        <h2 className="text-xl font-bold">Si è verificato un errore</h2>
        <p>{(error as Error).message || "Impossibile connettersi al server"}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Riprova
        </button>
      </div>
    );
  }

  // Estraiamo i risultati dalla risposta paginata di Django
  const visti = data?.results || [];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header Sezione */}
      <header className="mb-10 flex items-center gap-3 border-b pb-6">
        <div className="p-3 bg-red-50 rounded-full">
          <Tv className="text-red-600" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visti in TV</h1>
          <p className="text-gray-600">Archivio storico dei nostri servizi televisivi</p>
        </div>
      </header>

      {/* Griglia delle Card */}
      {visti.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visti.map((visto: VistoInTv) => (
            <Card key={visto.id} {...mapToCardProps(visto)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500 italic">Nessun contenuto disponibile al momento.</p>
        </div>
      )}

      {/* UTILIZZO DEL COMPONENTE REUSABLE */}
      <Pagination
        currentPage={currentPage} // USA QUESTO
        totalPages={Math.ceil((data?.count || 0) / 12)}
        onPageChange={(newPage) => setCurrentPage(newPage)} // USA QUESTO
        hasNext={!!data?.next}
        hasPrevious={!!data?.previous}
        disabled={isPlaceholderData}
      />
    </main>
  );
};

export default VistiPage;
