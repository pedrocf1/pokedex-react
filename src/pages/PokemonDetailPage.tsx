import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePokemon, usePokemonType, usePokemonEncounters } from '../hooks/usePokemon'
import { FavoriteButton } from '../components/FavoriteButton'
import { TYPE_COLORS } from '../utils/typeColors'

function formatLocationName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const STAT_MAX = 255

const STAT_COLORS: Record<string, string> = {
  hp: 'linear-gradient(to right, #22c55e, #4ade80)',
  attack: 'linear-gradient(to right, #ef4444, #fb7185)',
  defense: 'linear-gradient(to right, #3b82f6, #60a5fa)',
  'special-attack': 'linear-gradient(to right, #a855f7, #c084fc)',
  'special-defense': 'linear-gradient(to right, #06b6d4, #22d3ee)',
  speed: 'linear-gradient(to right, #eab308, #fbbf24)',
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0f1e, #1a1a2e, #0f0f1e);
  padding: 1.5rem 1rem;
`

const ContentWrapper = styled.div`
  max-width: 84rem;
  margin: 0 auto;
`

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0f1e, #1a1a2e, #0f0f1e);
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingContent = styled.div`
  text-align: center;
`

const Spinner = styled.div`
  display: inline-block;
  animation: spin 1s linear infinite;
  width: 4rem;
  height: 4rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.p`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
`

const ErrorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0f1e, #1a1a2e, #0f0f1e);
  padding: 2rem 1rem;
`

const ErrorContent = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: 0.75rem;
  padding: 2rem;
  color: #fca5a5;
`

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #fca5a5;
`

const BackButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #60a5fa;
  transition: color 0.3s ease;
  margin-bottom: 1.5rem;
  text-decoration: none;

  &:hover {
    color: #93c5fd;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const Header = styled.div`
  background: linear-gradient(to right, rgba(37, 99, 235, 0.2), rgba(147, 51, 234, 0.2));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 1.5rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
  }
`

const HeaderInfo = styled.div`
  flex: 1;
`

const HeaderLabel = styled.p`
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const PokemonTitle = styled.h1`
  font-size: 3.75rem;
  font-weight: bold;
  color: #fff;
  text-transform: capitalize;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }`

const PokemonID = styled.p`
  color: #cbd5e1;
  font-size: 1.125rem;
  margin-top: 0.5rem;
`

const IDValue = styled.span`
  color: #60a5fa;
  font-weight: 600;
`

const ImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  width: 12rem;
  height: 12rem;
  position: relative;
  flex-shrink: 0;
`

const PokemonImage = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: contain;
  filter: drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.5));
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid #475569;
  border-radius: 0.75rem;
  padding: 1.5rem;
`

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1rem;
`

const PhysicalStatsSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PhysicalRowWrapper = styled.div`
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
`

const PhysicalRowContent = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`

const PhysicalLabel = styled.span`
  color: #cbd5e1;
`

const PhysicalValue = styled.span`
  color: #fff;
  font-weight: 600;
`

const TypesSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const TypeBadgeWrapper = styled.div<{ colorClass: string }>`
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => props.colorClass}
`

const TypeName = styled.span`
  font-weight: 600;
  text-transform: capitalize;
  color: #fff;
`

const AbilitiesSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const AbilityBox = styled.div`
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid #3b82f6;
`

const AbilityName = styled.div`
  text-transform: capitalize;
  color: #fff;
  font-weight: 600;
`

const HiddenAbilityBadge = styled.span`
  font-size: 0.75rem;
  background-color: rgba(234, 179, 8, 0.3);
  color: #fcd34d;
  padding: 0.5rem 0.5rem;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  display: inline-block;
`

const StatsCard = styled(Card)`
  grid-column: 1 / -1;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const StatItem = styled.div``

const StatLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

const StatLabelName = styled.span`
  color: #cbd5e1;
`

const StatValue = styled.span`
  color: #fff;
  font-weight: 600;
`

const StatBarContainer = styled.div`
  width: 100%;
  background-color: #475569;
  border-radius: 9999px;
  height: 0.5rem;
  overflow: hidden;
`

const StatBar = styled.div<{ width: number; gradient: string }>`
  height: 100%;
  border-radius: 9999px;
  transition: width 0.7s ease;
  width: ${(props) => props.width}%;
  background: ${(props) => props.gradient};
`

const TypeEffectivenessCard = styled(Card)`
  grid-column: 1 / -1;
`

const LoadingMessage = styled.p`
  color: #94a3b8;
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

const EffectivenessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

const DamageGroupWrapper = styled.div<{ bgColor: string; borderColor: string }>`
  background-color: ${(props) => props.bgColor};
  border-left: 4px solid;
  border-color: ${(props) => props.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
`

const DamageGroupTitle = styled.h4`
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.75rem;
`

const TypeBadgesGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const DamageTypeBadge = styled.span<{ badgeColor: string }>`
  ${(props) => props.badgeColor}
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  text-transform: capitalize;
`

