import axios from 'axios';

const API_BASE_URL = 'https://media-vigilfuoco.ddev.site:8443/api/video/';

export interface VideoData {
  id?: string;
  title: string;
  formato: string;
  posizione: string;
  codino: string;
  logo: string;
  status?: 'UPLOADED' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
  video_watermarks?: string;
}

export const videoService = {
  // 1. Invia il video originale e le opzioni
  uploadVideo: async (formData: FormData) => {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 2. Controlla lo stato (per il Polling)
  getVideoStatus: async (id: string): Promise<VideoData> => {
    const response = await axios.get(`${API_BASE_URL}${id}/`);
    return response.data;
  }
};