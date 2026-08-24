import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'masjid_access_token'
const REFRESH_TOKEN_KEY = 'masjid_refresh_token'
const USER_KEY = 'masjid_user'

export type Role = 'SUPER_ADMIN' | 'BENDAHARA' | 'PENGURUS' | 'JAMAAH'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  phone?: string | null
  isActive?: boolean
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    refreshToken: string
    setUser: (user: AuthUser | null) => void
    setAccessToken: (token: string) => void
    setRefreshToken: (token: string) => void
    setSession: (payload: {
      user: AuthUser
      accessToken: string
      refreshToken: string
    }) => void
    reset: () => void
  }
}

const readJSON = <T,>(key: string): T | null => {
  const raw = getCookie(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const readString = (key: string): string => {
  const raw = getCookie(key)
  if (!raw) return ''
  try {
    return JSON.parse(raw) as string
  } catch {
    return ''
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: readJSON<AuthUser>(USER_KEY),
    accessToken: readString(ACCESS_TOKEN_KEY),
    refreshToken: readString(REFRESH_TOKEN_KEY),

    setUser: (user) =>
      set((state) => {
        if (user) setCookie(USER_KEY, JSON.stringify(user))
        else removeCookie(USER_KEY)
        return { auth: { ...state.auth, user } }
      }),

    setAccessToken: (accessToken) =>
      set((state) => {
        setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
        return { auth: { ...state.auth, accessToken } }
      }),

    setRefreshToken: (refreshToken) =>
      set((state) => {
        setCookie(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken))
        return { auth: { ...state.auth, refreshToken } }
      }),

    setSession: ({ user, accessToken, refreshToken }) =>
      set((state) => {
        setCookie(USER_KEY, JSON.stringify(user))
        setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
        setCookie(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken))
        return {
          auth: { ...state.auth, user, accessToken, refreshToken },
        }
      }),

    reset: () =>
      set((state) => {
        removeCookie(USER_KEY)
        removeCookie(ACCESS_TOKEN_KEY)
        removeCookie(REFRESH_TOKEN_KEY)
        return {
          auth: {
            ...state.auth,
            user: null,
            accessToken: '',
            refreshToken: '',
          },
        }
      }),
  },
}))
