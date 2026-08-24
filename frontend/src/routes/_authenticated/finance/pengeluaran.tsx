import { createFileRoute } from '@tanstack/react-router'
import { PengeluaranPage } from '@/features/finance/pages/pengeluaran-page'

export const Route = createFileRoute('/_authenticated/finance/pengeluaran')({
  component: PengeluaranPage,
})
