import { useQuery } from '@tanstack/react-query'

interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: Array<{
    type: { name: string }
  }>
  height: number
  weight: number
}

const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!response.ok) throw new Error('Failed to fetch Pokémon')
  return response.json()
}

export const usePokemon = (id: number) =>
  useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
  })
