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
  Building2,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin Masjid',
    email: 'admin@masjid.local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Masjid Sayyidina Abubakar',
      logo: Building2,
      plan: 'Sistem Manajemen',
    },
  ],
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
