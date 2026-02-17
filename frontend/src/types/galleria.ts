// src/interfaces/galleria.ts

export interface Tag {
  id: number;
  name: string;
}

export interface Galleria {
  id: number;
  title: string;
  description: string;
  watermarked_url: string;
  image_thumbnail: string;
  category_name: string;
  tags: Tag[];
}

export interface PaginatedGallerie {
  count: number;
  next: string | null;
  previous: string | null;
  results: Galleria[];
}