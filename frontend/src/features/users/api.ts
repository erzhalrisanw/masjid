import { api } from '@/lib/api-client'
import type { Role } from '@/stores/auth-store'

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Paginated<T> {
  data: T[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export interface ListUsersParams {
  page?: number
  pageSize?: number
  search?: string
  role?: Role
}

export const usersApi = {
  list: (params: ListUsersParams = {}) =>
    api.get<Paginated<User>>('/users', { params }).then((r) => r.data),

  create: (payload: {
    name: string
    email: string
    password: string
    phone?: string
    role: Role
  }) => api.post<{ user: User }>('/users', payload).then((r) => r.data.user),

  update: (
    id: string,
    payload: Partial<{
      name: string
      phone: string | null
      role: Role
      isActive: boolean
      password: string
    }>,
  ) => api.patch<{ user: User }>(`/users/${id}`, payload).then((r) => r.data.user),

  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
}
