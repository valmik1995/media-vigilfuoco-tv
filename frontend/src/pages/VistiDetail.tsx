import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import vistiService from "@/api/vistiService";
import { mapVistoToDetail } from "@/utils/mappers";
import DetailLayout from "@/layouts/DetailLayout";

const VistiDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["visto", slug],
    queryFn: () => vistiService.getVistoBySlug(slug!),
    enabled: !!slug, // Parte solo se lo slug esiste
  });

  if (isLoading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  if (isError) return (
    <div className="p-10 text-center text-red-600 font-bold">
      Errore nel caricamento: {(error as any).message}
    </div>
  );

  if (!data) return <div className="p-10 text-center">Contenuto non trovato.</div>;

  // Trasformiamo i dati di Django per il Layout Universale
  const detailProps = mapVistoToDetail(data);

  return <DetailLayout {...detailProps} />;
};

export default VistiDetail;