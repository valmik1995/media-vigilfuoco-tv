// src/utils/mappers.ts
import { DetailLayoutProps } from "@/types/detail";

export const mapStoriaToDetail = (storia: any): DetailLayoutProps => ({
  title: storia.titolo,
  content: storia.body,
  date: storia.data,
  location: storia.comune_nome,
  category: "Storia",
  basePath: "/storia",
  slug: storia.slug,
  videos: storia.videos || [],
  immagini: storia.immagini || [],
});

export const mapVistoToDetail = (data: any): DetailLayoutProps => ({
  // Basato sul tuo screenshot del JSON di Django
  title: data.title, 
  content: data.body,
  date: data.data, // Django restituisce "2025-12-05"
  slug: data.slug,
  basePath: "/visti_in_tv",
  category: "Visto in TV",
  
  // Mappiamo i media singoli che arrivano da Django in array per il layout
  videos: data.video_url ? [data.video_url] : [],
  immagini: data.immagine_url ? [data.immagine_url] : [],
});