import { useParams } from 'react-router-dom'
import { usePokemon, usePokemonType, usePokemonEncounters } from '../hooks/usePokemon'
import { FavoriteButton } from '../components/FavoriteButton'
import { BackButton } from '../components/BackButton'
import { PhysicalRow } from '../components/PhysicalRow'
import { StatBar } from '../components/StatBar'
import { DamageGroup } from '../components/DamageGroup'
import { AbilityCard } from '../components/AbilityCard'
import { EncounterCard } from '../components/EncounterCard'
import { LoadingState } from '../components/LoadingState'
import { TypeBadges } from '../components/TypeBadges'

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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        <LoadingState message="Loading Pokémon details..." variant="spinner" />
      </div>
    )
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8">
        <div className="max-w-screen-4xl mx-auto">
          <BackButton />
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 rounded-lg p-8 text-red-300">
            <h2 className="text-2xl font-bold mb-2 text-red-300">Error Loading Pokémon</h2>
            <p>Failed to load data for "{name}".</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6">
      <div className="max-w-screen-4xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-3xl p-8 md:p-12 mb-8 relative">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="flex-1">
              <p className="text-blue-400 text-sm uppercase font-semibold tracking-widest">Pokémon Details</p>
              <h1 className="text-5xl md:text-6xl font-bold text-white capitalize mt-2">{pokemon.name}</h1>
              <p className="text-slate-300 text-lg mt-2">
                ID: <span className="text-blue-400 font-semibold">#{String(pokemon.id).padStart(3, '0')}</span>
              </p>
            </div>
            <div className="flex flex-col items-center lg:flex-col lg:items-center">
              <div className="bg-slate-700/50 rounded-2xl p-4 w-48 h-48 flex items-center justify-center relative">
                <FavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Physical Stats */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Physical Stats</h2>
            <div className="space-y-2">
              <PhysicalRow label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <PhysicalRow label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
              {pokemon.base_experience != null && (
                <PhysicalRow label="Base Exp" value={String(pokemon.base_experience)} />
              )}
            </div>
          </div>

          {/* Types */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Types</h2>
            <TypeBadges types={pokemon.types} size="lg" layout="column" />
          </div>

          {/* Abilities */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>
            <div className="space-y-3">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <AbilityCard key={ability.name} name={ability.name} isHidden={is_hidden} />
              ))}
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Base Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pokemon.stats.map(({ stat, base_stat }) => (
              <StatBar key={stat.name} statName={stat.name} baseStat={base_stat} />
            ))}
          </div>
        </div>

        {/* Type Effectiveness */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {typeData ? `${typeData.name} ` : ''}Type Effectiveness
          </h2>
          {typeLoading ? (
            <p className="text-slate-400 animate-pulse">Loading type matchups...</p>
          ) : typeData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          ) : null}
        </div>

        {/* Encounters */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Pokémon Encounters</h2>
          {encounterLoading ? (
            <LoadingState message="Loading encounters..." />
          ) : !encounters || encounters.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No encounter data available for this Pokémon.</p>
          ) : (
            <div className="space-y-3">
              {encounters.map((encounter) => (
                <EncounterCard 
                  key={encounter.location_area.name} 
                  locationName={encounter.location_area.name}
                  versionDetails={encounter.version_details}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
