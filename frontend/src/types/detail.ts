// src/types/detail.ts

export interface DetailLayoutProps {
  title: string;
  content: string;
  date?: string;
  location?: string;
  category?: string;
  basePath?: string;
  slug?: string; // Ci serve per il nome del file nel download

  // Evoluzione dei Media: ora supportiamo liste
  videos?: string[];
  immagini?: string[];

  // Campi extra per Interventi o Comunicati
  extraInfo?: {
    emergencyMezzi?: string;
    interventionType?: string;
    documentUrl?: string;
  };
}