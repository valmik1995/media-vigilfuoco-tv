import axios from "axios";
import { VistiResponse } from "@/types";

// Definiamo l'URL base (assicurati che lo slash finale sia gestito bene)
const API_URL = "https://media-vigilfuoco.ddev.site:8443/api/visti-in-tv/";

const vistiService = {
  // Esempio per vistiService.ts (fai lo stesso per storiaService)
  getAll: async (page: number = 1, search: string = ""): Promise<VistiResponse> => {
    // Django REST Framework di solito usa ?search= o ?q=
    // Verifica quale filtro hai impostato su Django
    const { data } = await axios.get<VistiResponse>(`${API_URL}?page=${page}&search=${search}`);
    return data;
  },

  getVistoBySlug: async (slug: string) => {
    const response = await axios.get(`${API_URL}/${slug}/`); // Lo slash è vitale
    return response.data;
  },
};

export default vistiService;
