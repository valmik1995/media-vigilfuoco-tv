import axios from 'axios';
import { Storia } from '../types/storia';

const API_URL = 'https://media-vigilfuoco.ddev.site:8443/api/storia/';

export const getStorie = async (): Promise<Storia[]> => {
  try {
    const response = await axios.get(API_URL);
    
    // DEBUG: Guarda nella console del browser cosa arriva davvero
    console.log("Dati ricevuti da Django:", response.data);

    // Gestione robusta: 
    // 1. Se c'è .results, lo restituiamo
    // 2. Se response.data è già un array, lo restituiamo
    // 3. Altrimenti restituiamo un array vuoto []
    const data = response.data.results || response.data;
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error("Errore nel recupero storie:", error);
    return []; // Fondamentale: restituisce array vuoto invece di rompere React
  }
};

export const getStoriaBySlug = async (slug: string): Promise<Storia> => {
  const response = await axios.get<Storia>(`${API_URL}${slug}/`);
  return response.data;
};