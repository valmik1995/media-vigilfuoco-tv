export interface VistoInTv {
  id: number;
  codice_cartella: string;
  title: string;
  slug: string;
  body: string;
  data: string; // Django lo manda come stringa ISO
  immagine_url: string | null;
  video_url: string | null;
}

// Interfaccia per la risposta paginata di Django (se usi PageNumberPagination)
export interface VistiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VistoInTv[];
}
