import { create } from 'zustand'

interface PokemonStore {
  selectedPokemonId: number
  setSelectedPokemonId: (id: number) => void
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  selectedPokemonId: 1,
  setSelectedPokemonId: (id) => set({ selectedPokemonId: id }),
}))
