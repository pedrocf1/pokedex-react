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
  types: Array<{ type: { name: string; url: string } }>
  height: number
  weight: number
  base_experience: number
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  abilities: Array<{
    ability: { name: string }
    is_hidden: boolean
  }>
}

export interface PokemonTypeData {
  name: string
  damage_relations: {
    double_damage_from: Array<{ name: string }>
    double_damage_to: Array<{ name: string }>
    half_damage_from: Array<{ name: string }>
    half_damage_to: Array<{ name: string }>
  }
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

export interface Encounter {
  location_area: { name: string; url: string }
  version_details: Array<{
    version: { name: string }
    max_chance: number
    encounter_details: Array<{
      chance: number
      method: { name: string }
      min_level: number
      max_level: number
    }>
  }>
}

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
