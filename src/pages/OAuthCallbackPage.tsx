import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const { handleCallback } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const user = params.get('user')
    if (token && user) {
      handleCallback(token, JSON.parse(decodeURIComponent(user)))
    }
    navigate('/', { replace: true })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-800 flex items-center justify-center">
      <p className="text-white text-xl animate-pulse">Authenticating...</p>
    </div>
  )
}
