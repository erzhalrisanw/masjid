import { createFileRoute } from '@tanstack/react-router'
import { LaporanPage } from '@/features/finance/pages/laporan-page'

export const Route = createFileRoute('/_authenticated/finance/laporan')({
  component: LaporanPage,
})
