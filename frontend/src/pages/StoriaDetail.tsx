import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStoriaBySlug } from "@/api/storiaService";
import { mapStoriaToDetail } from "@/utils/mappers";
import DetailLayout from "@/layouts/DetailLayout";

const StoriaDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: storia,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["storia", slug],
    queryFn: () => getStoriaBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="p-10 text-center animate-pulse uppercase font-bold text-slate-400">Caricamento storia...</div>;
  if (isError) return <div className="p-10 text-red-600 font-bold">Errore: {(error as any).message}</div>;
  if (!storia) return <div className="p-10 text-center font-bold">Contenuto non trovato.</div>;

  // 1. TRASFORMAZIONE: Usiamo il mapper per pulire i dati
  // Questo trasforma l'oggetto storia di Django nel formato richiesto dal Layout
  const detailProps = mapStoriaToDetail(storia);

  // 2. RENDERING: Passiamo tutto al Layout Universale
  return <DetailLayout {...detailProps} />;
};

export default StoriaDetail;
