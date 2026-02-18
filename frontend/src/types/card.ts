// src/types/card.ts

export type CardType = "storia" | "eventi" | "visti_in_tv";

export interface CardProps {
  title: string;
  image?: string | null;
  date?: string;
  description?: string;
  slug: string;
  type: CardType; // Usiamo il tipo definito sopra
  basePath: string; // es: "/storia" o "/visti-in-tv"
  subtitle?: string; // Nuova prop opzionale per il Comune o simili
}
