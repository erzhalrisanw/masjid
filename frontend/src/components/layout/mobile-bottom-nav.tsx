import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const items = [
  { title: 'Dasbor', to: '/', icon: LayoutDashboard, match: (p: string) => p === '/' },
  {
    title: 'Masuk',
    to: '/finance/pemasukan',
    icon: ArrowDownCircle,
    match: (p: string) => p.startsWith('/finance/pemasukan'),
  },
  {
    title: 'Keluar',
    to: '/finance/pengeluaran',
    icon: ArrowUpCircle,
    match: (p: string) => p.startsWith('/finance/pengeluaran'),
  },
  {
    title: 'Laporan',
    to: '/finance/laporan',
    icon: BarChart3,
    match: (p: string) => p.startsWith('/finance/laporan'),
  },
  {
    title: 'Pengguna',
    to: '/users',
    icon: Users,
    match: (p: string) => p.startsWith('/users'),
  },
] as const

export function MobileBottomNav() {
  const location = useLocation()
  const path = location.pathname

  return (
    <nav
      className='fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden'
      aria-label='Navigasi bawah'
    >
      <ul className='grid grid-cols-5'>
        {items.map((item) => {
          const active = item.match(path)
          const Icon = item.icon
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className='h-5 w-5' strokeWidth={active ? 2.4 : 2} />
                <span className='text-[11px] leading-none'>{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
