import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SummaryCards } from '@/features/finance/components/summary-cards'
import { TransactionsTable } from '@/features/finance/components/transactions-table'

export function Dashboard() {
  return (
    <>
      <Header>
        <div className='ms-auto flex items-center gap-2'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Dasbor</h1>
          <p className='text-muted-foreground'>
            Ringkasan keuangan & aktivitas terbaru Masjid Sayyidina Abubakar.
          </p>
        </div>

        <div className='space-y-6'>
          <SummaryCards />
          <div>
            <h2 className='mb-3 text-lg font-semibold'>Transaksi Terbaru</h2>
            <TransactionsTable pageSize={5} />
          </div>
        </div>
      </Main>
    </>
  )
}
