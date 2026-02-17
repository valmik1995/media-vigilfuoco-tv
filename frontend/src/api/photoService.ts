import axios from 'axios';

const BASE_URL = 'https://media-vigilfuoco.ddev.site:8443';

export interface Photo {
  id: number;
  file: string;
  watermarked_url: string;
}

const fixUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url.replace('http://', 'https://');
  return `${BASE_URL}${url}`;
};

export const photoService = {
  getPhotos: async (): Promise<Photo[]> => {
    const res = await axios.get<Photo[]>(`${BASE_URL}/api/photos/`);
    return res.data.map(p => ({
      ...p,
      file: fixUrl(p.file),
      watermarked_url: fixUrl(p.watermarked_url)
    }));
  },

  deletePhoto: async (id: number) => {
    return axios.delete(`${BASE_URL}/api/photos/${id}/`);
  },

  deleteAllPhotos: async () => {
    return axios.delete(`${BASE_URL}/api/photos/delete-all/`);
  },

  uploadPhoto: async (formData: FormData, onProgress?: (p: number) => void) => {
    return axios.post(`${BASE_URL}/api/upload/`, formData, {
      onUploadProgress: (e) => {
        if (onProgress) {
          const progress = Math.round((e.loaded * 100) / (e.total || 100));
          onProgress(progress);
        }
      }
    });
  }
};