import { create } from "zustand";

interface FilterState {
  query: string;
  comune: string | null;
  anno: string | null;
  setQuery: (q: string) => void;
  setComune: (c: string | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  // Assicurati che il nome qui coincida con quello che usi nella Navbar
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  resetFilters: () => set({ searchQuery: "" }),
}));