import { createFileRoute } from '@tanstack/react-router'
import { FinanceOverview } from '@/features/finance/pages/finance-overview'

export const Route = createFileRoute('/_authenticated/finance/')({
  component: FinanceOverview,
})
