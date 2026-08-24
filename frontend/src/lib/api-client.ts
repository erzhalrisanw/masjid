import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken, setAccessToken, setRefreshToken, reset } =
    useAuthStore.getState().auth
  if (!refreshToken) throw new Error('Tidak ada refresh token')

  try {
    const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    return data.accessToken as string
  } catch (e) {
    reset()
    throw e
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const token = await refreshPromise
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

export const extractApiError = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { error?: { message?: string } } | undefined
    return data?.error?.message ?? e.message
  }
  return e instanceof Error ? e.message : 'Terjadi kesalahan'
}
