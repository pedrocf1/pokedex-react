import { useFavorite } from '../context/FavoriteContext'

interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
}

export function FavoriteButton({ pokemonId, pokemonName }: FavoriteButtonProps) {
  const { isFavorite, add, remove } = useFavorite()

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (isFavorite(pokemonId)) {
      remove(pokemonId)
    } else {
      add(pokemonId, pokemonName)
    }
  }

  const favorite = isFavorite(pokemonId)

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`absolute top-3 right-3 z-10 text-2xl leading-none transition-colors ${
        favorite ? 'text-yellow-400' : 'text-slate-400'
      }`}
      aria-label="Toggle favorite"
    >
      {favorite ? '★' : '☆'}
    </button>
  )
}
