import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
`

const AuthMessage = styled.p`
  color: #fff;
  font-size: 1.25rem;
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
    <Container>
      <AuthMessage>Authenticating...</AuthMessage>
    </Container>
  )
}
