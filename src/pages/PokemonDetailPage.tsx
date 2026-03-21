import { useParams, Link } from 'react-router-dom'
import { usePokemon, usePokemonType, usePokemonEncounters } from '../hooks/usePokemon'
import { TYPE_COLORS } from '../utils/typeColors'

function formatLocationName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const STAT_MAX = 255

const STAT_COLORS: Record<string, string> = {
  hp: 'from-green-500 to-green-400',
  attack: 'from-red-500 to-orange-400',
  defense: 'from-blue-500 to-blue-400',
  'special-attack': 'from-purple-500 to-purple-400',
  'special-defense': 'from-cyan-500 to-cyan-400',
  speed: 'from-yellow-500 to-yellow-400',
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 mb-4" />
          <p className="text-white text-xl font-semibold">Loading Pokémon details...</p>
        </div>
      </div>
    )
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-red-300">
            <h2 className="text-2xl font-bold mb-2">Error Loading Pokémon</h2>
            <p>Failed to load data for "{name}".</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <BackButton />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Pokémon Details</p>
              <h1 className="text-5xl md:text-6xl font-bold text-white capitalize mt-2">{pokemon.name}</h1>
              <p className="text-slate-300 text-lg mt-2">
                ID: <span className="text-blue-400 font-semibold">#{String(pokemon.id).padStart(3, '0')}</span>
              </p>
            </div>
            <div className="flex items-center justify-center bg-slate-800/50 rounded-2xl p-4 w-48 h-48 shrink-0">
              <img
                src={imageUrl}
                alt={pokemon.name}
                className="w-40 h-40 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Physical Stats */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
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
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Types</h2>
            <div className="space-y-3">
              {pokemon.types.map(({ type }) => (
                <div
                  key={type.name}
                  className={`rounded-full px-4 py-2 flex items-center justify-between ${TYPE_COLORS[type.name] ?? 'bg-gray-500'}`}
                >
                  <span className="font-semibold capitalize text-white">{type.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>
            <div className="space-y-3">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <div key={ability.name} className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="capitalize text-white font-semibold">{ability.name}</div>
                  {is_hidden && (
                    <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded mt-2 inline-block">
                      Hidden Ability
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Base Stats</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pokemon.stats.map(({ stat, base_stat }) => (
              <div key={stat.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{STAT_LABELS[stat.name] ?? stat.name}</span>
                  <span className="text-white font-semibold">{base_stat}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${STAT_COLORS[stat.name] ?? 'from-blue-500 to-blue-400'} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${(base_stat / STAT_MAX) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type Effectiveness */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 capitalize">
            {typeData ? `${typeData.name} ` : ''}Type Effectiveness
          </h2>
          {typeLoading ? (
            <p className="text-slate-400 animate-pulse">Loading type matchups...</p>
          ) : typeData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typeData.damage_relations.double_damage_from.length > 0 && (
                <DamageGroup
                  title="Weak Against (2×)"
                  types={typeData.damage_relations.double_damage_from}
                  borderColor="border-red-500"
                  bgColor="bg-red-500/20"
                  badgeColor="bg-red-600/30 text-red-200"
                />
              )}
              {typeData.damage_relations.double_damage_to.length > 0 && (
                <DamageGroup
                  title="Strong Against (2×)"
                  types={typeData.damage_relations.double_damage_to}
                  borderColor="border-green-500"
                  bgColor="bg-green-500/20"
                  badgeColor="bg-green-600/30 text-green-200"
                />
              )}
              {typeData.damage_relations.half_damage_from.length > 0 && (
                <DamageGroup
                  title="Resists Damage From (½×)"
                  types={typeData.damage_relations.half_damage_from}
                  borderColor="border-blue-500"
                  bgColor="bg-blue-500/20"
                  badgeColor="bg-blue-600/30 text-blue-200"
                />
              )}
              {typeData.damage_relations.half_damage_to.length > 0 && (
                <DamageGroup
                  title="Deal Less Damage To (½×)"
                  types={typeData.damage_relations.half_damage_to}
                  borderColor="border-purple-500"
                  bgColor="bg-purple-500/20"
                  badgeColor="bg-purple-600/30 text-purple-200"
                />
              )}
            </div>
          ) : null}
        </div>

        {/* Encounters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Pokémon Encounters</h2>
          {encounterLoading ? (
            <p className="text-slate-400 animate-pulse">Loading encounters...</p>
          ) : !encounters || encounters.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No encounter data available for this Pokémon.</p>
          ) : (
            <div className="space-y-3">
              {encounters.map((encounter) => {
                const firstVersion = encounter.version_details[0]
                const firstDetail = firstVersion?.encounter_details[0]
                const versions = encounter.version_details.map((v) => v.version.name).join(', ')
                const otherDetails = firstVersion?.encounter_details.slice(1) ?? []
                return (
                  <div
                    key={encounter.location_area.name}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-blue-400 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-blue-400 font-semibold capitalize">
                          {formatLocationName(encounter.location_area.name)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-300 text-sm">
                          <span className="text-blue-400 font-semibold">Method: </span>
                          <span className="capitalize">{firstDetail?.method.name ?? 'Unknown'}</span>
                        </p>
                        <p className="text-slate-300 text-sm">
                          <span className="text-blue-400 font-semibold">Chance: </span>
                          {firstDetail?.chance ?? 'N/A'}%
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-slate-300 text-sm">
                          <span className="text-blue-400 font-semibold">Version(s): </span>
                          <span className="capitalize">{versions}</span>
                        </p>
                      </div>
                      {otherDetails.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-blue-400 text-sm font-semibold mb-1">Other conditions:</p>
                          <div className="ml-4 space-y-1">
                            {otherDetails.map((detail, i) => (
                              <p key={i} className="text-slate-400 text-xs">
                                <span className="capitalize">{detail.method.name}</span> — Chance: {detail.chance}%
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BackButton() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6 no-underline"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to List
    </Link>
  )
}

function PhysicalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
    </div>
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
    <div className={`${bgColor} border-l-4 ${borderColor} rounded-lg p-4`}>
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <span key={t.name} className={`${badgeColor} px-3 py-1 rounded-full text-sm capitalize`}>
            {t.name}
          </span>
        ))}
      </div>
    </div>
  )
}
