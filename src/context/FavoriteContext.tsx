import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useAddFavorite, useRemoveFavorite, fetchFavorites } from '../hooks/usePokemon'
import type { FavoritePokemon } from '../types/pokemon'

interface FavoriteContextValue {
  favorites: Map<number, number>
  loading: boolean
  isFavorite: (pokemonId: number) => boolean
  add: (pokemonId: number, pokemonName: string) => Promise<void>
  remove: (pokemonId: number) => Promise<void>
}

const FavoriteContext = createContext<FavoriteContextValue | null>(null)

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [favorites, setFavorites] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { mutateAsync: addMutation } = useAddFavorite()
  const { mutateAsync: removeMutation } = useRemoveFavorite()

  const buildFavMap = (favList: FavoritePokemon[]): Map<number, number> => {
    const favMap = new Map<number, number>()
    for (const fav of favList) {
      favMap.set(fav.pokemonId, fav.id)
    }
    return favMap
  }

  const load = useCallback(async () => {
    if (!token || loaded || loading) {
      return
    }

    setLoading(true)
    try {
      const favList = await fetchFavorites(token)
      setFavorites(buildFavMap(favList))
      setLoaded(true)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [token, loaded, loading])

  const isFavorite = useCallback((pokemonId: number): boolean => {
    return favorites.has(pokemonId)
  }, [favorites])

  const add = useCallback(
    async (pokemonId: number, pokemonName: string) => {
      try {
        await addMutation({ pokemonId, pokemonName })
        // Refetch favorites after mutation
        const favList = await fetchFavorites(token)
        setFavorites(buildFavMap(favList))
      } catch (error) {
        console.error('Error creating favorite:', error)
      }
    },
    [addMutation, token]
  )

  const remove = useCallback(
    async (pokemonId: number) => {
      const recordId = favorites.get(pokemonId)
      if (recordId === undefined) {
        return
      }

      try {
        await removeMutation({ recordId })
        // Refetch favorites after mutation
        const favList = await fetchFavorites(token)
        setFavorites(buildFavMap(favList))
      } catch (error) {
        console.error('Error removing favorite:', error)
      }
    },
    [favorites, removeMutation, token]
  )

  useEffect(() => {
    load()
  }, [load])

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        add,
        remove,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorite() {
  const ctx = useContext(FavoriteContext)
  if (!ctx) throw new Error('useFavorite must be used inside <FavoriteProvider>')
  return ctx
}

