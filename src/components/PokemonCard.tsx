import { usePokemon } from '../hooks/usePokemon'

const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400 text-gray-800',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-violet-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300 text-gray-800',
  normal: 'bg-gray-400 text-gray-800',
}

interface PokemonCardProps {
  name: string
  url: string
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemon(name)

  const id = url.split('/').filter(Boolean).pop() ?? ''
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  if (isLoading) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800 p-4 shadow animate-pulse">
        <div className="w-32 h-32 bg-slate-700 rounded-full mb-3" />
        <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
        <div className="h-3 w-16 bg-slate-700 rounded" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-red-800 bg-slate-800 p-4 shadow text-red-400 text-sm">
        Failed to load
      </div>
    )
  }

  return (
    <div className="group flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-xl">
      <div className="flex items-center justify-center bg-slate-700/50 rounded-lg w-full h-36 mb-3 overflow-hidden">
        <img
          src={imageUrl}
          alt={data.name}
          className="h-28 w-28 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <span className="text-slate-400 text-xs mb-1">#{String(data.id).padStart(3, '0')}</span>
      <h2 className="text-base font-bold text-white capitalize mb-2 group-hover:text-blue-400 transition-colors">
        {data.name}
      </h2>
      <div className="flex gap-1 flex-wrap justify-center">
        {data.types.map(({ type }) => (
          <span
            key={type.name}
            className={`rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize ${TYPE_COLORS[type.name] ?? 'bg-gray-500'}`}
          >
            {type.name}
          </span>
        ))}
      </div>
    </div>
  )
}
