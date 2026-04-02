import { Link } from 'react-router-dom'
import { usePokemon } from '../hooks/usePokemon'
import { FavoriteButton } from './FavoriteButton'
import { LoadingState } from './LoadingState'
import { TypeBadges } from './TypeBadges'

interface PokemonCardProps {
  name: string
  url: string
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemon(name)

  const id = url.split('/').filter(Boolean).pop() ?? ''
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  if (isLoading) {
    return <LoadingState variant="skeleton" />
  }

  if (isError || !data) {
    return (
      <div className="relative flex flex-col items-center rounded border border-red-900 bg-slate-800 p-4 shadow-lg text-red-300 text-sm">
        Failed to load
      </div>
    )
  }

  return (
    <Link
      to={`/pokemon/${data.name}`}
      className="relative flex flex-col items-center rounded border border-slate-600 bg-slate-800 p-4 shadow-lg cursor-pointer transition-all no-underline hover:border-blue-500 hover:shadow-2xl"
      style={{ '--hover-shadow': '0 20px 25px -5px rgba(59, 130, 246, 0.2)' } as React.CSSProperties}
    >
      <FavoriteButton pokemonId={data.id} pokemonName={data.name} />
      <div
        className="flex items-center justify-center rounded w-full h-36 mb-3 overflow-hidden"
        style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
      >
        <img
          src={imageUrl}
          alt={data.name}
          className="h-28 w-28 object-contain transition-transform hover:scale-110"
          style={{ filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.1))' }}
        />
      </div>
      <span className="text-slate-400 text-xs mb-1">#{String(data.id).padStart(3, '0')}</span>
      <h2 className="text-base font-bold text-white capitalize mb-2 transition-colors">
        {data.name}
      </h2>
      <TypeBadges types={data.types} size="sm" />
    </Link>
  )
}
