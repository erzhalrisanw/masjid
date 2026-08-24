import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet } from 'lucide-react'
import { formatIDR } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinanceSummary } from '../hooks'

export function SummaryCards() {
  const { data, isLoading } = useFinanceSummary()

  const items = [
    {
      title: 'Saldo Saat Ini',
      value: data?.balance ?? 0,
      icon: Wallet,
      color: 'text-blue-600',
    },
    {
      title: 'Total Pemasukan',
      value: data?.totalIncome ?? 0,
      icon: ArrowDownCircle,
      color: 'text-emerald-600',
    },
    {
      title: 'Total Pengeluaran',
      value: data?.totalExpense ?? 0,
      icon: ArrowUpCircle,
      color: 'text-rose-600',
    },
    {
      title: 'Bulan Ini (Net)',
      value: data?.thisMonth.net ?? 0,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {items.map((it) => (
        <Card key={it.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {it.title}
            </CardTitle>
            <it.icon className={`h-5 w-5 ${it.color}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : formatIDR(it.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
