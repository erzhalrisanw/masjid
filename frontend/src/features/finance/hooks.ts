import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractApiError } from '@/lib/api-client'
import { financeApi, type ListTransactionsParams, type TransactionType } from './api'

const KEYS = {
  summary: ['finance', 'summary'] as const,
  transactions: (p?: ListTransactionsParams) => ['finance', 'transactions', p] as const,
  transaction: (id: string) => ['finance', 'transaction', id] as const,
  categories: (type?: TransactionType) => ['finance', 'categories', type] as const,
  report: (year: number, month?: number) => ['finance', 'report', year, month] as const,
}

export const useFinanceSummary = () =>
  useQuery({ queryKey: KEYS.summary, queryFn: financeApi.summary })

export const useTransactions = (params: ListTransactionsParams) =>
  useQuery({
    queryKey: KEYS.transactions(params),
    queryFn: () => financeApi.listTransactions(params),
  })

export const useCategories = (type?: TransactionType) =>
  useQuery({
    queryKey: KEYS.categories(type),
    queryFn: () => financeApi.listCategories(type),
  })

export const useReport = (year: number, month?: number) =>
  useQuery({
    queryKey: KEYS.report(year, month),
    queryFn: () => financeApi.report(year, month),
  })

const invalidateFinance = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['finance'] })
}

export const useCreateTransaction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: financeApi.createTransaction,
    onSuccess: () => {
      invalidateFinance(qc)
      toast.success('Transaksi berhasil ditambahkan')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useUpdateTransaction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof financeApi.updateTransaction>[1] }) =>
      financeApi.updateTransaction(id, payload),
    onSuccess: () => {
      invalidateFinance(qc)
      toast.success('Transaksi berhasil diperbarui')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useDeleteTransaction = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: financeApi.deleteTransaction,
    onSuccess: () => {
      invalidateFinance(qc)
      toast.success('Transaksi berhasil dihapus')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: financeApi.createCategory,
    onSuccess: () => {
      invalidateFinance(qc)
      toast.success('Kategori berhasil ditambahkan')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: financeApi.deleteCategory,
    onSuccess: () => {
      invalidateFinance(qc)
      toast.success('Kategori berhasil dihapus')
    },
    onError: (e) => toast.error(extractApiError(e)),
  })
}
