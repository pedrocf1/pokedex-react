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
      aria-label="Toggle favorite"
      className="absolute top-3 right-3 z-10 text-2xl leading-none bg-none border-none cursor-pointer transition-colors p-0 active:scale-110"
      style={{
        color: favorite ? '#facc15' : '#cbd5e1',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = favorite ? '#eab308' : '#94a3b8'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = favorite ? '#facc15' : '#cbd5e1'
      }}
    >
      {favorite ? '★' : '☆'}
    </button>
  )
}
