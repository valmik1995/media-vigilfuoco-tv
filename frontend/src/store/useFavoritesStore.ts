import { create } from "zustand";

interface FavoritesState {
  favoritesIds: number[]; // Array di ID (es. ID delle storie)
  setFavorites: (ids: number[]) => void;
  toggleFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favoritesIds: [],
  setFavorites: (ids) => set({ favoritesIds: ids }),
  toggleFavorite: (id) =>
    set((state) => ({
      favoritesIds: state.favoritesIds.includes(id) ? state.favoritesIds.filter((fId) => fId !== id) : [...state.favoritesIds, id],
    })),
}));
