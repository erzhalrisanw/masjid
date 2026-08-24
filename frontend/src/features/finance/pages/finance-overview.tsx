import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { SummaryCards } from '../components/summary-cards'
import { TransactionsTable } from '../components/transactions-table'

export function FinanceOverview() {
  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold'>Ringkasan Keuangan</h1>
      </Header>
      <Main>
        <div className='space-y-6'>
          <SummaryCards />
          <div>
            <h2 className='mb-3 text-lg font-semibold'>Transaksi Terbaru</h2>
            <TransactionsTable pageSize={10} />
          </div>
        </div>
      </Main>
    </>
  )
}
