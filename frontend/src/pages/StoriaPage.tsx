import { useSearchStore } from "@/store/useSearchStore";
import React, { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getStorie } from "../api/storiaService";
import { Storia } from "@types";
import Card from "@/components/common/Card";
import Pagination from "@/components/common/Pagination";
import { BookOpen, Loader2 } from "lucide-react";

const StoriaPage: React.FC = () => {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["storie", currentPage, searchQuery],
    queryFn: () => getStorie(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });

  // Reset della pagina se l'utente inizia a cercare
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /**
   * Helper per mappare i dati con LOG
   */
  const mapToCardProps = (s: Storia) => {
    // --- LOG DI DEBUG 2: Mappatura singolo elemento ---
    console.log(`Mappatura storia ID ${s.id}:`, s);

    return {
      id: s.id,
      title: s.titolo,
      image: s.immagine,
      date: s.data,
      description: s.comune_nome || "Dettagli storici",
      slug: s.slug,
      type: "storia" as const,
      basePath: "/storia",
    };
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );

  if (isError) return <div className="p-10 text-center text-red-600">Errore: {(error as Error).message}</div>;

  // Se data ha la proprietà results, prendiamo quella, altrimenti controlliamo se data è l'array stesso
  const storie = data?.results || (Array.isArray(data) ? data : []);

  // Il conteggio totale dipende da dove si trova: data.count (paginato) o data.length (non paginato)
  const totalItems = data?.count || (Array.isArray(data) ? data.length : 0);
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-10 flex items-center gap-3 border-b pb-6">
        <BookOpen className="text-amber-600" size={32} />
        <h1 className="text-3xl font-bold">La Nostra Storia</h1>
      </header>

      {storie.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {storie.map((s: Storia) => (
            <Card key={s.id} {...mapToCardProps(s)} />
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-gray-500">Nessun dato trovato.</p>
      )}

      {/* Paginazione: viene mostrata solo se ci sono più pagine */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          console.log("Cambio pagina richiesto:", page);
          setCurrentPage(page);
        }}
        hasNext={!!data?.next}
        hasPrevious={!!data?.previous}
        disabled={isPlaceholderData}
      />
    </main>
  );
};;

export default StoriaPage;
