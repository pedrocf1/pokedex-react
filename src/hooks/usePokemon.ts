import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import type { Pokemon, PokemonTypeData, PokemonListItem, PokemonListPage, Encounter } from '../types/pokemon'

export type { Pokemon, PokemonTypeData, PokemonListItem, Encounter }

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

const fetchPokemonType = async (url: string): Promise<PokemonTypeData> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch type data')
  return response.json()
}

export const usePokemonType = (url: string | undefined) =>
  useQuery({
    queryKey: ['pokemonType', url],
    queryFn: () => fetchPokemonType(url!),
    enabled: !!url,
  })

const fetchEncounters = async (id: number): Promise<Encounter[]> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
  if (!response.ok) throw new Error('Failed to fetch encounters')
  return response.json()
}

export const usePokemonEncounters = (id: number | undefined) =>
  useQuery({
    queryKey: ['pokemonEncounters', id],
    queryFn: () => fetchEncounters(id!),
    enabled: !!id,
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
