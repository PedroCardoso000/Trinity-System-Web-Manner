import {  useState, type ReactNode } from 'react'
import { login as loginRequest } from '../services/authService'
import type { AuthUser, UserRole } from '../types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return { user: null as AuthUser | null, token: null as string | null }
  }

  const storedToken = localStorage.getItem('trinity_token')
  const storedUser = localStorage.getItem('trinity_user')

  if (!storedToken || !storedUser) {
    return { user: null as AuthUser | null, token: null as string | null }
  }

  try {
    const parsedUser = JSON.parse(storedUser) as AuthUser
    return { user: parsedUser, token: storedToken }
  } catch {
    localStorage.removeItem('trinity_token')
    localStorage.removeItem('trinity_user')
    return { user: null as AuthUser | null, token: null as string | null }
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const stored = readStoredAuth()
  const [user, setUser] = useState<AuthUser | null>(stored.user)
  const [token, setToken] = useState<string | null>(stored.token)

  async function handleLogin(email: string, password: string) {
    const response = await loginRequest({ email, password })
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem('trinity_token', response.token)
    localStorage.setItem('trinity_user', JSON.stringify(response.user))
  }

  function handleLogout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('trinity_token')
    localStorage.removeItem('trinity_user')
  }

  function hasRole(role: UserRole) {
    if (!user) return false
    return user.role === role
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login: handleLogin,
    logout: handleLogout,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

