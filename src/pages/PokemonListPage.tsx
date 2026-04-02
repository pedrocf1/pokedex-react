import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { usePokemonList } from '../hooks/usePokemon'
import { PokemonCard } from '../components/PokemonCard'
import { AuthButton } from '../components/AuthButton'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
  padding: 2rem 1rem;
`

const ContentWrapper = styled.div`
  max-width: 84rem;
  margin: 0 auto;
`

const Header = styled.div`
  background: linear-gradient(to right, #dc2626, #991b1b);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
`

const Subtitle = styled.p`
  color: #fee2e2;
  margin-top: 0.5rem;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24rem;
`

const LoadingText = styled.p`
  color: #fff;
  font-size: 1.5rem;
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

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, 1fr);
  }
`

const SentinelContainer = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
`

const SentinelText = styled.p`
  color: #fff;
  font-size: 1.125rem;
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

const CompletionText = styled.p`
  color: #94a3b8;
`

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
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            <div>
              <Title>Pokédex</Title>
              <Subtitle>Discover and explore all Pokémon</Subtitle>
            </div>
            <AuthButton />
          </HeaderContent>
        </Header>

        {isLoading ? (
          <LoadingContainer>
            <LoadingText>Loading Pokémon...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            <PokemonGrid>
              {allPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.url} name={pokemon.name} url={pokemon.url} />
              ))}
            </PokemonGrid>

            <SentinelContainer ref={sentinelRef}>
              {isFetchingNextPage && (
                <SentinelText>Loading more Pokémon...</SentinelText>
              )}
              {!hasNextPage && allPokemon.length > 0 && (
                <CompletionText>All {allPokemon.length} Pokémon loaded!</CompletionText>
              )}
            </SentinelContainer>
          </>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}
