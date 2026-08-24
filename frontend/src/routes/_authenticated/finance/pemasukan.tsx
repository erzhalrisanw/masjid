import { createFileRoute } from '@tanstack/react-router'
import { PemasukanPage } from '@/features/finance/pages/pemasukan-page'

export const Route = createFileRoute('/_authenticated/finance/pemasukan')({
  component: PemasukanPage,
})
