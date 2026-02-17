export interface Storia {
  id: number;
  titolo: string;
  slug: string;
  body: string;
  data: string;
  posizione: {
    type: string;
    coordinates: [number, number]; // [Longitudine, Latitudine]
  } | null;
  immagine: string | null;
  video: string | null;
  comune_nome: string;
  etichette_nomi: string[];
}