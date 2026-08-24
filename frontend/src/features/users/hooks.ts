import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractApiError } from '@/lib/api-client'
import { usersApi, type ListUsersParams } from './api'

export const useUsers = (params: ListUsersParams) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
  })

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Pengguna berhasil ditambahkan')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof usersApi.update>[1] }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Pengguna berhasil diperbarui')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Pengguna berhasil dihapus')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}
