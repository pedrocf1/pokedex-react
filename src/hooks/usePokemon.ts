import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: Array<{
    type: { name: string }
  }>
  height: number
  weight: number
}

export interface PokemonListItem {
  name: string
  url: string
}

interface PokemonListPage {
  count: number
  next: string | null
  results: PokemonListItem[]
}

const ITEMS_PER_PAGE = 20

const fetchPokemon = async (name: string): Promise<Pokemon> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!response.ok) throw new Error('Failed to fetch Pokémon')
  return response.json()
}

const fetchPokemonList = async (offset: number): Promise<PokemonListPage> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`
  )
  if (!response.ok) throw new Error('Failed to fetch Pokémon list')
  return response.json()
}

export const usePokemon = (name: string) =>
  useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(name),
  })

export const usePokemonList = () =>
  useInfiniteQuery({
    queryKey: ['pokemonList'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined
      return allPages.length * ITEMS_PER_PAGE
    },
  })
