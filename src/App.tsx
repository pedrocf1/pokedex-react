import { Routes, Route } from 'react-router-dom'
import { PokemonListPage } from './pages/PokemonListPage'
import { PokemonDetailPage } from './pages/PokemonDetailPage'
import { OAuthCallbackPage } from './pages/OAuthCallbackPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokemonListPage />} />
      <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
    </Routes>
  )
}

export default App
