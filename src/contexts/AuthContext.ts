import { createContext } from 'react'
import type { AuthUser, UserRole } from '../types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (role: UserRole) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

