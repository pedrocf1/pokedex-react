import { useEffect, useMemo, useRef } from 'react'
import { usePokemonList } from '../hooks/usePokemon'
import { PokemonCard } from '../components/PokemonCard'

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-8 mb-8">
          <h1 className="text-5xl font-bold text-white">Pokédex</h1>
          <p className="text-red-100 mt-2">Discover and explore all Pokémon</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-white text-2xl animate-pulse">Loading Pokémon...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.url} name={pokemon.name} url={pokemon.url} />
              ))}
            </div>

            <div ref={sentinelRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <p className="text-white text-lg animate-pulse">Loading more Pokémon...</p>
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
