import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  FolderTree,
  BarChart3,
  Users,
  Settings,
  UserCog,
  Palette,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Umum',
      items: [
        {
          title: 'Dasbor',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Manajemen Keuangan',
      items: [
        {
          title: 'Ringkasan',
          url: '/finance',
          icon: Wallet,
        },
        {
          title: 'Pemasukan',
          url: '/finance/pemasukan',
          icon: ArrowDownCircle,
        },
        {
          title: 'Pengeluaran',
          url: '/finance/pengeluaran',
          icon: ArrowUpCircle,
        },
        {
          title: 'Kategori',
          url: '/finance/kategori',
          icon: FolderTree,
        },
        {
          title: 'Laporan',
          url: '/finance/laporan',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Manajemen Pengguna',
      items: [
        {
          title: 'Daftar Pengguna',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Lainnya',
      items: [
        {
          title: 'Pengaturan',
          icon: Settings,
          items: [
            {
              title: 'Profil',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Tampilan',
              url: '/settings/appearance',
              icon: Palette,
            },
          ],
        },
      ],
    },
  ],
}
