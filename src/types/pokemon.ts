export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: Array<{ type: { name: string; url: string } }>
  height: number
  weight: number
  base_experience: number
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  abilities: Array<{
    ability: { name: string }
    is_hidden: boolean
  }>
}

export interface PokemonTypeData {
  name: string
  damage_relations: {
    double_damage_from: Array<{ name: string }>
    double_damage_to: Array<{ name: string }>
    half_damage_from: Array<{ name: string }>
    half_damage_to: Array<{ name: string }>
  }
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListPage {
  count: number
  next: string | null
  results: PokemonListItem[]
}

export interface Encounter {
  location_area: { name: string; url: string }
  version_details: Array<{
    version: { name: string }
    max_chance: number
    encounter_details: Array<{
      chance: number
      method: { name: string }
      min_level: number
      max_level: number
    }>
  }>
}
export interface FavoritePokemon {
  id: number
  userId: number
  pokemonId: number
}