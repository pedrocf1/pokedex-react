import { useEffect, useMemo, useRef } from 'react'
import { usePokemonList } from '../hooks/usePokemon'
import { PokemonCard } from '../components/PokemonCard'
import { AuthButton } from '../components/AuthButton'
import { LoadingState } from '../components/LoadingState'

export function PokemonListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePokemonList()

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allPokemon = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-800 px-4 sm:px-8 lg:px-16 py-8">
      <div>
        <div className="bg-gradient-to-r from-red-600 to-red-900 rounded-lg p-8 mb-8 max-w-screen-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white">Pokédex</h1>
              <p className="text-red-100 mt-2">Discover and explore all Pokémon</p>
            </div>
            <AuthButton />
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Loading Pokémon..." />
        ) : (
          <>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.url} name={pokemon.name} url={pokemon.url} />
                ))}
              </div>

            <div className="p-8 flex justify-center" ref={sentinelRef}>
              {isFetchingNextPage && (
                <LoadingState message="Loading more Pokémon..." />
              )}
              {!hasNextPage && allPokemon.length > 0 && (
                <p className="text-slate-400">All {allPokemon.length} Pokémon loaded!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
