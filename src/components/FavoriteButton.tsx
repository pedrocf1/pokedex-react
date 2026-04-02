import styled from 'styled-components'
import { useFavorite } from '../context/FavoriteContext'

interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
}

const StyledButton = styled.button<{ $isFavorite: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  font-size: 1.5rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  color: ${props => props.$isFavorite ? '#facc15' : '#cbd5e1'};
  padding: 0;

  &:hover {
    color: ${props => props.$isFavorite ? '#eab308' : '#94a3b8'};
  }

  &:active {
    transform: scale(1.1);
  }
`

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
    <StyledButton
      type="button"
      onClick={handleToggle}
      $isFavorite={favorite}
      aria-label="Toggle favorite"
    >
      {favorite ? '★' : '☆'}
    </StyledButton>
  )
}
