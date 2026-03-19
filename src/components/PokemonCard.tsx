import { usePokemon } from '../hooks/usePokemon'

interface PokemonCardProps {
  id: number
}

export function PokemonCard({ id }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemon(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load Pokémon.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-md w-64">
      <img
        src={data.sprites.front_default}
        alt={data.name}
        className="w-32 h-32"
      />
      <h2 className="text-xl font-semibold capitalize text-gray-800">
        {data.name}
      </h2>
      <div className="flex gap-2">
        {data.types.map(({ type }) => (
          <span
            key={type.name}
            className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white capitalize"
          >
            {type.name}
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        <span className="mr-4">Height: {data.height / 10} m</span>
        <span>Weight: {data.weight / 10} kg</span>
      </div>
    </div>
  )
}
