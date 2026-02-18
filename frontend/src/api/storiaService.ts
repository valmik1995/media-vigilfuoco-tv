import axios from "axios";
import { Storia } from "@types";

const API_URL = "https://media-vigilfuoco.ddev.site:8443/api/storia/";

export const getStorie = async (page = 1, search = "") => {
  // DEBUG: verifica se la stringa arriva qui
  console.log("Service invia a Django search:", search);

  const response = await axios.get(API_URL, {
    params: {
      page: page,
      search: search, // Deve chiamarsi 'search' per DRF
    },
  });
  return response.data;
};

export const getStoriaBySlug = async (slug: string) => {
  try {
    const response = await fetch(`https://media-vigilfuoco.ddev.site:8443/api/storia/${slug}`);
    const data = await response.json();

    return {
      ...data,
      // Cerchiamo 'video' (singolare) come visto nei dati grezzi
      videos: Array.isArray(data.video) ? data.video : data.video ? [data.video] : [],

      // Cerchiamo 'immagine' (singolare) come visto nei dati grezzi
      immagini: Array.isArray(data.immagine) ? data.immagine : data.immagine ? [data.immagine] : [],
    };
  } catch (error) {
    console.error("Errore Service:", error);
    throw error;
  }
};