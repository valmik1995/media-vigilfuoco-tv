import axios from 'axios';

// 1. Definiamo le Interfacce (le tue, ben strutturate)
export interface Galleria {
  id: number;
  title: string;
  description: string;
  watermarked_url: string;
  image_thumbnail: string;
  category_name: string;
  tags: { id: number, name: string }[];
}


export interface PaginatedGallerie {
  count: number;
  next: string | null;
  previous: string | null;
  results: Galleria[];
}

export interface Categoria {
  id: number;
  name: string;
  slug: string;
}


// 2. Configurazione istanza Axios
const apiClient = axios.create({
  baseURL: 'https://media-vigilfuoco.ddev.site:8443/api/galleria/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Il Service
export const galleriaService = {
  
  // Ottieni le gallerie con filtri e ricerca
  getGallerie: async (
    page: number = 1, 
    category?: string | null, 
    search?: string, // ✨ Aggiungiamo il parametro per la ricerca
    tag?: string | null // ✨ Aggiungiamo 'tag' qui come argomento
  ): Promise<PaginatedGallerie> => {
    const response = await apiClient.get('', {
      params: { 
        page,
        // 🏷️ Deve corrispondere a quanto definito in filterset_fields nel backend
        'category__name': category || undefined, 
        // 🔍 Parametro standard di filters.SearchFilter
        'tags__name': tag || undefined, 
        search: search || undefined 
      }
    });
    return response.data;
  },
  // Ottieni una singola galleria
  getGalleria: async (id: number): Promise<Galleria> => {
    const response = await apiClient.get<Galleria>(`${id}/`);
    return response.data;
  },

  // Ottieni le 22 categorie reali dal DB
  getCategorie: async (): Promise<Categoria[]> => {
    const response = await apiClient.get<Categoria[]>('categorie/');
    return response.data;
  },
};