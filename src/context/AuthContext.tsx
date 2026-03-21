import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthUser } from '../types/auth'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const API_URL = 'http://localhost:3333'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loginWithGithub: () => void
  handleCallback: (token: string, user: unknown) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload.padEnd(payload.length + (4 - (payload.length % 4 || 4)) % 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function userFromToken(token: string): AuthUser {
  const p = decodeJwtPayload(token) ?? {}
  const id = Number(p['id'] ?? p['sub'] ?? 0)
  return {
    id: isNaN(id) ? 0 : id,
    fullName: (p['fullName'] ?? p['name'] ?? 'Authenticated User') as string,
    email: (p['email'] ?? '') as string,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (token && !user) {
      const fallback = userFromToken(token)
      setUser(fallback)
      localStorage.setItem(USER_KEY, JSON.stringify(fallback))
    }
  }, [token, user])

  const loginWithGithub = () => window.location.assign(`${API_URL}/auth/github`)

  const handleCallback = (rawToken: string, rawUser: unknown) => {
    const normalized = rawToken.trim().replace(/^bearer /i, '')
    const u = (rawUser ?? {}) as Record<string, unknown>
    const authUser: AuthUser = {
      id: Number(u['id'] ?? 0),
      fullName: (u['fullName'] ?? u['name'] ?? u['login'] ?? 'GitHub User') as string,
      email: (u['email'] ?? '') as string,
    }
    localStorage.setItem(TOKEN_KEY, normalized)
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    setToken(normalized)
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, loginWithGithub, handleCallback, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
