import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePokemon } from '../hooks/usePokemon'
import { FavoriteButton } from './FavoriteButton'
import { TYPE_COLORS } from '../utils/typeColors'

interface PokemonCardProps {
  name: string
  url: string
}

// Styled Components
const CardLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid #475569;
  background-color: #1e293b;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2);
  }
`

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid #475569;
  background-color: #1e293b;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const SkeletonItem = styled.div`
  background-color: #334155;
  border-radius: 0.375rem;

  &.image {
    width: 8rem;
    height: 8rem;
    border-radius: 9999px;
    margin-bottom: 0.75rem;
  }

  &.name {
    height: 1rem;
    width: 6rem;
    margin-bottom: 0.5rem;
  }

  &.type {
    height: 0.75rem;
    width: 4rem;
  }
`

const ErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid #7f1d1d;
  background-color: #1e293b;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  color: #f87171;
  font-size: 0.875rem;
`

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 0.5rem;
  width: 100%;
  height: 9rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
`

const PokemonImage = styled.img`
  height: 7rem;
  width: 7rem;
  object-fit: contain;
  filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;

  ${CardLink}:hover & {
    transform: scale(1.1);
  }
`

const PokemonId = styled.span`
  color: #cbd5e1;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`

const PokemonName = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  ${CardLink}:hover & {
    color: #60a5fa;
  }
`

const TypeContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
`

const TypeBadge = styled.span<{ colorClass: string }>`
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  text-transform: capitalize;
  ${(props) => props.colorClass}
`

export function PokemonCard({ name, url }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemon(name)

  const id = url.split('/').filter(Boolean).pop() ?? ''
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  if (isLoading) {
    return (
      <SkeletonCard>
        <SkeletonItem className="image" />
        <SkeletonItem className="name" />
        <SkeletonItem className="type" />
      </SkeletonCard>
    )
  }

  if (isError || !data) {
    return <ErrorCard>Failed to load</ErrorCard>
  }

  return (
    <CardLink to={`/pokemon/${data.name}`}>
      <FavoriteButton pokemonId={data.id} pokemonName={data.name} />
      <ImageContainer>
        <PokemonImage
          src={imageUrl}
          alt={data.name}
        />
      </ImageContainer>
      <PokemonId>#{String(data.id).padStart(3, '0')}</PokemonId>
      <PokemonName>{data.name}</PokemonName>
      <TypeContainer>
        {data.types.map(({ type }) => (
          <TypeBadge
            key={type.name}
            colorClass={TYPE_COLORS[type.name] ?? 'background-color: #6b7280;'}
          >
            {type.name}
          </TypeBadge>
        ))}
      </TypeContainer>
    </CardLink>
  )
}
