import { createFileRoute } from '@tanstack/react-router'
import { KategoriPage } from '@/features/finance/pages/kategori-page'

export const Route = createFileRoute('/_authenticated/finance/kategori')({
  component: KategoriPage,
})
