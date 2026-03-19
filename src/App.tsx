import { usePokemonStore } from './store/usePokemonStore'
import { PokemonCard } from './components/PokemonCard'

const TOTAL_POKEMON = 151

function App() {
  const { selectedPokemonId, setSelectedPokemonId } = usePokemonStore()

  return (
    <div className="min-h-screen bg-red-600 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-wide">
        Pokédex
      </h1>

      <PokemonCard id={selectedPokemonId} />

      <div className="flex items-center gap-4 mt-8">
        <button
          className="rounded-full bg-white px-5 py-2 font-semibold text-red-600 shadow hover:bg-gray-100 disabled:opacity-40"
          onClick={() => setSelectedPokemonId(selectedPokemonId - 1)}
          disabled={selectedPokemonId <= 1}
        >
          ← Prev
        </button>
        <span className="text-white font-medium">
          #{String(selectedPokemonId).padStart(3, '0')}
        </span>
        <button
          className="rounded-full bg-white px-5 py-2 font-semibold text-red-600 shadow hover:bg-gray-100 disabled:opacity-40"
          onClick={() => setSelectedPokemonId(selectedPokemonId + 1)}
          disabled={selectedPokemonId >= TOTAL_POKEMON}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default App