const EncountersCard = styled(Card)`
  grid-column: 1 / -1;
`

const EncountersSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const EncounterItem = styled.div`
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #60a5fa;
  }
`

const EncounterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`

const EncounterLocation = styled.p`
  color: #60a5fa;
  font-weight: 600;
  text-transform: capitalize;
`

const EncounterDetail = styled.p`
  color: #cbd5e1;
  font-size: 0.875rem;
`

const EncounterLabel = styled.span`
  color: #60a5fa;
  font-weight: 600;
`

const EncounterFullWidth = styled.div`
  grid-column: 1 / -1;
`

const OtherConditionsTitle = styled.p`
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`

const OtherConditionsList = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const OtherConditionItem = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
`

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: pokemon, isLoading, isError } = usePokemon(name!)

  const firstTypeUrl = pokemon?.types?.[0]?.type?.url
  const { data: typeData, isLoading: typeLoading } = usePokemonType(firstTypeUrl)
  const { data: encounters, isLoading: encounterLoading } = usePokemonEncounters(pokemon?.id)

  const imageUrl = pokemon
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    : ''

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Loading Pokémon details...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    )
  }

  if (isError || !pokemon) {
    return (
      <ErrorContainer>
        <ContentWrapper>
          <BackButton />
          <ErrorContent>
            <ErrorTitle>Error Loading Pokémon</ErrorTitle>
            <p>Failed to load data for "{name}".</p>
          </ErrorContent>
        </ContentWrapper>
      </ErrorContainer>
    )
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton />

        {/* Header */}
        <Header>
          <HeaderContent>
            <HeaderInfo>
              <HeaderLabel>Pokémon Details</HeaderLabel>
              <PokemonTitle>{pokemon.name}</PokemonTitle>
              <PokemonID>
                ID: <IDValue>#{String(pokemon.id).padStart(3, '0')}</IDValue>
              </PokemonID>
            </HeaderInfo>
            <ImageBox>
              <FavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
              <PokemonImage
                src={imageUrl}
                alt={pokemon.name}
              />
            </ImageBox>
          </HeaderContent>
        </Header>

        {/* Main grid */}
        <GridContainer>
          {/* Physical Stats */}
          <Card>
            <CardTitle>Physical Stats</CardTitle>
            <PhysicalStatsSpace>
              <PhysicalRow label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <PhysicalRow label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
              {pokemon.base_experience != null && (
                <PhysicalRow label="Base Exp" value={String(pokemon.base_experience)} />
              )}
            </PhysicalStatsSpace>
          </Card>

          {/* Types */}
          <Card>
            <CardTitle>Types</CardTitle>
            <TypesSpace>
              {pokemon.types.map(({ type }) => (
                <TypeBadgeWrapper
                  key={type.name}
                  colorClass={TYPE_COLORS[type.name] ?? 'background-color: #6b7280;'}
                >
                  <TypeName>{type.name}</TypeName>
                </TypeBadgeWrapper>
              ))}
            </TypesSpace>
          </Card>

          {/* Abilities */}
          <Card>
            <CardTitle>Abilities</CardTitle>
            <AbilitiesSpace>
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <AbilityBox key={ability.name}>
                  <AbilityName>{ability.name}</AbilityName>
                  {is_hidden && (
                    <HiddenAbilityBadge>
                      Hidden Ability
                    </HiddenAbilityBadge>
                  )}
                </AbilityBox>
              ))}
            </AbilitiesSpace>
          </Card>
        </GridContainer>

        {/* Base Stats */}
        <StatsCard>
          <CardTitle>Base Stats</CardTitle>
          <StatsGrid>
            {pokemon.stats.map(({ stat, base_stat }) => (
              <StatItem key={stat.name}>
                <StatLabelRow>
                  <StatLabelName>{STAT_LABELS[stat.name] ?? stat.name}</StatLabelName>
                  <StatValue>{base_stat}</StatValue>
                </StatLabelRow>
                <StatBarContainer>
                  <StatBar 
                    width={(base_stat / STAT_MAX) * 100}
                    gradient={STAT_COLORS[stat.name] ?? 'linear-gradient(to right, #3b82f6, #60a5fa)'}
                  />
                </StatBarContainer>
              </StatItem>
            ))}
          </StatsGrid>
        </StatsCard>

        {/* Type Effectiveness */}
        <TypeEffectivenessCard>
          <CardTitle>
            {typeData ? `${typeData.name} ` : ''}Type Effectiveness
          </CardTitle>
          {typeLoading ? (
            <LoadingMessage>Loading type matchups...</LoadingMessage>
          ) : typeData ? (
            <EffectivenessGrid>
              {typeData.damage_relations.double_damage_from.length > 0 && (
                <DamageGroup
                  title="Weak Against (2×)"
                  types={typeData.damage_relations.double_damage_from}
                  borderColor="#ef4444"
                  bgColor="rgba(239, 68, 68, 0.2)"
                  badgeColor="background-color: rgba(239, 68, 68, 0.3); color: #fca5a5;"
                />
              )}
              {typeData.damage_relations.double_damage_to.length > 0 && (
                <DamageGroup
                  title="Strong Against (2×)"
                  types={typeData.damage_relations.double_damage_to}
                  borderColor="#22c55e"
                  bgColor="rgba(34, 197, 94, 0.2)"
                  badgeColor="background-color: rgba(34, 197, 94, 0.3); color: #86efac;"
                />
              )}
              {typeData.damage_relations.half_damage_from.length > 0 && (
                <DamageGroup
                  title="Resists Damage From (½×)"
                  types={typeData.damage_relations.half_damage_from}
                  borderColor="#3b82f6"
                  bgColor="rgba(59, 130, 246, 0.2)"
                  badgeColor="background-color: rgba(59, 130, 246, 0.3); color: #93c5fd;"
                />
              )}
              {typeData.damage_relations.half_damage_to.length > 0 && (
                <DamageGroup
                  title="Deal Less Damage To (½×)"
                  types={typeData.damage_relations.half_damage_to}
                  borderColor="#a855f7"
                  bgColor="rgba(168, 85, 247, 0.2)"
                  badgeColor="background-color: rgba(168, 85, 247, 0.3); color: #d8b4fe;"
                />
              )}
            </EffectivenessGrid>
          ) : null}
        </TypeEffectivenessCard>

        {/* Encounters */}
        <EncountersCard>
          <CardTitle>Pokémon Encounters</CardTitle>
          {encounterLoading ? (
            <LoadingMessage>Loading encounters...</LoadingMessage>
          ) : !encounters || encounters.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>No encounter data available for this Pokémon.</p>
          ) : (
            <EncountersSpace>
              {encounters.map((encounter) => {
                const firstVersion = encounter.version_details[0]
                const firstDetail = firstVersion?.encounter_details[0]
                const versions = encounter.version_details.map((v) => v.version.name).join(', ')
                const otherDetails = firstVersion?.encounter_details.slice(1) ?? []
                return (
                  <EncounterItem key={encounter.location_area.name}>
                    <EncounterGrid>
                      <div>
                        <EncounterLocation>
                          {formatLocationName(encounter.location_area.name)}
                        </EncounterLocation>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <EncounterDetail>
                          <EncounterLabel>Method: </EncounterLabel>
                          <span style={{ textTransform: 'capitalize' }}>{firstDetail?.method.name ?? 'Unknown'}</span>
                        </EncounterDetail>
                        <EncounterDetail>
                          <EncounterLabel>Chance: </EncounterLabel>
                          {firstDetail?.chance ?? 'N/A'}%
                        </EncounterDetail>
                      </div>
                      <EncounterFullWidth>
                        <EncounterDetail>
                          <EncounterLabel>Version(s): </EncounterLabel>
                          <span style={{ textTransform: 'capitalize' }}>{versions}</span>
                        </EncounterDetail>
                      </EncounterFullWidth>
                      {otherDetails.length > 0 && (
                        <EncounterFullWidth>
                          <OtherConditionsTitle>Other conditions:</OtherConditionsTitle>
                          <OtherConditionsList>
                            {otherDetails.map((detail, i) => (
                              <OtherConditionItem key={i}>
                                <span style={{ textTransform: 'capitalize' }}>{detail.method.name}</span> — Chance: {detail.chance}%
                              </OtherConditionItem>
                            ))}
                          </OtherConditionsList>
                        </EncounterFullWidth>
                      )}
                    </EncounterGrid>
                  </EncounterItem>
                )
              })}
            </EncountersSpace>
          )}
        </EncountersCard>
      </ContentWrapper>
    </PageContainer>
  )
}

function BackButton() {
  return (
    <BackButtonLink to="/">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to List
    </BackButtonLink>
  )
}

function PhysicalRow({ label, value }: { label: string; value: string }) {
  return (
    <PhysicalRowWrapper>
      <PhysicalRowContent>
        <PhysicalLabel>{label}</PhysicalLabel>
        <PhysicalValue>{value}</PhysicalValue>
      </PhysicalRowContent>
    </PhysicalRowWrapper>
  )
}

function DamageGroup({
  title,
  types,
  borderColor,
  bgColor,
  badgeColor,
}: {
  title: string
  types: Array<{ name: string }>
  borderColor: string
  bgColor: string
  badgeColor: string
}) {
  return (
    <DamageGroupWrapper bgColor={bgColor} borderColor={borderColor}>
      <DamageGroupTitle>{title}</DamageGroupTitle>
      <TypeBadgesGroup>
        {types.map((t) => (
          <DamageTypeBadge key={t.name} badgeColor={badgeColor}>
            {t.name}
          </DamageTypeBadge>
        ))}
      </TypeBadgesGroup>
    </DamageGroupWrapper>
  )
}
