import { api } from '@/lib/api-client'

export type TransactionType = 'PEMASUKAN' | 'PENGELUARAN'

export interface Category {
  id: string
  name: string
  type: TransactionType
  description?: string | null
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: string | number
  date: string
  description?: string | null
  reference?: string | null
  category: { id: string; name: string; type: TransactionType }
  createdBy: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  thisMonth: { income: number; expense: number; net: number }
}

export interface Paginated<T> {
  data: T[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export interface ListTransactionsParams {
  page?: number
  pageSize?: number
  type?: TransactionType
  categoryId?: string
  startDate?: string
  endDate?: string
  search?: string
}

export const financeApi = {
  summary: () => api.get<FinanceSummary>('/transactions/summary').then((r) => r.data),

  listTransactions: (params: ListTransactionsParams = {}) =>
    api.get<Paginated<Transaction>>('/transactions', { params }).then((r) => r.data),

  getTransaction: (id: string) =>
    api.get<{ transaction: Transaction }>(`/transactions/${id}`).then((r) => r.data.transaction),

  createTransaction: (payload: {
    type: TransactionType
    amount: number
    categoryId: string
    date?: string
    description?: string
    reference?: string
  }) =>
    api
      .post<{ transaction: Transaction }>('/transactions', payload)
      .then((r) => r.data.transaction),

  updateTransaction: (
    id: string,
    payload: Partial<{
      amount: number
      categoryId: string
      date: string
      description: string | null
      reference: string | null
    }>,
  ) =>
    api
      .patch<{ transaction: Transaction }>(`/transactions/${id}`, payload)
      .then((r) => r.data.transaction),

  deleteTransaction: (id: string) =>
    api.delete(`/transactions/${id}`).then((r) => r.data),

  report: (year: number, month?: number) =>
    api
      .get('/transactions/report', { params: { year, month } })
      .then((r) => r.data),

  listCategories: (type?: TransactionType) =>
    api
      .get<{ data: Category[] }>('/categories', { params: { type } })
      .then((r) => r.data.data),

  createCategory: (payload: {
    name: string
    type: TransactionType
    description?: string
  }) =>
    api
      .post<{ category: Category }>('/categories', payload)
      .then((r) => r.data.category),

  updateCategory: (
    id: string,
    payload: { name?: string; description?: string | null },
  ) =>
    api
      .patch<{ category: Category }>(`/categories/${id}`, payload)
      .then((r) => r.data.category),

  deleteCategory: (id: string) =>
    api.delete(`/categories/${id}`).then((r) => r.data),
}
