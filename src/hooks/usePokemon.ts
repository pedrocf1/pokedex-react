import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import type { Pokemon, PokemonTypeData, PokemonListItem, PokemonListPage, Encounter, FavoritePokemon } from '../types/pokemon'

export type { Pokemon, PokemonTypeData, PokemonListItem, Encounter, FavoritePokemon }

const ITEMS_PER_PAGE = 20
const BACKEND_API_URL = 'http://localhost:3333'

// PokeAPI fetchers
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

const fetchPokemonType = async (url: string): Promise<PokemonTypeData> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch type data')
  return response.json()
}

const fetchEncounters = async (id: number): Promise<Encounter[]> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
  if (!response.ok) throw new Error('Failed to fetch encounters')
  return response.json()
}

// Backend API fetchers (favorites)
export const fetchFavorites = async (token: string | null): Promise<FavoritePokemon[]> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BACKEND_API_URL}/favorite-pokemon`, { headers })
  if (!response.ok) throw new Error('Failed to fetch favorites')
  return response.json()
}

const createFavoritePokemon = async (
  token: string | null,
  pokemonId: number,
  pokemonName: string
): Promise<FavoritePokemon> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BACKEND_API_URL}/favorite-pokemon`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ pokemonId, pokemonName }),
  })
  if (!response.ok) throw new Error('Failed to create favorite')
  return response.json()
}

const deleteFavoritePokemon = async (
  token: string | null,
  recordId: number
): Promise<void> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BACKEND_API_URL}/favorite-pokemon/${recordId}`, {
    method: 'DELETE',
    headers,
  })
  if (!response.ok) throw new Error('Failed to delete favorite')
}

// PokeAPI hooks
export const usePokemon = (name: string) =>
  useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(name),
  })

export const usePokemonType = (url: string | undefined) =>
  useQuery({
    queryKey: ['pokemonType', url],
    queryFn: () => fetchPokemonType(url!),
    enabled: !!url,
  })

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

// Favorite hooks
export const useFavorites = (enabled: boolean = true) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => fetchFavorites(token),
    enabled: enabled && !!token,
  })
}

export const useAddFavorite = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pokemonId, pokemonName }: { pokemonId: number; pokemonName: string }) =>
      createFavoritePokemon(token, pokemonId, pokemonName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export const useRemoveFavorite = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recordId }: { recordId: number }) =>
      deleteFavoritePokemon(token, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}



